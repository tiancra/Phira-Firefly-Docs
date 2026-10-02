# 鸿蒙外壳开发指南（Phira-Firefly）

> 目标：把 Phira-Firefly 打包成 **HarmonyOS NEXT（纯血鸿蒙）** 应用。Rust 内核编译成 `libphira.so`，外面套一个 ArkTS 外壳（HAP），通过 **N-API** 桥接。

## 总体分工

```
┌─ Linux 服务器 ──────────────────────────┐
│ 编译内核 → libphira.so（arm64）          │
└──────────────┬──────────────────────────┘
               ▼
┌─ Windows（DevEco Studio）───────────────┐
│ 外壳工程（ArkTS HAP）+ .so + 签名 → HAP │
└──────────────┬──────────────────────────┘
               ▼
        鸿蒙模拟器 / 真机
```

- **编译 .so**：在你的 Linux 服务器上做（DevEco Studio 没有 Linux 版）。
- **打包 HAP**：必须在 Windows 的 DevEco Studio 里做（需要华为开发者账号签名）。

## 两条外壳路线

### 路线 A：用上游现成外壳（推荐先跑通）

TeamFlos 官方维护了鸿蒙外壳工程：

```
git clone https://github.com/TeamFlos/phira-ohos
```

拿到后：

1. 把编译好的 `libphira.so` 复制到 `entry/libs/arm64-v8a/`。
2. 把 `assets/` 文件夹复制到 `entry/src/main/resources/resfile/assets`（外壳不包含游戏资源）。
3. DevEco Studio 打开工程，`Project Structure → Signing configs → Automatically generate signature`，Apply 触发 Sync。
4. 编译运行。

改包名/图标/应用名即可作为 Phira-Firefly 的鸿蒙版。此路线的坑：上游内核与 fork 的 N-API 接口可能有差异（见下节接口清单），如果遇到"调不到某个导出函数"的报错，就按路线 B 的思路补接口。

### 路线 B：自研外壳（参考 Android 的写法）

Android 没有开源外壳工程，官方做法是"APK 壳 + JNI 替换 libphira.so"（见 [Android 构建指南](./Android)）。核心思想就是**外壳用平台语言（Kotlin/ArkTS）写 UI 和系统交互，把游戏画面和逻辑放进一个原生视图，通过 FFI（JNI/N-API）调用 Rust 内核导出的一堆函数**。

鸿蒙自研外壳结构：

```
entry/ (ArkTS)
├── XComponent            # 承载游戏画面（EGL/OpenGL ES 或 Vulkan）
├── Native N-API 调用     # 调 libphira.so 导出的函数
└── 生命周期/输入/文件/音频焦点 → 转发给内核
```

## 内核已导出的外壳接口

fork 的 `phira/src/lib.rs` 里，Android 用 JNI（`Java_quad_1native_QuadNative_*`），鸿蒙用 N-API（`#[napi]`）。

### Android 侧（参考用，完整清单）

| JNI 导出 | 作用 |
| --- | --- |
| `initializeEnvironment` | 初始化环境 |
| `prprActivityOnPause / OnResume / OnDestroy` | 生命周期 |
| `setDataPath(path)` / `setTempDir(path)` | 数据/临时目录 |
| `setDpi(dpi)` | 屏幕密度 |
| `setChosenFile(file)` / `markImport` / `markImportRespack` / `markAutoImport` | 文件选择与导入 |
| `setInputText(text)` | 输入法文本注入 |
| `setStartupArgs(join, create, server)` | 联机启动参数 |
| `antiAddictionCallback(code)` | 防沉迷回传 |
| `inputSelectAll / Backspace / Copy / Cut / Paste` | 输入编辑操作 |

### 鸿蒙侧（fork 现成，外壳可直接调）

