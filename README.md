# CSMU教务系统小程序

<div align="center">
  <img src="static/logo.png" alt="CSMU Logo" width="120" height="120">
  
  <h3>🎓 现代化的高校教务管理系统</h3>
  
  [![GitHub stars](https://img.shields.io/github/stars/hj01857655/csmu-mini-app?style=flat-square)](https://github.com/hj01857655/csmu-mini-app/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/hj01857655/csmu-mini-app?style=flat-square)](https://github.com/hj01857655/csmu-mini-app/network)
  [![GitHub issues](https://img.shields.io/github/issues/hj01857655/csmu-mini-app?style=flat-square)](https://github.com/hj01857655/csmu-mini-app/issues)
  [![License](https://img.shields.io/github/license/hj01857655/csmu-mini-app?style=flat-square)](LICENSE)
</div>

## 📖 项目简介

CSMU教务系统小程序是一个基于uni-app框架开发的现代化高校教务管理系统，为学生和教师提供便捷的教务服务。系统采用响应式设计，支持多端部署，具有完善的功能模块和优秀的用户体验。

## ✨ 功能特性

### 🔐 用户认证系统
- **双模式登录**：支持学生和教师两种登录模式
- **安全认证**：密码加密存储，支持记住密码功能
- **历史记录**：智能保存登录历史，快速切换账户
- **自动登录**：安全的自动登录机制

### 📅 课程管理
- **课程表查看**：清晰的周视图课程表，支持周次切换
- **时间标准化**：统一的50分钟/节课程时间制
- **实时更新**：智能的周次计算，自动识别当前周次
- **课程详情**：详细的课程信息展示

### 📊 成绩查询
- **多学期查询**：支持查看不同学期的成绩信息
- **成绩统计**：GPA计算和成绩分析
- **成绩导出**：支持成绩数据导出功能

### 👤 个人中心
- **信息管理**：个人资料查看和编辑
- **密码修改**：安全的密码修改功能
- **系统设置**：个性化设置选项

### 🎯 教学评价
- **课程评教**：完整的课程评价系统
- **评价管理**：评价历史查看和管理
- **匿名评价**：保护用户隐私的评价机制

### 📢 校园服务
- **通知公告**：及时的校园通知推送
- **考试安排**：考试时间和地点查询
- **选课系统**：在线选课功能
- **学期信息**：学期安排和重要时间节点

## 🛠️ 技术栈

### 前端框架
- **uni-app**：跨平台应用开发框架
- **Vue.js**：渐进式JavaScript框架
- **CSS3**：现代化样式设计

### 开发工具
- **HBuilderX**：官方推荐的开发工具
- **Git**：版本控制系统
- **ESLint**：代码质量检查

### 核心特性
- **响应式设计**：适配不同屏幕尺寸
- **模块化架构**：清晰的代码组织结构
- **安全机制**：数据加密和安全存储
- **性能优化**：缓存机制和懒加载

## 📱 页面结构

```
pages/
├── login/                 # 登录页面
├── home/                  # 首页
├── schedule/              # 课程表
├── grades/                # 成绩查询
├── profile/               # 个人中心
├── exam/                  # 考试安排
├── course-selection/      # 选课系统
├── notices/               # 校园通知
├── semester-info/         # 学期信息
├── evaluation/            # 教学评价
├── evaluation-form/       # 评价表单
├── evaluation-detail/     # 评价详情
├── profile-detail/        # 个人资料
├── change-password/       # 修改密码
├── edit-profile/          # 编辑信息
└── test-week/            # 周次测试（开发工具）
```

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0.0
- HBuilderX >= 3.0.0
- 微信开发者工具（可选）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/hj01857655/csmu-mini-app.git
cd csmu-mini-app
```

2. **安装依赖**
```bash
npm install
```

3. **开发运行**
```bash
# 在HBuilderX中打开项目
# 选择运行到浏览器或小程序平台
```

4. **构建发布**
```bash
# 在HBuilderX中选择发行
# 选择目标平台进行构建
```

## 📋 使用说明

### 学生用户
1. 选择"学生登录"模式
2. 输入学号和密码
3. 查看课程表、成绩、考试安排等信息
4. 进行课程评价和选课操作

### 教师用户
1. 选择"教师登录"模式
2. 输入工号和密码
3. 查看教学安排和课程信息
4. 管理课程和查看评价结果

## 🔧 开发指南

### 项目结构
```
csmu-mini-app/
├── pages/                 # 页面文件
├── static/                # 静态资源
├── utils/                 # 工具函数
├── services/              # 服务层
├── components/            # 组件库
├── docs/                  # 文档目录
├── manifest.json          # 应用配置
├── pages.json             # 页面配置
└── uni.scss              # 全局样式
```

### 核心工具模块
- `utils/semester.js` - 学期和周次计算
- `utils/date-formatter.js` - 时间格式化
- `utils/course-time.js` - 课程时间管理
- `utils/secure-storage.js` - 安全存储
- `services/auth.js` - 认证服务

### 开发规范
- 使用ES6+语法
- 遵循Vue.js最佳实践
- 统一的代码格式化
- 完善的错误处理

## 🤝 贡献指南

我们欢迎所有形式的贡献！请阅读 [贡献指南](CONTRIBUTING.md) 了解详细信息。

### 贡献方式
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息。

## 📞 联系我们

- **项目维护者**：hj01857655
- **邮箱**：1292548381@qq.com
- **GitHub**：[@hj01857655](https://github.com/hj01857655)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

<div align="center">
  <p>如果这个项目对您有帮助，请给我们一个 ⭐️</p>
  <p>Made with ❤️ by CSMU Development Team</p>
</div>
