# 课表页面学年学期选择功能实现文档

## 功能概述

为课表页面添加了学年学期选择功能，用户可以查看不同学年学期的课程表，提升了系统的实用性和灵活性。

## 实现的功能

### 1. 学年学期选择器
- **位置**: 位于课表页面顶部，周次选择器上方
- **组成**: 单一的统一学年学期选择器
- **显示格式**: 完整的学期标识（如："2024-2025学年第1学期"）
- **数据格式**: 内部使用简化格式（如："2024-2025-1"）
- **样式**: 与现有设计风格保持一致（#1976D2主色调，圆角设计）

### 2. 数据管理
- **学期选项**: 直接获取所有可用学期，按时间排序
- **显示转换**: 自动将内部格式转换为用户友好的显示格式
- **本地存储**: 保存用户的选择状态，下次打开时恢复

### 3. 智能默认值
- **当前学期**: 优先显示当前学年学期
- **用户选择**: 记住用户上次的选择
- **降级处理**: 如果没有当前学期，显示最近的学期

## 技术实现

### 1. 新增的工具方法 (`utils/semester.js`)

```javascript
// 获取学年选项
getAcademicYearOptions()

// 获取指定学年的学期选项
getSemestersByYear(academicYear)

// 解析学期标识
parseSemesterKey(semesterKey)

// 获取当前学年学期信息
getCurrentAcademicInfo()
```

### 2. 页面组件更新 (`pages/schedule/schedule.vue`)

#### 新增数据字段
```javascript
data() {
  return {
    // 学年学期相关
    currentSemesterIndex: 0,
    allSemesterOptions: [],
    selectedSemesterKey: '',
    // ... 其他字段
  }
}
```

#### 新增方法
- `getAllSemesterOptionsWithDisplay()` - 获取带显示名称的学期选项
- `updateCurrentSemesterData()` - 更新当前学期数据
- `onSemesterChange()` - 学期选择变化处理
- `jumpToCurrentSemester()` - 快速跳转到当前学期

### 3. API调用优化

根据选择的学期调用不同的API：
- 当前学期：`educationApi.getCurrentSchedule(week)`
- 历史学期：`educationApi.getScheduleBySemester(semesterKey, week)`

## 用户体验特性

### 1. 智能初始化
- 自动检测当前学年学期
- 恢复用户上次选择
- 提供合理的默认值

### 2. 状态保持
- 本地存储用户选择
- 页面刷新后保持状态
- 跨页面访问保持一致

### 3. 加载提示
- 切换学年学期时显示加载状态
- 错误处理和用户提示
- 静默降级到模拟数据

### 4. 响应式设计
- 适配不同屏幕尺寸
- 保持与现有UI风格一致
- 流畅的交互动画

## 样式设计

### 1. 选择器容器
```css
.semester-selector {
  background-color: #fff;
  padding: 20rpx;
  border-bottom: 1rpx solid #e5e5e5;
}
```

### 2. 选择器组件
```css
.semester-picker-text {
  color: #1976D2;
  border: 1rpx solid #1976D2;
  background-color: #E3F2FD;
  border-radius: 8rpx;
}
```

## 数据流程

### 1. 页面加载流程
```
onLoad()
  ↓
checkLoginStatus()
  ↓
initSemesterData()
  ↓
loadScheduleData()
```

### 2. 学期选择流程
```
onSemesterChange()
  ↓
更新选择的学期
  ↓
保存到本地存储
  ↓
更新当前学期数据
  ↓
重新加载课表数据
```

### 3. 快速跳转流程
```
jumpToCurrentSemester()
  ↓
查找当前学期索引
  ↓
更新选择状态
  ↓
保存到本地存储
  ↓
重新加载课表数据
```

## 配置说明

### 1. 学期配置格式
```javascript
'2024-2025-1': {
  name: '2024-2025学年第一学期',
  startDate: '2024-09-02',
  endDate: '2025-01-26',
  weeks: 20,
  examWeeks: [19, 20],
  holidayWeeks: []
}
```

### 2. 本地存储键名
- `selectedAcademicYear`: 选择的学年
- `selectedSemesterKey`: 选择的学期标识

## 测试验证

创建了测试文件 `utils/semester-test.js` 用于验证功能：
- 学年学期功能测试
- 课表页面数据流程测试
- 完整的初始化流程验证

## 兼容性说明

### 1. 向后兼容
- 保持原有周次选择功能不变
- 不影响现有的课表显示逻辑
- API调用保持兼容

### 2. 错误处理
- 学期配置缺失时的降级处理
- API调用失败时的静默处理
- 数据格式异常时的容错机制

## 使用说明

### 1. 用户操作
1. 打开课表页面
2. 在顶部选择器中选择学年
3. 选择对应的学期
4. 系统自动加载对应的课表数据
5. 可以继续使用周次选择器查看不同周次

### 2. 开发者配置
1. 在 `utils/semester.js` 中添加新的学期配置
2. 确保后端API支持学期参数
3. 根据需要调整样式和布局

## 后续优化建议

1. **性能优化**: 添加课表数据缓存机制
2. **用户体验**: 添加学期切换的过渡动画
3. **功能扩展**: 支持快速跳转到当前学期
4. **数据同步**: 与服务器同步学期配置信息
5. **移动端优化**: 针对小屏幕设备优化选择器布局
