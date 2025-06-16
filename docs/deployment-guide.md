# CSMU教务系统小程序部署指南

## 项目概述

CSMU教务系统小程序是一个基于uni-app框架开发的跨平台教育管理应用，支持微信小程序、支付宝小程序、H5和App多端部署。

## 部署前准备

### 1. 环境要求

#### 开发环境
- Node.js >= 14.0.0
- npm >= 6.0.0 或 yarn >= 1.22.0
- HBuilderX 最新版本

#### 小程序开发工具
- 微信开发者工具 >= 1.06.0
- 支付宝小程序开发者工具 >= 3.0.0

### 2. 项目依赖检查

```bash
# 安装项目依赖
npm install

# 或使用yarn
yarn install
```

### 3. 配置文件检查

确认以下配置文件正确：
- `manifest.json` - 应用配置
- `pages.json` - 页面路由配置
- `uni.scss` - 全局样式变量

## 生产环境配置

### 1. API地址配置

修改 `services/education-api.js` 中的API地址：

```javascript
// 开发环境
const BASE_URL = 'http://localhost:8000/api';

// 生产环境 - 需要修改为实际API地址
const BASE_URL = 'https://api.csmu.edu.cn';
```

### 2. 应用信息配置

修改 `manifest.json` 中的应用信息：

```json
{
  "name": "CSMU教务系统",
  "appid": "__UNI__XXXXXXXX", // 替换为实际appid
  "description": "CSMU教务系统小程序",
  "versionName": "1.0.0",
  "versionCode": "100"
}
```

### 3. 小程序配置

#### 微信小程序
在 `manifest.json` 的 `mp-weixin` 节点中配置：

```json
"mp-weixin": {
  "appid": "wx1234567890abcdef", // 替换为实际微信小程序appid
  "setting": {
    "urlCheck": true,
    "es6": true,
    "minified": true
  },
  "usingComponents": true
}
```

#### 支付宝小程序
在 `manifest.json` 的 `mp-alipay` 节点中配置：

```json
"mp-alipay": {
  "appid": "2021001234567890", // 替换为实际支付宝小程序appid
  "component2": true
}
```

### 4. 域名白名单配置

在小程序管理后台配置服务器域名：

#### 微信小程序
- request合法域名：`https://api.csmu.edu.cn`
- uploadFile合法域名：`https://api.csmu.edu.cn`
- downloadFile合法域名：`https://api.csmu.edu.cn`

#### 支付宝小程序
- HTTP请求白名单：`https://api.csmu.edu.cn`

## 构建和发布

### 1. 微信小程序发布

#### 步骤1：构建项目
```bash
# 在HBuilderX中选择"发行" -> "小程序-微信"
# 或使用命令行
npm run build:mp-weixin
```

#### 步骤2：上传代码
1. 打开微信开发者工具
2. 导入项目（选择dist/build/mp-weixin目录）
3. 点击"上传"按钮
4. 填写版本号和项目备注
5. 上传成功后在微信公众平台提交审核

#### 步骤3：发布上线
1. 登录微信公众平台
2. 进入"版本管理"
3. 将审核通过的版本设为线上版本

### 2. 支付宝小程序发布

#### 步骤1：构建项目
```bash
# 在HBuilderX中选择"发行" -> "小程序-支付宝"
# 或使用命令行
npm run build:mp-alipay
```

#### 步骤2：上传代码
1. 打开支付宝小程序开发者工具
2. 导入项目（选择dist/build/mp-alipay目录）
3. 点击"上传"按钮
4. 填写版本信息
5. 在支付宝开放平台提交审核

### 3. H5发布

#### 步骤1：构建项目
```bash
# 构建H5版本
npm run build:h5
```

#### 步骤2：部署到服务器
1. 将dist/build/h5目录下的文件上传到Web服务器
2. 配置Nginx或Apache
3. 确保HTTPS访问
4. 配置域名解析

#### Nginx配置示例：
```nginx
server {
    listen 443 ssl;
    server_name csmu-app.edu.cn;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/csmu-app;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass https://api.csmu.edu.cn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. App发布

#### 步骤1：构建项目
```bash
# 构建App版本
npm run build:app-plus
```

#### 步骤2：云打包
1. 在HBuilderX中选择"发行" -> "原生App-云打包"
2. 选择打包类型（Android/iOS）
3. 配置证书和密钥
4. 提交云打包
5. 下载打包后的安装包

## 部署后验证

### 1. 功能测试清单

- [ ] 登录功能正常
- [ ] 课程表显示正确
- [ ] 成绩查询功能
- [ ] 考试安排展示
- [ ] 个人中心功能
- [ ] 选课系统功能
- [ ] 教学评价功能
- [ ] 校园通知功能

### 2. 性能测试

- [ ] 首屏加载时间 < 3秒
- [ ] 页面切换流畅
- [ ] 网络请求响应正常
- [ ] 内存使用合理

### 3. 兼容性测试

- [ ] 不同设备屏幕适配
- [ ] 不同操作系统版本
- [ ] 网络环境适应性

## 监控和维护

### 1. 错误监控

建议集成错误监控服务：
- 微信小程序：使用微信小程序助手
- 支付宝小程序：使用支付宝小程序监控
- H5：集成Sentry等错误监控服务

### 2. 性能监控

- 页面加载时间监控
- API响应时间监控
- 用户行为分析

### 3. 版本更新

#### 小程序更新
- 定期发布新版本
- 重要功能更新需要重新审核
- 紧急修复可使用热更新

#### H5更新
- 直接更新服务器文件
- 注意缓存清理
- 重要更新建议通知用户

## 常见问题解决

### 1. 网络请求失败
- 检查域名白名单配置
- 确认API服务正常
- 检查HTTPS证书

### 2. 页面显示异常
- 检查样式文件加载
- 确认图片资源路径
- 验证数据格式

### 3. 功能异常
- 查看控制台错误信息
- 检查API返回数据
- 验证用户权限

## 安全注意事项

### 1. 数据安全
- 敏感数据加密传输
- 用户信息本地加密存储
- 定期清理缓存数据

### 2. 接口安全
- API接口鉴权
- 请求频率限制
- 数据校验

### 3. 小程序安全
- 代码混淆
- 防止逆向工程
- 定期安全审计

## 联系信息

### 技术支持
- 开发团队：CSMU技术部
- 邮箱：tech@csmu.edu.cn
- 电话：0571-12345678

### 运维支持
- 运维团队：CSMU运维部
- 邮箱：ops@csmu.edu.cn
- 24小时热线：0571-87654321

---

**部署指南版本**: v1.0  
**最后更新时间**: 2025年6月16日  
**适用版本**: CSMU教务系统 v1.0.0