| N-API 导出 | 作用 | 对应 Android |
| --- | --- | --- |
| `set_input_text(text: String)` | 输入法文本注入 | `setInputText` |
| `set_chosen_file(file: String)` | 文件选择回传 | `setChosenFile` |
| `mark_auto_import()` | 标记自动导入 | `markAutoImport` |

**自研外壳时，以下桥接 fork 还没有，需要自己补**（在 `phira/src/lib.rs` 加 `#[cfg(target_env = "ohos")] #[napi]` 导出，参照 Android 同名函数实现）：

- 生命周期：pause / resume / destroy（对应 `prprActivityOnPause/OnResume/OnDestroy`）
- 数据与临时目录：`set_data_path` / `set_temp_dir`（对应 `setDataPath` / `setTempDir`）
- 屏幕密度：`set_dpi`
- 导入标记：`mark_import` / `mark_import_respack`
- 联机启动参数：`set_startup_args`
- 输入编辑：`input_select_all` / `input_backspace` / `input_copy` / `input_cut` / `input_paste`

> 如果走路线 A（phira-ohos），这些接口上游外壳里可能已经按上游内核实现；fork 与上游的差异主要在导出函数名（Rust 侧 `snake_case` vs JNI `camelCase`），遇到链接/运行时"找不到符号"时按上表对号补即可。

## 在 Linux 服务器上编译 .so

> DevEco Studio 没有 Linux 版，所以内核 `.so` 在你的 Linux 服务器上编译，HAP 打包在 Windows 的 DevEco Studio 里做。下面每一步都可直接复制执行。

### 第 1 步：装 Rust 与 ohos target

```bash
# 没装 Rust 的话先装（已装跳过）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# 加鸿蒙 arm64 编译目标
rustup target add aarch64-unknown-linux-ohos
```

> Phira-Firefly 的 `rust-toolchain.toml` 指定了 nightly，进入仓库目录后 rustup 会自动切到对应 nightly 并下载。target 装到当前 toolchain 即可。

### 第 2 步：下载 Command Line Tools for HMOS 并配置 OHOS_NDK_HOME

在华为开发者官网下载 Linux 版 **Command Line Tools for HMOS**（版本 ≥ 6.0.0 / API 20）：

https://developer.huawei.com/consumer/cn/download/command-line-tools-for-hmos

```bash
mkdir -p /opt/ohos-sdk && cd /opt/ohos-sdk
# 把下载的压缩包放到这里，解压（按实际文件名）
unzip commandline-tools-linux-*.zip
# 确认目录结构：解压后有 command-line-tools/sdk/default/openharmony/native/...
ls command-line-tools/sdk/default/openharmony/native/build/cmake/

# 设置环境变量并写入 ~/.bashrc 永久生效
echo 'export OHOS_NDK_HOME=/opt/ohos-sdk/command-line-tools/sdk/default/openharmony' >> ~/.bashrc
source ~/.bashrc

# 验证（必须输出 OK）
test -f "$OHOS_NDK_HOME/native/build/cmake/ohos.toolchain.cmake" && echo OK
```

### 第 3 步：装 ohrs 构建工具

```bash
cargo install ohrs
```

> 编译较久（Rust 工具链），等它完成即可。装完 `ohrs --version` 可验证。

### 第 4 步：准备仓库与构建配置

```bash
git clone https://github.com/tiancra/Phira-Firefly.git
cd Phira-Firefly

# 放 .cargo/config.toml（CMAKE/toolchain/ninja 指向 NDK，模板见 ohos-build 包）
mkdir -p .cargo
cp /你的路径/ohos-build/.cargo/config.toml .cargo/
```

### 第 5 步：构建

```bash
# 用一键脚本（自动检查 target/ohrs/NDK）
bash /你的路径/ohos-build/build-ohos.sh

# 或手动执行：
cd phira
ohrs build --release --arch aarch
```

产物在 `phira/dist/arm64-v8a/libphira.so`：

```bash
ls -lh phira/dist/arm64-v8a/libphira.so
```

### 第 6 步：把 .so 传回 Windows

