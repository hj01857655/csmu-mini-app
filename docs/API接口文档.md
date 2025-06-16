# 强智教务系统API接口文档

## 基础信息

- **Base URL**: `https://your-domain.com/api`
- **认证方式**: Bearer Token
- **数据格式**: JSON

## 统一响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1640995200000
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/token过期 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 1. 认证相关

### 1.1 用户登录

**接口地址**: `POST /auth/login`

**请求参数**:
```json
{
  "studentId": "2021001001",
  "password": "123456",
  "captcha": "A8K9",
  "captchaId": "captcha_123456789"
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 7200,
    "userInfo": {
      "studentId": "2021001001",
      "name": "张三",
      "major": "计算机科学与技术",
      "grade": "2021级",
      "class": "计科2101班"
    }
  }
}
```

### 1.2 获取验证码

**接口地址**: `GET /auth/captcha`

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "captchaId": "captcha_123456789",
    "captchaText": "A8K9",
    "captchaImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  }
}
```

### 1.3 退出登录

**接口地址**: `POST /auth/logout`

**请求头**: `Authorization: Bearer {token}`

---

## 2. 课程表相关

### 2.1 获取课程表

**接口地址**: `GET /schedule`

**请求参数**:
```
?semester=2023-2024-1&week=1
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "semester": "2023-2024学年第一学期",
    "week": 1,
    "courses": [
      {
        "courseId": "CS001",
        "courseName": "高等数学A",
        "teacher": "张教授",
        "location": "教学楼A101",
        "dayOfWeek": 1,
        "timeSlot": "1-2",
        "timeText": "周一 1-2节",
        "courseType": "math",
        "credit": 4
      }
    ]
  }
}
```

### 2.2 获取指定周次课程表

**接口地址**: `GET /schedule/week`

**请求参数**:
```
?week=1
```

---

## 3. 成绩查询相关

### 3.1 获取成绩列表

**接口地址**: `GET /grades`

**请求参数**:
```
?semester=2023-2024-1&courseType=all
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "grades": [
      {
        "id": "grade_001",
        "courseId": "CS001",
        "courseName": "高等数学A",
        "courseCode": "MATH001",
        "teacher": "张教授",
        "credit": 4,
        "courseType": "必修",
        "score": 92,
        "gradePoint": 4.2,
        "status": "passed",
        "examDate": "2024-01-15",
        "rank": 5,
        "totalStudents": 120
      }
    ],
    "summary": {
      "totalCredits": 45,
      "gpa": 3.65,
      "passedCourses": 12,
      "totalCourses": 13
    }
  }
}
```

---

## 4. 考试安排相关

### 4.1 获取考试安排

**接口地址**: `GET /exams`

**请求参数**:
```
?semester=2023-2024-1&status=all
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "exams": [
      {
        "id": "exam_001",
        "courseId": "CS001",
        "courseName": "高等数学A",
        "teacher": "张教授",
        "examType": "final",
        "examDate": "2024-01-15",
        "examTime": "09:00-11:00",
        "location": "教学楼A101",
        "seatNumber": "15",
        "duration": "120分钟",
        "examFormat": "闭卷笔试",
        "status": "upcoming",
        "notes": "请携带学生证、身份证"
      }
    ]
  }
}
```

---

## 5. 选课系统相关

### 5.1 获取可选课程

**接口地址**: `GET /courses`

**请求参数**:
```
?semester=2023-2024-2&courseType=elective&keyword=数据结构
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "courses": [
      {
        "id": "course_001",
        "courseCode": "CS201",
        "courseName": "数据结构与算法",
        "teacher": "王教授",
        "credit": 4,
        "courseType": "required",
        "schedule": "周一3-4节，周三5-6节",
        "location": "教学楼A201",
        "currentCount": 45,
        "maxCount": 50,
        "isQuality": true,
        "isOnline": false,
        "description": "课程描述..."
      }
    ]
  }
}
```

### 5.2 选课/退课

**接口地址**: `POST /courses/selection`

**请求参数**:
```json
{
  "courseId": "course_001",
  "action": "select"  // select: 选课, drop: 退课
}
```

**响应数据**:
```json
{
  "code": 200,
  "message": "选课成功",
  "data": {
    "courseId": "course_001",
    "status": "selected"
  }
}
```

---

## 6. 爬虫相关接口

### 6.1 触发数据同步

**接口地址**: `POST /crawler/sync`

**请求参数**:
```json
{
  "studentId": "2021001001",
  "syncType": "all",  // all: 全部, schedule: 课程表, grades: 成绩, exams: 考试
  "force": false      // 是否强制同步
}
```

### 6.2 获取同步状态

**接口地址**: `GET /crawler/status`

**请求参数**:
```
?taskId=sync_123456789
```

**响应数据**:
```json
{
  "code": 200,
  "data": {
    "taskId": "sync_123456789",
    "status": "running",  // pending: 等待中, running: 执行中, completed: 完成, failed: 失败
    "progress": 60,
    "message": "正在同步课程表数据...",
    "startTime": "2024-01-01 10:00:00",
    "endTime": null
  }
}
```

---

## 7. 后端爬虫实现建议

### 7.1 技术栈推荐

- **Node.js + Express**: 轻量级API服务
- **Python + Flask/FastAPI**: 爬虫逻辑处理
- **Puppeteer/Selenium**: 浏览器自动化
- **Redis**: 缓存和任务队列
- **MySQL/PostgreSQL**: 数据存储

### 7.2 爬虫流程

1. **登录验证**: 模拟用户登录强智系统
2. **数据抓取**: 获取课程表、成绩、考试等数据
3. **数据清洗**: 格式化和标准化数据
4. **数据存储**: 保存到数据库
5. **API提供**: 通过RESTful API提供数据

### 7.3 安全考虑

- **频率限制**: 避免过于频繁的请求
- **用户隔离**: 确保用户数据安全
- **错误处理**: 优雅处理网络异常
- **日志记录**: 记录操作日志便于调试

### 7.4 部署建议

- **容器化部署**: 使用Docker进行部署
- **负载均衡**: 支持多实例部署
- **监控告警**: 监控服务状态和性能
- **定时同步**: 定期更新数据
