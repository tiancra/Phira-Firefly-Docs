# 主题开发指南

本文面向想给 Phira-Firefly 制作主题的创作者。主题可以替换游戏菜单界面的**图片**与**音效**，不改变游玩判定与谱面表现。

## 主题长什么样

一个主题就是一个文件夹（主题 id 即文件夹名），包含一个 `config.json` 和若干资源文件：

```txt
my-theme/
├── config.json        # 主题配置（必需）
├── cover.png          # 主题封面（列表里展示用）
├── bg.jpg             # 自定义资源，被 config.json 引用
└── button.ogg         # 自定义音效
```

内置默认主题位于游戏目录的 `assets/theme/default/`，可以直接参考它的结构。

## config.json 格式

```json
{
  "name": "我的主题",
  "description": "粉色赛高",
  "cover": "./cover.png",
  "texture": [
    { "key": "background", "path": "bg.jpg" }
  ],
  "audio": [
    { "key": "bgm", "path": "bgm.ogg" }
  ]
}
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `name` | 是 | 主题名称，显示在主题列表 |
| `description` | 否 | 主题简介 |
| `cover` | 是 | 封面图路径（相对主题目录），封面必须能正常加载，否则导入失败 |
| `texture` | 否 | 要替换的图片资源列表 |
| `audio` | 否 | 要替换的音频资源列表 |

`texture` / `audio` 中的每一项是 `{ "key": ..., "path": ... }`：`key` 表示替换哪类资源（见下表），`path` 是你的资源文件路径（相对主题目录，可用 `./` 开头）。文件不存在或 `key` 不认识时该项会被忽略，不影响其他资源。

## 可替换的图片（texture key）

| key | 替换内容 |
| --- | --- |
| `background` | 主界面背景 |
| `abstract` | 抽象背景 |
| `splash` | 启动界面（开屏画面） |
| `boot` | 启动界面后的 Logo 画面 |
| `player` | 玩家形象 |
| `icon` | 游戏图标 |
| `rank_phi` / `rank_fc` / `rank_s` / `rank_a` / `rank_b` / `rank_c` / `rank_f` / `rank_v` | 结算界面的各评级徽章 |
| `mod_autoplay` / `mod_fade_in` / `mod_fade_out` / `mod_flip_x` / `mod_nightcore` / `mod_no_shader` / `mod_rainbow` | 各 Mod 的图标 |

## 可替换的音频（audio key）

| key | 替换内容 |
| --- | --- |
| `bgm` | 主界面背景音乐 |
| `splash` | 启动界面音乐 |
| `button` / `button_large` | 按钮音效 |
| `switch` / `click` | 开关 / 点击音效 |
| `drag` / `flick` | 游玩中拖拽 / 滑动音效 |
| `cali` / `cali_hit` | 校准音效 |
| `ending` | 结算音效 |
| `enterlibrary` | 进入曲库音效 |
| `chartpreview` | 谱面预览音效 |
| `startplaying` | 开始游玩音效 |
| `entersplash` | 进入启动界面音效 |
| `trackskip` | 跳过曲目音效 |
| `enter` | 通用进入音效 |
| `toast_ok` / `toast_warning` / `toast_error` | 提示音效 |

## 打包与导入

1. 把 `config.json` 和所有资源放进一个文件夹，**`config.json` 必须放在 zip 根目录**。
2. 压缩为 zip（zip 内结构如上面的目录示例）。
3. 在游戏 **设置 → 主题** 页面点导入按钮选择该 zip。

导入时会做两次校验：zip 内能读到合法 `config.json`，解压后 `config.json` 与封面都能正常加载。不满足会被拒绝导入（已创建的文件会自动清理）。

## 应用与调试

- 在主题列表选中主题 → **应用**，重启游戏后生效。
- 想快速调试？把主题文件夹直接放到游戏目录 `assets/theme/<你的主题id>/` 下，重启即可在列表里看到（默认主题 `assets/theme/default/` 也可以直接改）。
- 应用的主题如果资源缺失或配置损坏，游戏会**自动回退到默认资源**，不会阻止启动。
- 主题 id 就是文件夹名（导入的主题 id 是随机生成的），列表里展示的是 `config.json` 里的 `name`。
