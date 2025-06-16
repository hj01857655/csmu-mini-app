# CSMU教务系统 - 生产环境部署指南

## 📋 部署前检查清单

### 🔧 必须完成的配置更新

#### 1. **API地址配置**
```bash
# 方式一：使用环境变量文件
cp .env.production .env.local
# 编辑 .env.local，更新以下配置：
VUE_APP_API_BASE_URL=https://your-actual-api-domain.com/api/v1

# 方式二：在部署时设置环境变量
export VUE_APP_API_BASE_URL=https://api.csmu.edu.cn/api/v1
```

#### 2. **验证配置文件**
检查以下文件中的配置：
- `services/api.js` - API服务配置
- `config/index.js` - 应用配置
- `.env.production` - 生产环境变量

#### 3. **安全配置检查**
```bash
# 确认以下配置正确设置
VUE_APP_ENABLE_MOCK=false          # 禁用模拟数据
VUE_APP_DEBUG=false                # 禁用调试模式
VUE_APP_FORCE_HTTPS=true           # 强制HTTPS
VUE_APP_ENABLE_LOG_UPLOAD=true     # 启用日志上传
```

## 🚀 部署步骤

### 1. **环境准备**
```bash
# 1. 克隆项目
git clone https://github.com/your-org/csmu-mini-app.git
cd csmu-mini-app

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.production .env.local
# 编辑 .env.local，设置实际的API地址
```

### 2. **配置验证**
```bash
# 运行配置验证
npm run validate:config

# 检查API连接
npm run test:api-connection
```

### 3. **构建项目**
```bash
# 生产环境构建
npm run build:mp-weixin

# 或者指定环境构建
NODE_ENV=production npm run build:mp-weixin
```

### 4. **部署到小程序平台**
1. 使用微信开发者工具打开 `dist/build/mp-weixin` 目录
2. 配置小程序基本信息
3. 设置服务器域名白名单
4. 上传代码并提交审核

## 🔒 安全配置

### 1. **HTTPS配置**
```javascript
// 确保API服务器支持HTTPS
const config = {
  baseURL: 'https://api.csmu.edu.cn/api/v1',  // 必须使用HTTPS
  enableHttps: true,
  forceHttps: true
};
```

### 2. **域名白名单**
在微信小程序后台配置以下域名：
```
request合法域名：
- https://api.csmu.edu.cn

uploadFile合法域名：
- https://api.csmu.edu.cn

downloadFile合法域名：
- https://api.csmu.edu.cn
```

### 3. **Token安全**
```javascript
// 确认Token配置安全
const tokenConfig = {
  expireTime: 30 * 60 * 1000,      // 30分钟过期
  refreshBefore: 5 * 60 * 1000,    // 提前5分钟刷新
  autoRefresh: true                 // 自动刷新
};
```

## 📊 监控和日志

### 1. **错误监控**
```javascript
// 启用错误监控
VUE_APP_ENABLE_ERROR_TRACKING=true
VUE_APP_SENTRY_DSN=your_sentry_dsn
```

### 2. **性能监控**
```javascript
// 启用性能监控
VUE_APP_ENABLE_ANALYTICS=true
VUE_APP_ANALYTICS_ID=your_analytics_id
```

### 3. **日志配置**
```javascript
// 生产环境日志配置
const logConfig = {
  level: 'info',           // 只记录info级别以上的日志
  upload: true,            // 上传日志到服务器
  retention: 7,            // 本地保留7天
  console: false           // 不在控制台输出
};
```

## 🧪 测试验证

### 1. **功能测试**
```bash
# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行端到端测试
npm run test:e2e
```

### 2. **API连接测试**
```bash
# 测试API连接
curl -X GET "https://api.csmu.edu.cn/api/v1/health"

# 测试认证接口
curl -X POST "https://api.csmu.edu.cn/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### 3. **性能测试**
- 页面加载时间 < 3秒
- API响应时间 < 2秒
- 内存使用 < 100MB
- 包大小 < 2MB

## 🔄 CI/CD配置

### 1. **GitHub Actions示例**
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test
      
    - name: Build for production
      run: npm run build:mp-weixin
      env:
        VUE_APP_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        VUE_APP_ENABLE_MOCK: false
        
    - name: Deploy to WeChat Mini Program
      run: npm run deploy:mp-weixin
```

### 2. **环境变量管理**
在CI/CD平台设置以下环境变量：
```
API_BASE_URL=https://api.csmu.edu.cn/api/v1
WECHAT_APPID=your_wechat_appid
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id
```

## 📈 性能优化

### 1. **代码分割**
```javascript
// 启用代码分割
const config = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

### 2. **资源压缩**
```javascript
// 启用资源压缩
VUE_APP_ENABLE_COMPRESSION=true
VUE_APP_ENABLE_CACHE=true
```

### 3. **CDN配置**
```javascript
// 配置CDN地址
VUE_APP_CDN_URL=https://cdn.csmu.edu.cn
VUE_APP_ASSETS_VERSION=1.0.0
```

## 🚨 故障排除

### 1. **常见问题**
- **API连接失败**: 检查域名白名单和HTTPS配置
- **登录异常**: 验证认证接口和Token配置
- **页面空白**: 检查构建配置和资源路径
- **功能异常**: 确认模拟数据已禁用

### 2. **调试工具**
```javascript
// 临时启用调试模式（仅用于排查问题）
VUE_APP_DEBUG=true
VUE_APP_CONSOLE_LOG=true
```

### 3. **回滚方案**
```bash
# 快速回滚到上一个版本
git checkout previous-stable-tag
npm run build:mp-weixin
# 重新部署
```

## 📞 支持联系

如果在部署过程中遇到问题，请：
1. 检查本文档的故障排除部分
2. 查看项目的Issue页面
3. 联系技术支持团队

---

**重要提醒**: 部署前请务必在测试环境验证所有功能正常，确保API地址、域名白名单等配置正确。
