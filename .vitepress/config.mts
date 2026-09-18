import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'Phira-Firefly',
  description: 'Phira-Firefly —— 基于 Phira 的非商业社区音乐节奏游戏',

  srcDir: 'docs',

  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/icon.png' }],
    ['meta', { name: 'theme-color', content: '#0f0f12' }],
    ['meta', { property: 'og:image', content: '/firefly.png' }],
  ],

  themeConfig: {
    logo: '/icon.png',
    siteTitle: 'Phira-Firefly 文档',

    nav: [
      { text: '首页', link: '/' },
      { text: '简介', link: '/intro' },
      { text: '新增功能', link: '/firefly/' },
      { text: '谱面标准', link: '/chart-standard/' },
      { text: '构建指南', link: '/phira_build_guide/' },
      { text: '项目仓库', link: 'https://github.com/tiancra/Phira-Firefly' },
    ],

    sidebar: [
      { text: '简介', link: '/intro' },

      {
        text: 'Phira-Firefly 新增功能',
        collapsed: false,
        items: [
          { text: '总览', link: '/firefly/' },
          { text: '玩法与操作', link: '/firefly/gameplay' },
          { text: '画面与演出', link: '/firefly/visuals' },
          { text: '新手引导与界面', link: '/firefly/experience' },
          { text: '本地化', link: '/firefly/l10n' },
          { text: '设备与谱面', link: '/firefly/devices' },
          { text: '联机与账户', link: '/firefly/multiplayer' },
          { text: '更新日志', link: '/firefly/changelog' },
        ],
      },

      { text: '资源包', link: '/respack/' },

      {
        text: '谱面标准',
        collapsed: true,
        items: [
          { text: '谱面信息', link: '/chart-standard/chartinfo' },
          { text: '音乐文件格式', link: '/chart-standard/music' },
          {
            text: '扩展特性',
            collapsed: true,
            items: [
              {
                text: '特效',
                collapsed: true,
                items: [
                  {
                    text: '内置着色器',
                    collapsed: true,
                    items: [
                      { text: 'chromatic', link: '/chart-standard/extra/effect/builtin/chromatic' },
                      { text: 'circleBlur', link: '/chart-standard/extra/effect/builtin/circleBlur' },
                      { text: 'fisheye', link: '/chart-standard/extra/effect/builtin/fisheye' },
                      { text: 'glitch', link: '/chart-standard/extra/effect/builtin/glitch' },
                      { text: 'grayscale', link: '/chart-standard/extra/effect/builtin/grayscale' },
                      { text: 'noise', link: '/chart-standard/extra/effect/builtin/noise' },
                      { text: 'pixel', link: '/chart-standard/extra/effect/builtin/pixel' },
                      { text: 'radialBlur', link: '/chart-standard/extra/effect/builtin/radialBlur' },
                      { text: 'shockwave', link: '/chart-standard/extra/effect/builtin/shockwave' },
                      { text: 'vignette', link: '/chart-standard/extra/effect/builtin/vignette' },
                    ],
                  },
                  { text: '自行编写着色器', link: '/chart-standard/extra/effect/custom-shader' },
                ],
              },
              { text: '视频背景', link: '/chart-standard/extra/video/' },
              { text: '歌词', link: '/chart-standard/extra/lyrics' },
            ],
          },
          { text: '解锁动画', link: '/chart-standard/unlock_video/' },
        ],
      },

      {
        text: '谱面管理',
        collapsed: true,
        items: [
          { text: '谱面上传指南', link: '/chart-management/upload-guide' },
          { text: '审核与上架指南', link: '/chart-management/review-and-stable' },
          { text: '协作者功能', link: '/chart-management/collaborator' },
        ],
      },

      {
        text: '谱面文件格式',
        collapsed: true,
        items: [
          {
            text: 'RPE',
            collapsed: true,
            items: [
              { text: '谱面根目录', link: '/chart-standard/chart-format/rpe/root' },
              { text: '判定线', link: '/chart-standard/chart-format/rpe/judgeLine' },
              { text: 'beat', link: '/chart-standard/chart-format/rpe/beat' },
              { text: '音符', link: '/chart-standard/chart-format/rpe/note' },
              { text: '普通事件', link: '/chart-standard/chart-format/rpe/event' },
              { text: '特殊事件', link: '/chart-standard/chart-format/rpe/extendEvent' },
              { text: '扩展特性', link: '/chart-standard/chart-format/rpe/extend' },
              { text: 'Controls', link: '/chart-standard/chart-format/rpe/controls' },
            ],
          },
          {
            text: 'PE',
            collapsed: true,
            items: [
              { text: '基本信息', link: '/chart-standard/chart-format/pe/basic' },
              { text: '事件', link: '/chart-standard/chart-format/pe/event' },
              { text: '音符', link: '/chart-standard/chart-format/pe/note' },
            ],
          },
          {
            text: 'Official',
            collapsed: true,
            items: [
              { text: '谱面根目录', link: '/chart-standard/chart-format/phi/root' },
              { text: '音符', link: '/chart-standard/chart-format/phi/note' },
              { text: '事件', link: '/chart-standard/chart-format/phi/event' },
              { text: '判定线', link: '/chart-standard/chart-format/phi/judgeLine' },
            ],
          },
        ],
      },

      { text: '活动指南', link: '/event/' },

      {
        text: 'UML 文档',
        collapsed: true,
        items: [
          {
            text: '语法',
            collapsed: true,
            items: [
              { text: '坐标', link: '/uml/syntax/coordinate' },
              { text: '数据类型', link: '/uml/syntax/type' },
              { text: '表达式', link: '/uml/syntax/expression' },
              { text: '变量', link: '/uml/syntax/variable' },
              {
                text: '元素',
                collapsed: true,
                items: [
                  { text: '段落元素 p', link: '/uml/syntax/elements/p' },
                  { text: '图片元素 img', link: '/uml/syntax/elements/img' },
                  { text: '谱面合集元素 col', link: '/uml/syntax/elements/col' },
                  { text: '按钮元素 btn', link: '/uml/syntax/elements/btn' },
                ],
              },
              { text: '注释', link: '/uml/syntax/comment' },
              { text: '注释表达式', link: '/uml/syntax/comment_expression' },
            ],
          },
          { text: '如何调试', link: '/uml/debugging' },
          {
            text: '样例 UML',
            collapsed: true,
            items: [
              { text: '模板活动', link: '/uml/examples/template_event' },
              { text: '2024 圣诞夜惊魂', link: '/uml/examples/xmas-2024' },
            ],
          },
          {
            text: '使用进阶',
            collapsed: true,
            items: [{ text: '页面切换', link: '/uml/advanced/page_switch' }],
          },
        ],
      },

      {
        text: 'Phira 构建指南',
        collapsed: true,
        items: [
          { text: 'cargo 安装教程', link: '/phira_build_guide/cargo' },
          { text: '静态库（prpr-avc）', link: '/phira_build_guide/StaticLib' },
          { text: 'Windows GNU', link: '/phira_build_guide/Windows_Gnu' },
          { text: 'Windows MSVC', link: '/phira_build_guide/Windows_Msvc' },
          { text: 'Linux', link: '/phira_build_guide/Linux' },
          { text: 'macOS', link: '/phira_build_guide/macOS' },
          { text: 'iOS', link: '/phira_build_guide/iOS' },
          { text: 'Android', link: '/phira_build_guide/Android' },
          { text: 'OpenHarmony', link: '/phira_build_guide/OpenHarmony' },
        ],
      },

      {
        text: '糗事集锦',
        collapsed: true,
        items: [
          { text: '长风的柳絮', link: '/dev-incident/长风的柳絮' },
          { text: 'v0.6.0 更新消息', link: '/dev-incident/v0.6.0更新消息' },
          { text: '6th PecJam', link: '/dev-incident/6thpecjam' },
          { text: '天空之城', link: '/dev-incident/天空之城' },
          { text: 'Forever Young', link: '/dev-incident/ForeverYoung' },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: '本页目录',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    footer: {
      message: '基于 MIT 许可的文档项目 · 由 phira-docs 改编',
      copyright: 'Copyright © TeamFlos & Phira-Firefly',
    },

    lastUpdated: {
      text: '最后更新于',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/tiancra/Phira-Firefly' },
    ],

    editLink: {
      pattern: 'https://github.com/tiancra/Phira-Firefly-Docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },
})
