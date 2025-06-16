# API端口配置更新说明

## 📋 更新概述

**更新日期：** 2025年6月16日  
**更新类型：** API端口配置变更  
**影响范围：** 开发环境和生产环境（临时配置）

## 🔧 具体更改

### API端口变更
- **原端口：** 3000
- **新端口：** 8000
- **影响环境：** 开发环境 + 生产环境（临时配置）

### 更新的文件

#### 1. `services/api.js`
```javascript
// 更新前
development: {
    baseURL: 'http://localhost:3000/api',
    // ...
},
production: {
    baseURL: 'http://localhost:3000/api',
    // ...
}

// 更新后
development: {
    baseURL: 'http://localhost:8000/api',
    // ...
},
production: {
    baseURL: 'http://localhost:8000/api',
    // ...
}
```

#### 2. `utils/env-config-validator.js`
```javascript
// 更新推荐配置中的开发环境端口
development: {
    baseURL: 'http://localhost:8000/api',
    // ...
}
```

#### 3. `docs/deployment-checklist.md`
- 更新部署检查清单中的端口信息
- 更新临时配置说明

## ✅ 验证要点

### 开发环境验证
- [ ] 确认后端服务运行在8000端口
- [ ] 测试API连接正常
- [ ] 验证模拟数据功能正常

### 生产环境验证
- [ ] 确认临时配置使用8000端口
- [ ] 验证配置验证工具正常工作
- [ ] 确认警告机制正常显示

## 🚨 重要提醒

### 后端服务配置
确保后端API服务已更新为在8000端口运行：

```bash
# 示例：启动后端服务在8000端口
npm start --port=8000
# 或
node server.js --port=8000
```

### 生产环境注意事项
- 当前生产环境仍为临时配置（使用localhost:8000）
- 正式部署时需要更新为真实的生产环境API地址
- 建议地址：`https://api.csmu.edu.cn`

## 📊 配置验证

项目启动时会自动验证配置：

### 开发环境日志示例
```
🔧 API服务 - 开发环境配置: {
  环境: 'development',
  API地址: 'http://localhost:8000/api',
  模拟数据: '启用',
  超时时间: '10000ms'
}
```

### 生产环境警告示例
```
⚠️ API服务 - 生产环境配置检查: {
  环境: 'production',
  API地址: 'http://localhost:8000/api',
  模拟数据: '禁用',
  超时时间: '15000ms'
}
🚨 警告：生产环境正在使用localhost API地址！
📋 部署提醒：请在正式部署前更新为生产环境API地址
🔗 建议地址：https://api.csmu.edu.cn
```

## 🔄 回滚方案

如需回滚到3000端口：

1. 修改 `services/api.js` 中的端口配置
2. 修改 `utils/env-config-validator.js` 中的推荐配置
3. 更新相关文档
4. 重启开发服务器

## 📞 技术支持

如遇到端口配置相关问题，请联系：
- 前端开发团队
- 后端开发团队
- DevOps团队

---

**文档版本：** v1.0  
**最后更新：** 2025年6月16日
