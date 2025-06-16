# CSMU教务系统 - 代码重构实施方案

## 🎯 重构目标

1. **消除高优先级重复代码** (530行)
2. **建立统一的架构模式**
3. **提升代码维护性和可读性**
4. **确保功能完整性不受影响**

---

## 📋 重构计划 (按优先级执行)

### 阶段一: 高优先级重构 (2-3天)

#### 1.1 统一API配置系统
**目标**: 合并3个API配置文件为1个统一配置

**实施步骤**:
1. 创建 `config/api-config.js` 作为唯一配置源
2. 重构 `services/api.js` 使用统一配置
3. 删除 `config/index.js` 中的重复配置
4. 更新所有引用

**预期收益**: 减少200行重复代码，统一配置管理

#### 1.2 整合HTTP请求实现
**目标**: 保留完整的HttpClient，移除SimpleHttp

**实施步骤**:
1. 分析SimpleHttp的独特功能
2. 将有用功能合并到HttpClient
3. 更新所有SimpleHttp的引用
4. 删除 `utils/simple-api.js`

**预期收益**: 减少150行重复代码，统一请求接口

#### 1.3 优化存储工具
**目标**: 提供统一的存储接口，支持加密/非加密选择

**实施步骤**:
1. 创建 `utils/storage-manager.js` 统一接口
2. 保留两种实现作为策略模式
3. 提供简单的切换机制
4. 更新所有存储调用

**预期收益**: 减少180行重复代码，灵活的存储策略

### 阶段二: 中优先级重构 (1-2天)

#### 2.1 统一配置验证
**目标**: 合并分散的验证逻辑

#### 2.2 整合学期计算
**目标**: 集中学期相关计算逻辑

#### 2.3 优化样式系统
**目标**: 提取公共样式，建立设计系统

### 阶段三: 低优先级重构 (1天)

#### 3.1 统一日期处理
#### 3.2 整合测试框架

---

## 🔧 具体实施方案

### 方案1: 统一API配置系统

#### 新建文件: `config/api-config.js`
```javascript
/**
 * 统一API配置管理
 * 所有API相关配置的唯一来源
 */
class ApiConfig {
    constructor() {
        this.environments = {
            development: {
                baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000/api',
                timeout: 10000,
                enableMock: true,
                retryTimes: 3
            },
            production: {
                baseURL: process.env.VUE_APP_API_BASE_URL || 'https://api.csmu.edu.cn/api',
                timeout: 15000,
                enableMock: false,
                retryTimes: 2,
                enableHttps: true,
                enableCompression: true
            },
            staging: {
                baseURL: process.env.VUE_APP_API_BASE_URL || 'https://staging-api.csmu.edu.cn/api',
                timeout: 12000,
                enableMock: false,
                retryTimes: 2
            }
        };
    }

    getCurrentConfig() {
        const env = process.env.NODE_ENV || 'development';
        return this.environments[env] || this.environments.development;
    }

    getConfig(environment) {
        return this.environments[environment];
    }

    updateConfig(environment, config) {
        this.environments[environment] = { ...this.environments[environment], ...config };
    }
}

export default new ApiConfig();
```

#### 重构 `services/api.js`
```javascript
import apiConfig from '../config/api-config.js';

class HttpClient {
    constructor() {
        this.config = apiConfig.getCurrentConfig();
        this.baseURL = this.config.baseURL;
        this.timeout = this.config.timeout;
        // ... 其他初始化
    }
    // ... 保留现有方法
}
```

### 方案2: 统一存储管理

#### 新建文件: `utils/storage-manager.js`
```javascript
/**
 * 统一存储管理器
 * 提供加密/非加密存储的统一接口
 */
import secureStorage from './secure-storage.js';
import simpleStorage from './simple-storage.js';

class StorageManager {
    constructor() {
        this.useEncryption = process.env.VUE_APP_ENABLE_ENCRYPTION !== 'false';
        this.storage = this.useEncryption ? secureStorage : simpleStorage;
    }

    // 统一接口方法
    saveCredentials(credentials, userType) {
        return this.storage.saveRememberedCredentials(credentials, userType);
    }

    getCredentials() {
        return this.storage.getRememberedCredentials();
    }

    addToHistory(credentials, userType) {
        return this.storage.addToHistory(credentials, userType);
    }

    getHistory(userType) {
        return this.useEncryption 
            ? this.storage.getDecryptedHistory(userType)
            : this.storage.getLoginHistory(userType);
    }

    clearHistory(userType) {
        return this.storage.clearHistory(userType);
    }

    // 切换存储策略
    switchToEncrypted() {
        this.useEncryption = true;
        this.storage = secureStorage;
    }

    switchToSimple() {
        this.useEncryption = false;
        this.storage = simpleStorage;
    }
}

export default new StorageManager();
```

