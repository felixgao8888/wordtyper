# 英语单词打字大冒险 - Vercel 部署指南

## 方式一：通过 GitHub 部署（推荐，最稳定）

### 第一步：注册账号
1. 注册 GitHub 账号：https://github.com
2. 注册 Vercel 账号：https://vercel.com（用 GitHub 账号登录即可）

### 第二步：创建 GitHub 仓库
1. 登录 GitHub，点击右上角「+」→「New repository」
2. 仓库名称填：`wordtyper`
3. 选择「Public」（公开，免费）
4. 勾选「Add a README file」
5. 点击「Create repository」

### 第三步：上传文件
1. 在仓库页面点击「Add file」→「Upload files」
2. 把本文件夹的三个文件拖进去：
   - `index.html`（游戏主文件）
   - `vercel.json`（Vercel配置）
   - `package.json`（项目配置）
3. 底部点击「Commit changes」

### 第四步：部署到 Vercel
1. 登录 Vercel：https://vercel.com
2. 点击「Add New...」→「Project」
3. 在「Import Git Repository」中找到刚才的 `wordtyper` 仓库
4. 点击「Import」
5. 配置页面直接点击「Deploy」（不需要修改任何配置）
6. 等待部署完成（约1-2分钟）

### 第五步：获取访问链接
部署成功后，Vercel 会给你一个域名，例如：
```
https://wordtyper-xxx.vercel.app
```
这个就是你的游戏正式访问链接，永久免费！

---

## 方式二：通过 Vercel CLI 部署（适合开发者）

### 第一步：安装 Node.js
下载安装：https://nodejs.org/（推荐 LTS 版本）

### 第二步：安装 Vercel CLI
```bash
npm install -g vercel
```

### 第三步：登录 Vercel
```bash
vercel login
```
按提示用 GitHub 账号登录。

### 第四步：部署
```bash
cd wordtyper-vercel
vercel --prod
```
按提示确认配置，部署成功后会得到访问链接。

---

## 更新游戏

以后更新游戏时，只需：
1. 修改 `index.html` 文件
2. 上传到 GitHub 仓库（覆盖原文件）
3. Vercel 会自动重新部署（约30秒）
4. 访问链接不变，内容自动更新

---

## 绑定自定义域名（可选）

如果有自己的域名：
1. 在 Vercel 项目页面 →「Settings」→「Domains」
2. 输入你的域名，点击「Add」
3. 按提示配置 DNS 解析
4. 等待生效（通常几分钟）

---

## 注意事项

1. **免费额度**：Vercel 免费版每月 100GB 流量，个人使用完全足够
2. **HTTPS**：Vercel 自动提供 HTTPS，不需要额外配置
3. **全球CDN**：Vercel 全球 CDN 加速，访问速度快
4. **数据存储**：游戏用户数据（排行榜、激活状态）仍存储在用户本地浏览器
5. **后端服务**：如果需要激活码管理和自动收款，需要单独部署后端服务

---

## 常见问题

### Q：部署后访问链接是什么？
A：部署成功后，Vercel 会显示一个 `https://xxx.vercel.app` 的链接，就是访问地址。

### Q：可以修改项目名称吗？
A：可以，在 Vercel 项目设置 →「General」→「Project Name」修改。

### Q：游戏更新后用户需要刷新吗？
A：是的，用户需要刷新页面才能加载最新版本。可以在游戏中添加版本号提示。

### Q：Vercel 国内访问快吗？
A：Vercel 在国内没有节点，访问速度一般。如果主要面向国内用户，建议用阿里云OSS或腾讯云COS。

---

**如有问题，请参考 Vercel 官方文档：https://vercel.com/docs**
