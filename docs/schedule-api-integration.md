# 课表接口联调计划

## 1. 联调目标

将课表功能从模拟数据切换到真实API接口，确保数据格式兼容和功能正常。

## 2. 当前状态

### 2.1 已完成
- ✅ 创建了课表接口测试页面 (`pages/schedule-api-test/schedule-api-test.vue`)
- ✅ 更新了模拟数据格式，使其更符合真实接口
- ✅ 配置了API端点定义 (`config/api-endpoints.js`)
- ✅ 在首页添加了接口测试入口

### 2.2 当前接口配置
- **开发环境**: `http://localhost:8000/api/v1`
- **模拟数据**: 启用 (`ENABLE_MOCK: true`)
- **超时时间**: 10秒

## 3. 接口规范

### 3.1 课表接口端点

#### 获取当前学期课程表
```
GET /schedule/current?week={week}
```

#### 获取指定学期课程表
```
GET /schedule/semester?semester={semester}&week={week}
```

### 3.2 请求参数

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| semester | string | 否 | 学期标识 | 2024-2025-1 |
| week | number | 否 | 周次 | 17 |

### 3.3 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "semester": "2024-2025-1",
    "week": 17,
    "weekInfo": {
      "startDate": "2025-06-16",
      "endDate": "2025-06-22",
      "isCurrentWeek": true
    },
    "courses": [
      {
        "id": 1,
        "courseId": "MATH001",
        "courseName": "高等数学A",
        "courseCode": "MATH001",
        "teacher": "张教授",
        "location": "教学楼A101",
        "dayOfWeek": 1,
        "timeSlot": "1-2",
        "timeText": "08:00-09:50",
        "credit": 4,
        "courseType": "math",
        "weeks": "1-18",
        "classType": "必修"
      }
    ],
    "statistics": {
      "totalCourses": 6,
      "totalCredits": 18,
      "weeklyHours": 24
    }
  },
  "timestamp": 1640995200000
}
```

## 4. 联调步骤

### 4.1 第一阶段：接口测试
1. **启动后端服务**
   - 确保后端API服务在 `localhost:8000` 运行
   - 验证接口可访问性

2. **使用测试页面验证**
   - 访问 `/pages/schedule-api-test/schedule-api-test`
   - 测试各个接口端点
   - 验证数据格式

3. **检查点**
   - [ ] 接口返回状态码200
   - [ ] 数据格式符合规范
   - [ ] 课程数据完整

### 4.2 第二阶段：数据格式适配
1. **更新数据处理函数**
   - 修改 `formatScheduleData` 函数
   - 适配新的数据字段

2. **测试数据显示**
   - 验证课程表页面显示
   - 检查课程详情弹窗
   - 确认时间计算正确

3. **检查点**
   - [ ] 课程表正常显示
   - [ ] 课程信息完整
   - [ ] 时间显示正确

### 4.3 第三阶段：功能集成
1. **集成到主要页面**
   - 课程表页面 (`pages/schedule/schedule.vue`)
   - 首页今日课程 (`pages/home/home.vue`)

2. **错误处理**
   - 网络错误处理
   - 数据为空处理
   - 加载状态管理

3. **检查点**
   - [ ] 所有页面正常工作
   - [ ] 错误处理完善
   - [ ] 用户体验良好

### 4.4 第四阶段：性能优化
1. **缓存策略**
   - 实现课程表缓存
   - 设置合理的缓存时间

2. **加载优化**
   - 预加载下周课程
   - 优化网络请求

3. **检查点**
   - [ ] 缓存机制工作
   - [ ] 加载速度提升
   - [ ] 网络请求优化

## 5. 测试用例

### 5.1 基础功能测试
- [ ] 获取当前周课程表
- [ ] 获取指定周课程表
- [ ] 切换学期
- [ ] 切换周次

### 5.2 边界条件测试
- [ ] 网络断开情况
- [ ] 服务器错误响应
- [ ] 数据为空情况
- [ ] 无效参数处理

### 5.3 性能测试
- [ ] 首次加载时间
- [ ] 缓存命中率
- [ ] 内存使用情况

## 6. 风险点和解决方案

### 6.1 数据格式不匹配
**风险**: 后端返回的数据格式与前端期望不符
**解决方案**: 
- 使用接口测试页面验证
- 创建数据适配器函数
- 保留模拟数据作为备用

### 6.2 网络连接问题
**风险**: 开发环境网络不稳定
**解决方案**:
- 实现重试机制
- 提供离线模式
- 优雅降级到模拟数据

### 6.3 性能问题
**风险**: 接口响应慢影响用户体验
**解决方案**:
- 实现加载状态提示
- 添加缓存机制
- 优化数据结构

## 7. 部署前检查清单

- [ ] 所有接口测试通过
- [ ] 数据格式验证完成
- [ ] 错误处理机制完善
- [ ] 性能指标达标
- [ ] 用户体验测试通过
- [ ] 代码审查完成
- [ ] 文档更新完成

## 8. 后续优化

1. **实时更新**: 考虑WebSocket推送课程变更
2. **离线支持**: 实现课程表离线缓存
3. **个性化**: 支持课程表个性化设置
4. **导出功能**: 支持课程表导出为图片/PDF

## 9. 联系信息

- **前端负责人**: 开发团队
- **后端负责人**: API团队
- **测试负责人**: QA团队

---

**更新时间**: 2025年6月16日  
**版本**: v1.0  
**状态**: 进行中
