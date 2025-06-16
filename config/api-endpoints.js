/**
 * API接口端点配置
 * 定义所有API接口的路径和参数
 */

// 基础配置
const API_BASE = {
	// 开发环境API地址
	DEVELOPMENT: 'http://localhost:8000/api/v1',
	// 测试环境API地址  
	STAGING: 'https://test-api.csmu.edu.cn/api/v1',
	// 生产环境API地址
	PRODUCTION: 'https://api.csmu.edu.cn/api/v1'
};

// 认证相关接口
const AUTH_ENDPOINTS = {
	// 用户登录
	LOGIN: '/auth/login',
	// 刷新Token
	REFRESH_TOKEN: '/auth/refresh',
	// 退出登录
	LOGOUT: '/auth/logout',
	// 获取验证码
	CAPTCHA: '/auth/captcha',
	// 验证Token
	VERIFY_TOKEN: '/auth/verify'
};

// 用户信息相关接口
const USER_ENDPOINTS = {
	// 获取用户资料
	PROFILE: '/user/profile',
	// 更新用户资料
	UPDATE_PROFILE: '/user/profile',
	// 修改密码
	CHANGE_PASSWORD: '/user/password',
	// 上传头像
	UPLOAD_AVATAR: '/user/avatar'
};

// 课程表相关接口
const SCHEDULE_ENDPOINTS = {
	// 获取当前学期课程表
	CURRENT: '/schedule/current',
	// 获取指定学期课程表
	BY_SEMESTER: '/schedule/semester',
	// 获取指定周次课程表
	BY_WEEK: '/schedule/week',
	// 获取课程详情
	COURSE_DETAIL: '/schedule/course',
	// 导出课程表
	EXPORT: '/schedule/export'
};

// 成绩相关接口
const GRADES_ENDPOINTS = {
	// 获取成绩列表
	LIST: '/grades/list',
	// 获取成绩统计
	STATISTICS: '/grades/statistics',
	// 获取成绩详情
	DETAIL: '/grades/detail',
	// 导出成绩单
	EXPORT: '/grades/export',
	// 获取GPA趋势
	GPA_TREND: '/grades/gpa-trend'
};

// 考试安排相关接口
const EXAM_ENDPOINTS = {
	// 获取考试列表
	LIST: '/exams/list',
	// 获取考试详情
	DETAIL: '/exams/detail',
	// 获取考试座位
	SEAT: '/exams/seat',
	// 考试提醒设置
	REMINDER: '/exams/reminder'
};

// 选课相关接口
const COURSE_ENDPOINTS = {
	// 获取可选课程
	AVAILABLE: '/courses/available',
	// 获取已选课程
	SELECTED: '/courses/selected',
	// 选择课程
	SELECT: '/courses/select',
	// 退选课程
	DROP: '/courses/drop',
	// 提交选课
	SUBMIT: '/courses/submit',
	// 选课历史
	HISTORY: '/courses/history'
};

// 通知公告相关接口
const NOTICE_ENDPOINTS = {
	// 获取通知列表
	LIST: '/notices/list',
	// 获取通知详情
	DETAIL: '/notices/detail',
	// 标记已读
	MARK_READ: '/notices/read',
	// 获取未读数量
	UNREAD_COUNT: '/notices/unread-count'
};

// 教学评价相关接口
const EVALUATION_ENDPOINTS = {
	// 获取评价列表
	LIST: '/evaluation/list',
	// 提交评价
	SUBMIT: '/evaluation/submit',
	// 获取评价详情
	DETAIL: '/evaluation/detail',
	// 获取评价统计
	STATISTICS: '/evaluation/statistics'
};

// 系统相关接口
const SYSTEM_ENDPOINTS = {
	// 获取系统配置
	CONFIG: '/system/config',
	// 获取学期列表
	SEMESTERS: '/system/semesters',
	// 获取学院列表
	COLLEGES: '/system/colleges',
	// 获取专业列表
	MAJORS: '/system/majors',
	// 系统公告
	ANNOUNCEMENTS: '/system/announcements'
};

// 文件上传相关接口
const UPLOAD_ENDPOINTS = {
	// 通用文件上传
	FILE: '/upload/file',
	// 图片上传
	IMAGE: '/upload/image',
	// 头像上传
	AVATAR: '/upload/avatar'
};

// 接口参数配置
const API_PARAMS = {
	// 课程表接口参数
	SCHEDULE: {
		// 学期参数格式: 2024-2025-1
		SEMESTER_FORMAT: /^\d{4}-\d{4}-[12]$/,
		// 周次范围: 1-20
		WEEK_RANGE: [1, 20],
		// 支持的导出格式
		EXPORT_FORMATS: ['pdf', 'excel', 'image']
	},
	
	// 成绩接口参数
	GRADES: {
		// 支持的课程类型
		COURSE_TYPES: ['all', 'required', 'elective', 'public'],
		// 支持的状态
		STATUS: ['all', 'passed', 'failed', 'pending']
	},
	
	// 考试接口参数
	EXAMS: {
		// 支持的状态
		STATUS: ['all', 'upcoming', 'completed', 'cancelled']
	},
	
	// 通知接口参数
	NOTICES: {
		// 支持的类型
		TYPES: ['all', 'academic', 'administrative', 'emergency'],
		// 分页参数
		PAGE_SIZE: 20,
		MAX_PAGE_SIZE: 100
	}
};

// 请求头配置
const REQUEST_HEADERS = {
	// 默认请求头
	DEFAULT: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	
	// 需要认证的请求头
	AUTHENTICATED: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': 'Bearer {token}' // {token} 会被实际token替换
	},
	
	// 文件上传请求头
	UPLOAD: {
		'Content-Type': 'multipart/form-data'
	}
};

// 响应状态码
const RESPONSE_CODES = {
	SUCCESS: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	CONFLICT: 409,
	INTERNAL_SERVER_ERROR: 500,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503
};

// 导出所有配置
export default {
	API_BASE,
	AUTH_ENDPOINTS,
	USER_ENDPOINTS,
	SCHEDULE_ENDPOINTS,
	GRADES_ENDPOINTS,
	EXAM_ENDPOINTS,
	COURSE_ENDPOINTS,
	NOTICE_ENDPOINTS,
	EVALUATION_ENDPOINTS,
	SYSTEM_ENDPOINTS,
	UPLOAD_ENDPOINTS,
	API_PARAMS,
	REQUEST_HEADERS,
	RESPONSE_CODES
};

// 导出常用配置
export {
	API_BASE,
	SCHEDULE_ENDPOINTS,
	GRADES_ENDPOINTS,
	EXAM_ENDPOINTS,
	API_PARAMS,
	RESPONSE_CODES
};
