# 构建指南
Windows GNU：[here](./Windows_Gnu.md)  
Windows MSVC：[here](./Windows_Msvc.md)  
Linux：[here](./Linux.md)  
macOS：[here](./macOS.md)  
iOS：[here](./iOS.md)
Android：[here](./Android.md)
OpenHarmony：[here](./OpenHarmony.md)

## Phira-Firefly 构建说明

构建流程与原版基本一致，以下几点对本分支有效：

- 桌面版（Windows / Linux / macOS）：`cargo build --release -p phira-main`，产物在 `target/release/phira-main(.exe)`。
- Android：使用 `cargo ndk` 交叉编译（参考仓库内 `.github/workflows/build.yml`）：

  ```shell
  cargo ndk -t arm64-v8a --platform 35 build --release --features "phira/chat"
  ```

  产物为 `target/aarch64-linux-android/release/libphira.so`，需要先安装 Android SDK / NDK r27c 与 `cargo-ndk`。
- 版本号：当前为 `0.9.4-CBT3`。
- 依赖说明：部分组件使用分支维护的独立仓库版本，首次编译拉取依赖时间可能稍长。
