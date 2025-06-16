# CSMU教务系统开发指南

## 📋 目录
- [开发环境搭建](#开发环境搭建)
- [项目结构说明](#项目结构说明)
- [核心模块详解](#核心模块详解)
- [API接口文档](#api接口文档)
- [调试指南](#调试指南)
- [部署指南](#部署指南)
- [常见问题](#常见问题)

## 🛠️ 开发环境搭建

### 必需软件
1. **Node.js** (>= 14.0.0)
   - 下载地址：https://nodejs.org/
   - 验证安装：`node --version`

2. **HBuilderX** (>= 3.0.0)
   - 下载地址：https://www.dcloud.io/hbuilderx.html
   - 推荐安装插件：uni-app、Vue、ESLint

3. **Git** (>= 2.0.0)
   - 下载地址：https://git-scm.com/
   - 配置用户信息：
     ```bash
     git config --global user.name "Your Name"
     git config --global user.email "your.email@example.com"
     ```

### 可选工具
- **微信开发者工具**：用于小程序调试
- **Chrome DevTools**：用于H5调试
- **Postman**：用于API测试

### 项目初始化
```bash
# 克隆项目
git clone https://github.com/hj01857655/csmu-mini-app.git
cd csmu-mini-app

# 安装依赖（如果有package.json）
npm install

# 在HBuilderX中打开项目
# 文件 -> 打开目录 -> 选择项目根目录
```

## 📁 项目结构说明

```
csmu-mini-app/
├── pages/                      # 页面目录
│   ├── login/                  # 登录页面
│   │   ├── login.vue          # 页面组件
│   │   └── login.scss         # 页面样式（如果有）
│   ├── home/                   # 首页
│   ├── schedule/               # 课程表
│   ├── grades/                 # 成绩查询
│   ├── profile/                # 个人中心
│   └── ...                     # 其他页面
├── static/                     # 静态资源目录
│   ├── images/                 # 图片资源
│   ├── icons/                  # 图标资源
│   └── logo.png               # 应用图标
├── utils/                      # 工具函数目录
│   ├── semester.js            # 学期计算工具
│   ├── date-formatter.js      # 时间格式化工具
│   ├── course-time.js         # 课程时间管理
│   ├── secure-storage.js      # 安全存储工具
│   └── encryption-test.js     # 加密测试工具
├── services/                   # 服务层目录
│   ├── auth.js                # 认证服务
│   ├── api.js                 # API接口封装
│   └── request.js             # 网络请求封装
├── components/                 # 公共组件目录
│   ├── common/                # 通用组件
│   └── business/              # 业务组件
├── docs/                      # 文档目录
│   ├── DEVELOPMENT.md         # 开发指南
│   ├── CHANGELOG.md           # 更新日志
│   └── API.md                 # API文档
├── manifest.json              # 应用配置文件
├── pages.json                 # 页面路由配置
├── uni.scss                   # 全局样式变量
├── App.vue                    # 应用入口组件
├── main.js                    # 应用入口文件
├── .gitignore                 # Git忽略文件
├── README.md                  # 项目说明文档
└── README_EN.md               # 英文说明文档
```

## 🔧 核心模块详解

### 1. 学期计算模块 (`utils/semester.js`)
负责学期信息管理和周次计算：
```javascript
import semesterCalculator from '@/utils/semester.js';

// 获取当前学期信息
const currentSemester = semesterCalculator.getCurrentSemester();

// 获取当前周次
const currentWeek = semesterCalculator.getCurrentWeek();

// 获取指定周的日期范围
const weekDays = semesterCalculator.getWeekDays(17);
```

**主要功能：**
- 学期配置管理
- 周次自动计算
- 日期范围生成
- 缓存机制优化

### 2. 时间格式化模块 (`utils/date-formatter.js`)
统一的时间格式化工具：
```javascript
import dateFormatter from '@/utils/date-formatter.js';

// 格式化当前时间（24小时制）
const currentTime = dateFormatter.getCurrentTime('chinese');

// 格式化指定日期
const formattedDate = dateFormatter.formatDateTime(new Date(), 'iso');

// 相对时间显示
const relativeTime = dateFormatter.formatRelativeTime(date);
```

**支持格式：**
- 中文格式：`2025年6月16日 14:30:45`
- ISO格式：`2025-06-16 14:30:45`
- 标准格式：`2025/06/16 14:30:45`
- 相对时间：`2小时前`、`昨天`

### 3. 课程时间管理 (`utils/course-time.js`)
标准化课程时间处理：
```javascript
import courseTimeManager from '@/utils/course-time.js';

// 获取时间段信息
const timeSlot = courseTimeManager.getTimeSlot(1); // 第1节课

// 格式化课程时间
const timeRange = courseTimeManager.formatCourseTime([1, 2], 'full');

// 验证时间段
const validation = courseTimeManager.validateTimeSlots([1, 2, 3]);
```

**时间段配置：**
- 第1节：08:00-08:50
- 第2节：09:00-09:50
- 第3节：10:10-11:00
- 第4节：11:10-12:00
- ...（共11个时间段）

### 4. 安全存储模块 (`utils/secure-storage.js`)
加密的本地数据存储：
```javascript
import secureStorage from '@/utils/secure-storage.js';

// 存储加密数据
secureStorage.setItem('userToken', 'your-token');

// 读取解密数据
const token = secureStorage.getItem('userToken');

// 清理过期数据
secureStorage.cleanExpiredData();
```

**安全特性：**
- 数据加密存储
- 自动过期清理
- 版本兼容性
- 完整性验证

### 5. 认证服务 (`services/auth.js`)
用户认证和状态管理：
```javascript
import authService from '@/services/auth.js';

// 用户登录
const result = await authService.login(username, password, isTeacher);

// 检查登录状态
const isLoggedIn = authService.isLoggedIn();

// 用户登出
authService.logout();
```

## 📡 API接口文档

### 基础配置
```javascript
// 基础URL配置
const BASE_URL = 'https://api.csmu.edu.cn';

// 请求头配置
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ' + token
};
```

### 主要接口

#### 1. 用户认证
```javascript
// 登录接口
POST /api/auth/login
{
  "username": "学号/工号",
  "password": "密码",
  "userType": "student|teacher"
}

// 响应
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "jwt-token",
    "userInfo": {...}
  }
}
```

#### 2. 课程表查询
```javascript
// 获取课程表
GET /api/schedule?week=17&semester=2024-2025-2

// 响应
{
  "code": 200,
  "data": {
    "courses": [...],
    "weekInfo": {...}
  }
}
```

#### 3. 成绩查询
```javascript
// 获取成绩
GET /api/grades?semester=2024-2025-2

// 响应
{
  "code": 200,
  "data": {
    "grades": [...],
    "statistics": {...}
  }
}
```

更多接口详情请参考：[API详细文档](API.md)

## 🐛 调试指南

### 1. 开发环境调试
```javascript
// 开启调试模式
const DEBUG = process.env.NODE_ENV === 'development';

// 调试日志
if (DEBUG) {
  console.log('调试信息:', data);
}
```

### 2. 网络请求调试
```javascript
// 在request.js中添加拦截器
uni.addInterceptor('request', {
  invoke(args) {
    console.log('请求参数:', args);
  },
  success(args) {
    console.log('请求成功:', args);
  },
  fail(err) {
    console.error('请求失败:', err);
  }
});
```

### 3. 页面调试
- 使用HBuilderX内置调试器
- Chrome DevTools调试H5版本
- 微信开发者工具调试小程序版本

### 4. 常用调试技巧
```javascript
// 1. 条件断点
if (condition) {
  debugger;
}

// 2. 性能监控
console.time('操作耗时');
// 执行操作
console.timeEnd('操作耗时');

// 3. 内存使用监控
console.log('内存使用:', performance.memory);
```

## 🚀 部署指南

### 1. H5部署
```bash
# 在HBuilderX中选择发行 -> H5
# 生成的文件在 dist/build/h5/ 目录
# 将文件上传到Web服务器
```

### 2. 小程序部署
```bash
# 在HBuilderX中选择发行 -> 小程序-微信
# 使用微信开发者工具打开生成的项目
# 上传代码并提交审核
```

### 3. App部署
```bash
# 在HBuilderX中选择发行 -> 原生App-云打包
# 配置签名证书和应用信息
# 下载生成的安装包
```

## ❓ 常见问题

### 1. 编译错误
**问题**：页面无法正常显示
**解决**：检查pages.json配置和页面路径

### 2. 网络请求失败
**问题**：API请求返回错误
**解决**：检查网络配置和跨域设置

### 3. 样式问题
**问题**：样式在不同平台显示不一致
**解决**：使用uni-app提供的条件编译

### 4. 性能问题
**问题**：页面加载缓慢
**解决**：优化图片资源，使用懒加载

## 📞 技术支持

如果在开发过程中遇到问题，可以通过以下方式获取帮助：

1. **查看文档**：仔细阅读uni-app官方文档
2. **搜索问题**：在GitHub Issues中搜索相关问题
3. **提交Issue**：在项目仓库中提交新的Issue
4. **联系维护者**：发送邮件至 1292548381@qq.com

---

**最后更新时间**：2025年6月16日
**文档版本**：v1.0.0
