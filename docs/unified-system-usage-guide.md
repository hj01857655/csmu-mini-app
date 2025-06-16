# CSMU教务系统 - 统一系统使用指南

## 📋 概述

本指南介绍如何使用重构后的统一系统，包括API配置、存储管理和设计系统。

---

## 🔧 统一API配置系统

### 基本使用

```javascript
// 导入统一API配置
import apiConfig from '../config/api-config.js';

// 获取当前环境配置
const config = apiConfig.getCurrentConfig();
console.log(config.baseURL);  // 当前环境的API地址

// 获取特定配置项
const baseURL = apiConfig.getBaseURL();
const timeout = apiConfig.getTimeout();
const isMockEnabled = apiConfig.isMockEnabled();
```

### 环境管理

```javascript
// 获取当前环境
const currentEnv = apiConfig.getCurrentEnvironment();

// 获取所有可用环境
const environments = apiConfig.getEnvironments();

// 切换环境（主要用于测试）
apiConfig.switchEnvironment('staging');

// 获取配置摘要
const summary = apiConfig.getConfigSummary();
```

### 配置验证

```javascript
// 验证当前环境配置
const validation = apiConfig.validateConfig();
if (!validation.isValid) {
    console.error('配置错误:', validation.errors);
}
if (validation.warnings.length > 0) {
    console.warn('配置警告:', validation.warnings);
}

// 验证特定环境配置
const prodValidation = apiConfig.validateConfig('production');
```

### 动态配置更新

```javascript
// 更新配置
apiConfig.updateConfig('development', {
    timeout: 15000,
    enableDebugLog: false
});

// 重置配置
apiConfig.resetConfig('development');
```

---

## 💾 统一存储管理系统

### 基本使用

```javascript
// 导入统一存储管理器
import storageManager from '../utils/storage-manager.js';

// 保存用户凭据
const credentials = { username: 'user', password: 'pass' };
storageManager.saveCredentials(credentials, 'student');

// 获取保存的凭据
const savedCredentials = storageManager.getCredentials('student');

// 添加到历史记录
storageManager.addToHistory(credentials, 'student');

// 获取历史记录
const history = storageManager.getHistory('student');
```

### 存储策略切换

```javascript
// 检查当前存储模式
const currentMode = storageManager.getCurrentMode(); // 'encrypted' 或 'simple'

// 切换到加密存储（并迁移数据）
storageManager.switchToEncrypted(true);

// 切换到简单存储（并迁移数据）
storageManager.switchToSimple(true);

// 检查存储可用性
const availability = storageManager.checkAvailability();
console.log('加密存储可用:', availability.encrypted);
console.log('简单存储可用:', availability.simple);
```

### 存储管理

```javascript
// 清除特定用户类型的历史
storageManager.clearHistory('student');

// 清除所有存储数据
storageManager.clearAll();

// 获取存储统计信息
const stats = storageManager.getStorageStats();
console.log('存储模式:', stats.mode);
console.log('总键数:', stats.totalKeys);
console.log('已用空间:', stats.usedSpace);
console.log('历史记录数:', stats.historyCount);
```

---

## 🎨 统一设计系统

### CSS变量使用

```css
/* 在你的样式中使用设计系统变量 */
.my-component {
    color: var(--primary-color);
    background: var(--background-secondary);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-lg);
    transition: all var(--transition-normal) var(--ease-out);
}
```

### 基础组件类

```html
<!-- 选择器组件 -->
<view class="picker-base">
    <view class="picker-content">
        <text class="picker-text">选择内容</text>
        <view class="picker-indicator">
            <text class="picker-arrow">▼</text>
        </view>
    </view>
    <view class="bottom-accent-line"></view>
</view>

<!-- 按钮组件 -->
<button class="btn-base btn-primary btn-medium">
    主要按钮
</button>

<button class="btn-base btn-accent btn-small">
    强调按钮
</button>

<!-- 容器组件 -->
<view class="container-base container-compact">
    <view class="accent-line"></view>
    <!-- 内容 -->
</view>
```

### 响应式设计

