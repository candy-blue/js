# image-search 以图搜图（浏览器扩展）

在图片右键菜单中添加多个以图搜图入口，支持：

- Yandex
- SauceNAO
- IQDB
- Google Lens

## 安装（开发者模式）

以 Chrome / Edge 为例：

1. 打开扩展管理页
   - Chrome：`chrome://extensions/`
   - Edge：`edge://extensions/`
2. 打开右上角“开发者模式”
3. 点击“加载已解压的扩展程序”
4. 选择本目录：`image-search/`

修改代码后，在扩展管理页点击“重新加载”即可生效。

## 使用

1. 在网页中对任意图片右键
2. 在菜单中选择对应引擎：
   - 使用 yandex.com 进行搜图
   - 使用 SauceNAO 进行搜图
   - 使用 IQDB 进行搜图
   - 使用 Google 进行搜图
3. 扩展会自动在新标签页打开搜索结果

## 权限说明

- `contextMenus`：创建图片右键菜单项
- `tabs`：在新标签页打开搜索链接

