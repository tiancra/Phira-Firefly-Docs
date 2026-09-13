# 歌词

**Phira-Firefly 新增特性**：谱面可以附带歌词文件，游玩时游戏会同步显示歌词（逐词推进、主唱/合唱/背景多角色区分）。

## 如何添加歌词

把歌词文件放进谱面压缩包的**根目录**即可，游戏会自动识别：

- `lyrics.ttml` / `lyric.ttml`（TTML 格式）
- `lyrics.lrc` / `lyric.lrc`（LRC 格式）
- `ttml` / `lrc`（无扩展名时按内容识别）

## 用在线工具制作歌词

推荐使用 **Apple Music-like Lyrics TTML Tool** 在线制作 TTML 歌词：

**[https://amll-ttml-tool.stevexmh.net/](https://amll-ttml-tool.stevexmh.net/)**

简要流程：

1. 打开工具，在菜单中**导入现有歌词**（或新建歌词行）。
2. **打轴**：给每行歌词设置起止时间，再逐词标注时间（`Word Timing`），歌曲放起来对一遍即可。
3. 需要多角色时，把行标记为 **Vocal（主唱）/ Duet（合唱）/ Background（背景人声）**，对应游戏内的不同显示样式。
4. 可选：添加**翻译行 / 罗马音行**（游戏会忽略这些辅助行，只显示原文）。
5. **导出**为 TTML 文件（默认文件名为 `lyric.ttml`），放进谱面压缩包根目录即可。

::: tip 提示
导出文件的默认名称 `lyric.ttml` 游戏可以直接识别；想用 `lyrics.ttml` 的话改个名就行。
:::

## 时间格式

两种格式都支持以下时间写法：

- `mm:ss`（如 `01:23`）
- `hh:mm:ss`（如 `00:01:23`）

## TTML 格式

基本结构：每一行是 `<p>`，行内逐词用 `<span>` 标注时间。

```xml
<tt xmlns:ttm="http://www.w3.org/ns/ttml#metadata">
  <body>
    <div>
      <p begin="00:00:10.00" end="00:00:14.00" ttm:agent="v1">
        <span begin="00:00:10.00" end="00:00:11.50">你好</span>
        <span begin="00:00:11.50" end="00:00:14.00">世界</span>
      </p>
    </div>
  </body>
</tt>
```

- 行的起止时间写在 `<p>` 的 `begin` / `end`。
- 每个词的起止时间写在 `<span>` 的 `begin` / `end`，不写则沿用整行时间。
- `ttm:agent="v1"` 表示主唱，其余为合唱（以不同样式显示）。
- 想要"背景人声"效果，给 `<span>` 加 `ttm:role="x-bg"` 即可，会以背景样式显示。

## LRC 格式

使用标准的 LRC 时间标签，每行对应一句歌词：

```txt
[00:10.00]你好
[00:11.50]世界
```

## 注意事项

- 谱面同时存在多个歌词文件时，按上面的文件名顺序读取第一个能解析的文件。
- 歌词解析失败不会影响谱面游玩，只是不显示歌词。
