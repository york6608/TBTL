# 五金建材双语展示站（英语 / 斯瓦希里语）

面向坦桑尼亚市场的五金建材公司展示网站。**完全免费**（除你自己的域名外无任何费用）：
纯静态网站 + 免费托管（Cloudflare Pages）+ 免费可视化后台（Sveltia CMS）。
无服务器、无数据库、无月租。

---

## 一、目录结构

```
.
├── index.html              # 网站主页（自动读取下面的数据渲染）
├── assets/
│   ├── css/style.css       # 样式
│   ├── js/main.js          # 逻辑：双语切换 / 产品筛选 / 弹窗 / WhatsApp
│   └── images/             # 产品图片（后台上传的图片会放在这里）
├── data/
│   ├── site.json           # 公司信息、联系方式、首页文案（双语）
│   ├── categories.json     # 产品分类（双语）
│   └── products.json       # 产品列表（双语）
├── admin/
│   ├── index.html          # 可视化后台入口（访问 你的网址/admin/）
│   └── config.yml          # 后台配置（★上线前需改一行 repo）
└── README.md               # 本说明
```

**关键点**：所有内容都在 `data/` 里的 3 个文件。你完全不用碰代码——上线后用 `/admin/` 后台点点点就能改。

---

## 二、本地预览（可选，先看看效果）

网页需要通过“本地服务器”打开（不能直接双击 index.html，否则读不到 JSON）。在项目目录里运行：

```bash
python3 -m http.server 8080
```

然后浏览器打开 http://localhost:8080 。右上角可切换 EN / SW。

---

## 三、上线（一次性，约 15 分钟）

### 步骤 1：把项目放到 GitHub（免费）
1. 注册 https://github.com （已有账号跳过）
2. 新建一个仓库（Repository），例如名字 `uzalendo-hardware`，选 **Public**
3. 把本项目所有文件上传到该仓库（可以用 GitHub 网页版 “Add file → Upload files” 拖拽上传）

### 步骤 2：改后台配置里的仓库名
打开 `admin/config.yml`，把这一行改成你的：
```yaml
repo: your-github-username/your-repo-name   # 改成 例如 zhangsan/uzalendo-hardware
```
改完保存并上传/提交到 GitHub。

### 步骤 3：用 Cloudflare Pages 部署（免费）
1. 注册 https://dash.cloudflare.com
2. 左侧菜单 **Workers & Pages → Create → Pages → Connect to Git**
3. 选择刚才的 GitHub 仓库
4. 构建设置：**Framework preset 选 None**，**Build command 留空**，**Build output directory 填 `/`（根目录）**
5. 点 **Save and Deploy**

几十秒后会得到一个网址：`https://你的项目名.pages.dev` —— 网站已经上线！

### 步骤 4：绑定你自己的域名（免费 HTTPS）
在该 Pages 项目里：**Custom domains → Set up a custom domain → 输入你的域名**，按提示到你的域名商处添加一条 CNAME 记录即可。Cloudflare 会自动配好 HTTPS。

> 之后每次你在后台保存修改，Cloudflare 会自动重新发布，网站 1~2 分钟内更新。

---

## 四、开通可视化后台登录（让你能在网页上改内容）

后台通过你的 GitHub 账号登录并保存内容。需要给它配一个免费的“GitHub 授权（OAuth）”。推荐用 Cloudflare Workers（同样免费）：

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Application name：随意，例如 `Uzalendo CMS`
   - Homepage URL：你的网址（如 `https://你的域名`）
   - Authorization callback URL：`https://你的域名/oauth/callback`（也可用 Worker 的地址，见下）
   - 创建后记下 **Client ID** 和 **Client Secret**
2. 部署一个开源的 OAuth 中转（二选一，均免费）：
   - Cloudflare Workers 版：搜索并部署 `sveltia-cms-auth`（Sveltia 官方，一键部署到 Cloudflare Workers），把上一步的 Client ID / Secret 填进去
   - 或 Decap 通用版：`decap-proxy` / `netlify-cms-oauth-provider`
3. 部署好后，在 `admin/config.yml` 的 `backend` 下加一行指向它：
   ```yaml
   backend:
     name: github
     repo: your-github-username/your-repo-name
     branch: main
     base_url: https://你的oauth中转地址   # 例如 https://xxx.workers.dev
   ```
4. 打开 `https://你的域名/admin/` → 点击用 GitHub 登录 → 授权 → 进入后台。

> 详细的一键部署说明见 Sveltia 官方文档（GitHub 搜索 “sveltia-cms-auth”）。整个过程一次配置好，以后直接登录即可。

### 想先不折腾 OAuth？本地后台模式
在自己电脑上就能编辑，改完再上传/提交到 GitHub 发布：
1. 在 `admin/config.yml` 顶部临时加一行：`local_backend: true`
2. 项目目录运行：`npx @sveltia/cms-proxy-server`（或 Decap 的 `npx netlify-cms-proxy-server`）
3. 另开一个终端运行 `python3 -m http.server 8080`
4. 浏览器打开 http://localhost:8080/admin/ 即可可视化编辑（直接改本地文件）
5. 编辑完把 `data/` 和 `assets/images/` 的改动上传到 GitHub，网站自动更新。
（正式给非技术同事用时，建议用上面的 OAuth 方式，随时随地在网页改。）

---

## 五、日常怎么用后台

打开 `https://你的域名/admin/`，登录后你会看到三块：

- **Company & Homepage**：改公司名、首页大标题/副标题、公司简介、优势亮点、联系方式（电话、WhatsApp、邮箱、地址、营业时间）、地图、社交链接。每个文案都有 English 和 Kiswahili 两个框。
- **Product Categories**：管理分类（如 水泥、钢材、屋面…），每个分类填 ID（英文无空格，如 `cement`）和双语名称。
- **Products**：加/改/删产品。每个产品：ID、分类（下拉选）、上传照片、是否“精选”、双语名称、双语描述、规格、价格（留空则前台显示“Price on request / Bei kwa ombi”）。

改完点 **Save / Publish**，1~2 分钟后网站自动更新。

---

## 六、联系方式与本地化说明

- **WhatsApp 号码**：在后台 `contact.whatsapp` 填**纯数字带国家码**，坦桑为 255 开头，例如 `255700123456`（不要加 + 或空格）。前台的所有 WhatsApp 按钮会自动生成 `wa.me` 链接并带上询价文案。
- **电话**：`contact.phone` 可带格式（如 `+255 700 123 456`），前台点击自动拨号。
- **价格**：直接写字符串，例如 `TZS 18,000`；留空则显示“按需询价”。
- 网站移动端优先、图片懒加载，适应当地网络。

---

## 七、常见问题

- **本地打开页面空白 / 产品不显示？** 一定要用本地服务器（`python3 -m http.server`）打开，别直接双击 HTML。
- **后台保存后网站没更新？** 等 1~2 分钟让 Cloudflare 重新发布；刷新时可强制刷新（Ctrl/Cmd + Shift + R）。
- **换品牌颜色？** 后台 Company & Homepage 里改 Brand color 即可，无需改代码。
- **想全部改成英文默认？** 后台把 Default language 设为 English（访客首次访问按浏览器语言，可手动切换并记住）。
```