### 方案3: 样式系统优化

#### 新建文件: `styles/design-system.css`
```css
/* CSMU教务系统设计系统 */

/* 颜色变量 */
:root {
    --primary-color: #1976D2;
    --primary-light: #42A5F5;
    --primary-dark: #0D47A1;
    --accent-color: #FF6B35;
    --background-color: #f8f9fa;
    --text-color: #333;
    --border-color: #e5e5e5;
}

/* 尺寸变量 */
:root {
    --border-radius-sm: 8rpx;
    --border-radius-md: 12rpx;
    --border-radius-lg: 16rpx;
    --spacing-xs: 8rpx;
    --spacing-sm: 12rpx;
    --spacing-md: 16rpx;
    --spacing-lg: 20rpx;
    --spacing-xl: 24rpx;
}

/* 公共选择器样式 */
.picker-base {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1rpx solid var(--border-color);
    border-radius: var(--border-radius-md);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.picker-base:hover {
    border-color: var(--primary-color);
    transform: translateY(-1rpx);
}

/* 响应式断点 */
@media screen and (max-width: 480px) {
    :root {
        --spacing-sm: 8rpx;
        --spacing-md: 12rpx;
        --spacing-lg: 16rpx;
    }
}
```

---

## 📊 重构前后对比

### 文件结构对比

#### 重构前
```
config/
├── index.js (API配置重复)
services/
├── api.js (完整HTTP实现)
utils/
├── simple-api.js (简化HTTP实现)
├── secure-storage.js (加密存储)
├── simple-storage.js (简单存储)
└── env-config-validator.js (验证逻辑)
```

#### 重构后
```
config/
├── api-config.js (统一API配置)
services/
├── api.js (重构后的HTTP实现)
utils/
├── storage-manager.js (统一存储接口)
├── secure-storage.js (保留作为策略)
├── simple-storage.js (保留作为策略)
└── config-validator.js (统一验证)
styles/
└── design-system.css (设计系统)
```

### 代码量对比

| 模块 | 重构前 | 重构后 | 减少量 | 减少比例 |
|------|--------|--------|--------|----------|
| API配置 | 200行 | 80行 | 120行 | 60% |
| HTTP请求 | 300行 | 200行 | 100行 | 33% |
| 存储工具 | 350行 | 280行 | 70行 | 20% |
| 配置验证 | 180行 | 120行 | 60行 | 33% |
| **总计** | **1030行** | **680行** | **350行** | **34%** |

---

## ✅ 重构验证清单

### 功能验证
- [ ] API请求功能正常
- [ ] 存储功能完整
- [ ] 配置验证有效
- [ ] 页面显示正确

### 性能验证
- [ ] 加载速度未降低
- [ ] 内存使用优化
- [ ] 包体积减少

### 兼容性验证
- [ ] 环境变量支持
- [ ] 向后兼容性
- [ ] 错误处理完整

---

## 🚀 实施时间表

| 阶段 | 任务 | 预计时间 | 负责人 |
|------|------|----------|--------|
| 第1天 | API配置统一 | 4小时 | 开发者 |
| 第2天 | HTTP请求整合 | 6小时 | 开发者 |
| 第3天 | 存储工具优化 | 4小时 | 开发者 |
| 第4天 | 配置验证统一 | 3小时 | 开发者 |
| 第5天 | 样式系统优化 | 3小时 | 开发者 |
| 第6天 | 测试和验证 | 4小时 | 开发者 |

**总计**: 6天，24小时工作量

---

**制定时间**: 2025年6月16日  
**预期完成**: 2025年6月22日  
**风险评估**: 低风险，向后兼容
