# 数独庄园 · 网页版（Sudoku Mansion Web）

《Sudoku Mansion》的纯静态网页版，附带简体中文汉化。

## 这是什么

游戏本体是 Electron 应用，但它内部自带一个网页模式（`target: "web"`）——打开后关卡从
`assets/mansion.json` 读取，存档写浏览器本地存储，不需要任何后端。这个仓库就是把这个模式
打开之后的静态站点，可以直接托管在 GitHub Pages 上，手机打开即玩。

## 玩法

- 直接访问部署地址即可，手机建议横屏，可在浏览器菜单里「添加到主屏幕」。
- 因为是 https，Service Worker 能生效：打开过一次之后断网也能玩。
- 存档在浏览器本地存储（键名 `sudoku-mansion-save`），游戏每次输入数字都会自动保存。
  换设备或清缓存前，请用同目录下的 `存档备份.html` 导出。

## 本地预览

```
node local-server.js 8080
```

然后打开 http://127.0.0.1:8080/ 。也可以直接双击 `本地预览.bat`。

## 音乐

仓库里不含音乐音效（19 个文件约 136MB）。需要的话在同目录运行 `补上音乐.bat`，
从本地游戏目录复制到 `assets/audio/`。

## 目录

- `index.html` 入口
- `assets/mansion.json` 关卡与文本（中文）
- `assets/images/` 47 张图片资源
- `manifest.webmanifest` / `sw.js` 安装到主屏幕与离线缓存
- `存档备份.html` 存档导出 / 导入 / 清空
- `local-server.js` 零依赖本地静态服务器

## 说明

- 汉化为第三方玩家作品（原作者声明由 AI 制作），仅供个人使用，请勿分发。
- 原始游戏与本仓库无关联，游戏内容权利归其权利人所有。