```css
/* 设计系统自动处理响应式 */
.my-component {
    /* 在小屏幕上自动使用较小的间距和字体 */
    padding: var(--spacing-md);
    font-size: var(--font-size-lg);
}

/* 如需自定义响应式行为 */
@media screen and (max-width: 480px) {
    .my-component {
        /* 小屏幕特定样式 */
    }
}
```

### 主题支持

```css
/* 设计系统自动支持深色模式 */
.my-component {
    background: var(--background-color);
    color: var(--text-primary);
    border-color: var(--border-color);
}

/* 系统会根据用户偏好自动切换颜色 */
```

---

## 📝 最佳实践

### API配置最佳实践

```javascript
// ✅ 推荐：使用统一配置
import apiConfig from '../config/api-config.js';
const config = apiConfig.getCurrentConfig();

// ❌ 避免：直接硬编码配置
const config = {
    baseURL: 'http://localhost:8000/api',
    timeout: 10000
};

// ✅ 推荐：验证配置
const validation = apiConfig.validateConfig();
if (!validation.isValid) {
    // 处理配置错误
}

// ✅ 推荐：使用环境变量
// 在 .env 文件中设置
// VUE_APP_API_BASE_URL=https://api.csmu.edu.cn/api
```

### 存储管理最佳实践

```javascript
// ✅ 推荐：使用统一存储接口
import storageManager from '../utils/storage-manager.js';

// ✅ 推荐：错误处理
try {
    const credentials = storageManager.getCredentials('student');
    if (credentials) {
        // 使用凭据
    }
} catch (error) {
    console.error('获取凭据失败:', error);
}

// ❌ 避免：直接使用uni.getStorageSync
const data = uni.getStorageSync('credentials');

// ✅ 推荐：检查存储可用性
const availability = storageManager.checkAvailability();
if (!availability.current) {
    // 处理存储不可用的情况
}
```

### 设计系统最佳实践

```css
/* ✅ 推荐：使用设计系统变量 */
.my-button {
    background: var(--primary-color);
    padding: var(--spacing-md);
    border-radius: var(--border-radius-md);
}

/* ❌ 避免：硬编码值 */
.my-button {
    background: #1976D2;
    padding: 12rpx;
    border-radius: 12rpx;
}

/* ✅ 推荐：使用基础组件类 */
<button class="btn-base btn-primary btn-medium">按钮</button>

/* ❌ 避免：重复定义样式 */
.custom-button {
    /* 重复的按钮样式 */
}
```

---

## 🔍 故障排除

### API配置问题

```javascript
// 问题：配置验证失败
const validation = apiConfig.validateConfig();
console.log('验证结果:', validation);

// 解决：检查环境变量
console.log('API地址:', process.env.VUE_APP_API_BASE_URL);

// 解决：重置配置
apiConfig.resetConfig('development');
```

### 存储问题

```javascript
// 问题：存储操作失败
const availability = storageManager.checkAvailability();
console.log('存储可用性:', availability);

// 解决：切换存储策略
if (!availability.encrypted) {
    storageManager.switchToSimple();
}

// 解决：清除损坏的数据
storageManager.clearAll();
```

### 样式问题

```css
/* 问题：样式不生效 */
/* 解决：确保导入设计系统 */
@import url("../../styles/design-system.css");

/* 问题：响应式不工作 */
/* 解决：使用设计系统的断点 */
@media screen and (max-width: 480px) {
    /* 小屏幕样式 */
}
```

---

## 📚 参考资料

### 相关文件
- `config/api-config.js` - API配置管理
- `utils/storage-manager.js` - 存储管理
- `styles/design-system.css` - 设计系统
- `docs/code-duplication-analysis.md` - 重复代码分析
- `docs/refactoring-results.md` - 重构结果

### 环境变量
- `VUE_APP_API_BASE_URL` - API基础地址
- `VUE_APP_ENABLE_ENCRYPTION` - 是否启用加密存储
- `NODE_ENV` - 运行环境

### 支持的用户类型
- `student` - 学生
- `teacher` - 教师
- `admin` - 管理员

---

**更新时间**: 2025年6月16日  
**版本**: v1.0.0  
**维护者**: CSMU开发团队
