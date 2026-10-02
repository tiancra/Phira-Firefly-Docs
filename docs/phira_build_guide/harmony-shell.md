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

按 [OpenHarmony 构建指南](./OpenHarmony) 的流程，结合本仓库：

```bash
# 1. 装 Rust ohos target
rustup target add aarch64-unknown-linux-ohos

# 2. 下载 Command Line Tools for HMOS（≥ 6.0.0 / API 20）并设置：
export OHOS_NDK_HOME=/你的路径/command-line-tools/sdk/default/openharmony

# 3. 装 ohrs
cargo install ohrs

# 4. 配置 .cargo/config.toml（CMAKE/toolchain/ninja 指向 NDK）
#    本仓库提供现成模板：ohos-build/.cargo/config.toml

# 5. 编译（必须进 phira 目录）
cd phira
ohrs build --release --arch aarch
```

产物：`phira/dist/arm64-v8a/libphira.so`。

### 静态库（prpr-avc）

视频解码静态库会自动获取：构建脚本读取 `prpr-avc/ffmpeg-version`，没有对应版本就自动从 GitHub Release 下载（见 [静态库](./StaticLib)）。**服务器需要能访问 GitHub Release**；下载失败就手动放。

### 一键脚本

配套的 `ohos-build` 包已把上述步骤写成脚本（检查 target / 装 ohrs / 校验 NDK / 构建），按包内 README 使用即可。

## 在 Windows 上打包 HAP

1. 把 `libphira.so` 复制到外壳工程的 `entry/libs/arm64-v8a/`。
2. 把游戏 `assets/` 复制到 `entry/src/main/resources/resfile/assets`（**黑屏多半是资源没放全**，可从官方 Release 拿一份对比）。
3. DevEco Studio 打开工程 → `Project Structure → Signing configs → Automatically generate signature`（需登录华为开发者账号）→ Apply。
4. 连接模拟器/真机（设备需在 DevEco 中注册），编译运行。

## 常见问题

| 现象 | 处理 |
| --- | --- |
| 启动黑屏 | 检查 `resfile/assets` 资源是否完整 |
| 提示找不到某个导出函数 | fork 与上游 N-API 接口差异，按接口清单补导出 |
| 奇怪的编译报错 | 换 WSL/arm64 Mac 编译，或检查 `OHOS_NDK_HOME` 与 config.toml 路径 |
| 输入法弹不出 / 文字进不去 | 外壳需调 `set_input_text` 转发输入法文本 |
