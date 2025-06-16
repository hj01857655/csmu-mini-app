/**
 * 应用配置文件
 * 统一管理应用的各种配置信息
 */

// 环境配置
const ENV = {
	DEVELOPMENT: 'development',
	PRODUCTION: 'production',
	TEST: 'test'
};

// 当前环境（可以通过编译时变量或其他方式动态设置）
const CURRENT_ENV = ENV.DEVELOPMENT;

// API配置 - 支持环境变量
const API_CONFIG = {
	[ENV.DEVELOPMENT]: {
		BASE_URL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000/api/v1',
		TIMEOUT: 10000,
		RETRY_TIMES: 3,
		ENABLE_MOCK: true
	},
	[ENV.PRODUCTION]: {
		// 🚀 生产环境配置 - 部署时请更新
		BASE_URL: process.env.VUE_APP_API_BASE_URL || 'https://api.csmu.edu.cn/api/v1',
		TIMEOUT: 15000,
		RETRY_TIMES: 2,
		ENABLE_MOCK: false,
		ENABLE_HTTPS: true,
		ENABLE_COMPRESSION: true
	},
	[ENV.TEST]: {
		BASE_URL: process.env.VUE_APP_API_BASE_URL || 'https://test-api.csmu.edu.cn/api/v1',
		TIMEOUT: 8000,
		RETRY_TIMES: 1,
		ENABLE_MOCK: false
	}
};

// 应用配置
const APP_CONFIG = {
	// 应用信息
	APP_NAME: '强智教务系统',
	APP_VERSION: '1.0.0',
	APP_DESCRIPTION: '基于UniApp开发的移动端教务系统',

	// 主题配置
	THEME: {
		PRIMARY_COLOR: '#1976D2',
		SECONDARY_COLOR: '#42A5F5',
		SUCCESS_COLOR: '#4CAF50',
		WARNING_COLOR: '#FF9800',
		ERROR_COLOR: '#F44336',
		INFO_COLOR: '#2196F3'
	},

	// 页面配置
	PAGE_SIZE: 20,
	MAX_PAGE_SIZE: 100,

	// 缓存配置
	CACHE: {
		USER_INFO_KEY: 'userInfo',
		TOKEN_KEY: 'access_token',
		REFRESH_TOKEN_KEY: 'refresh_token',
		LOGIN_STATUS_KEY: 'isLoggedIn',
		SETTINGS_KEY: 'appSettings'
	},

	// 存储配置
	STORAGE: {
		// Token过期时间（毫秒）
		TOKEN_EXPIRE_TIME: 30 * 60 * 1000, // 30分钟
		// 自动刷新Token的提前时间（毫秒）
		TOKEN_REFRESH_BEFORE: 5 * 60 * 1000, // 5分钟
		// 记住密码的有效期（天）
		REMEMBER_PASSWORD_DAYS: 30
	},

	// 功能开关
	FEATURES: {
		// 是否启用记住密码
		ENABLE_REMEMBER_PASSWORD: true,
		// 是否启用自动登录
		ENABLE_AUTO_LOGIN: false,
		// 是否启用指纹/面容登录
		ENABLE_BIOMETRIC_LOGIN: false,
		// 是否启用推送通知
		ENABLE_PUSH_NOTIFICATION: true,
		// 是否启用数据同步
		ENABLE_DATA_SYNC: true
	},

	// 学期配置
	SEMESTER: {
		// 默认学期
		DEFAULT_SEMESTER: '2024-2025-1',
		// 默认周次
		DEFAULT_WEEK: 1,
		// 学期选项缓存时间（毫秒）
		SEMESTER_CACHE_TIME: 24 * 60 * 60 * 1000 // 24小时
	},

	// 课程表配置
	SCHEDULE: {
		// 每天最大节次
		MAX_TIME_SLOTS: 12,
		// 课程表缓存时间（毫秒）
		CACHE_TIME: 30 * 60 * 1000, // 30分钟
		// 是否显示周末
		SHOW_WEEKEND: true
	},

	// 成绩配置
	GRADES: {
		// 成绩缓存时间（毫秒）
		CACHE_TIME: 60 * 60 * 1000, // 1小时
		// 是否显示排名
		SHOW_RANK: true,
		// 是否显示绩点
		SHOW_GPA: true
	},

	// 考试配置
	EXAMS: {
		// 考试安排缓存时间（毫秒）
		CACHE_TIME: 60 * 60 * 1000, // 1小时
		// 考试提醒提前时间（小时）
		REMINDER_HOURS: [24, 2, 0.5] // 24小时、2小时、30分钟前提醒
	},

	// 网络配置
	NETWORK: {
		// 请求超时时间（毫秒）
		TIMEOUT: 10000,
		// 重试次数
		RETRY_TIMES: 3,
		// 重试间隔（毫秒）
		RETRY_INTERVAL: 1000
	},

	// 日志配置
	LOG: {
		// 是否启用日志
		ENABLE: true,
		// 日志级别: 'debug', 'info', 'warn', 'error'
		LEVEL: CURRENT_ENV === ENV.DEVELOPMENT ? 'debug' : 'info',
		// 是否上传日志
		UPLOAD: CURRENT_ENV === ENV.PRODUCTION,
		// 本地日志保留天数
		RETENTION_DAYS: 7
	}
};

// 获取当前环境的API配置
const getCurrentApiConfig = () => {
	return API_CONFIG[CURRENT_ENV] || API_CONFIG[ENV.DEVELOPMENT];
};

// 获取配置值的辅助函数
const getConfig = (path, defaultValue = null) => {
	const keys = path.split('.');
	let value = APP_CONFIG;

	for (const key of keys) {
		if (value && typeof value === 'object' && key in value) {
			value = value[key];
		} else {
			return defaultValue;
		}
	}

	return value;
};

// 设置配置值的辅助函数
const setConfig = (path, value) => {
	const keys = path.split('.');
	let config = APP_CONFIG;

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!config[key] || typeof config[key] !== 'object') {
			config[key] = {};
		}
		config = config[key];
	}

	config[keys[keys.length - 1]] = value;
};

// 检查功能是否启用
const isFeatureEnabled = (featureName) => {
	return getConfig(`FEATURES.${featureName}`, false);
};

// 获取主题颜色
const getThemeColor = (colorName) => {
	return getConfig(`THEME.${colorName}`, '#1976D2');
};

// 导出配置
export default {
	ENV,
	CURRENT_ENV,
	APP_CONFIG,
	getCurrentApiConfig,
	getConfig,
	setConfig,
	isFeatureEnabled,
	getThemeColor
};

// 导出常用配置
export {
	ENV,
	CURRENT_ENV,
	APP_CONFIG,
	getCurrentApiConfig,
	getConfig,
	setConfig,
	isFeatureEnabled,
	getThemeColor
};