```bash
scp phira/dist/arm64-v8a/libphira.so 你的用户名@你的WindowsIP:D:/harmony/entry/libs/arm64-v8a/
```

> 目录不存在就手动在 Windows 上创建；也可以直接用共享文件夹/U盘拷贝。

### 静态库（prpr-avc）说明

视频解码静态库会自动获取：构建脚本读取 `prpr-avc/ffmpeg-version`，没有对应版本就自动从 GitHub Release 下载（见 [静态库](./StaticLib)）。**服务器需要能访问 GitHub Release**；下载失败就手动放。

### Linux 构建常见报错

| 报错 | 原因与处理 |
| --- | --- |
| 找不到 cmake / CMakeLists 相关错误 | `OHOS_NDK_HOME` 没设对或没生效：`echo $OHOS_NDK_HOME`，重新 `source ~/.bashrc` |
| prpr-avc 静态库下载失败 | 服务器访问不了 GitHub Release。手动下载对应 target 的静态库包解压到 `prpr-avc/static-lib/<target>/` 并写 `.version`（见[静态库](./StaticLib)） |
| 奇奇怪怪的编译报错 | 检查 Command Line Tools 版本 ≥ 6.0.0（API 20）；或换 WSL/arm64 Mac 编译 |
| 缺 nightly 工具链 | 进入仓库目录跑 `rustup toolchain list`，让 rustup 自动装 `rust-toolchain.toml` 指定的版本 |

## 在 Windows 上打包 HAP

### 第 1 步：获取外壳工程

```powershell
git clone https://github.com/TeamFlos/phira-ohos
```

用 **DevEco Studio → File → Open** 打开这个工程，首次打开会自动 Sync 下载依赖（耐心等）。

### 第 2 步：放 .so 和游戏资源

```powershell
# 1. .so 放进外壳工程（没有 libs 目录就手动创建）
#    D:\harmony\entry\libs\arm64-v8a\libphira.so

# 2. 把游戏 assets 整个复制进去（不放全会黑屏）
#    来源：D:\Phira\Phira-Firefly\assets
#    目标：D:\harmony\entry\src\main\resources\resfile\assets
Copy-Item "D:\Phira\Phira-Firefly\assets" "D:\harmony\entry\src\main\resources\resfile\assets" -Recurse
```

> 资源不全会导致启动黑屏。缺文件可以从官方 Phira Release 里拿一份对比补全。

### 第 3 步：签名

1. 注册/登录**华为开发者账号**（免费，https://developer.huawei.com/consumer/）
2. DevEco Studio → **File → Project Structure → Signing Configs**
3. 勾选 **Automatically generate signature**，登录华为账号
4. 点 **Apply**，工程自动触发 Sync 并生成调试签名

### 第 4 步：运行到模拟器

1. **Device Manager**（右侧边栏）→ **Local Emulator** → 点 + 新建设备（选 Phone）
2. 首次会提示下载系统镜像（SDK/模拟器已放 D 盘的话会下到 D 盘）
3. 启动模拟器，等它完全开机（冷启动较慢）
4. 菜单 **Run → Run 'entry'**，选择模拟器，编译安装

看到游戏画面进主菜单即成功。之后日常调试用热启动就行。

### 运行常见问题

| 现象 | 处理 |
| --- | --- |
| 启动黑屏 | `resfile/assets` 资源不完整，补全重装 |
| 提示找不到某个导出函数 / so 加载失败 | fork 与上游内核 N-API 接口差异，按上文接口清单在 `phira/src/lib.rs` 补 `#[napi]` 导出，重编 .so |
| 签名报错 / 无法 Sync | 确认已登录华为账号、网络可达；自动签名首次要联网生成证书 |
| 模拟器起不来 | 先冷启动一次；还不行在 Device Manager 删掉重建 |
| 输入法弹不出 / 文字进不去 | 外壳需调 `set_input_text` 转发输入法文本 |
