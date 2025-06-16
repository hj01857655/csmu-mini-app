// 简化版API工具，避免复杂依赖
import config from '../config/index.js';

export const API_ENDPOINTS = {
	// 认证相关
	LOGIN: '/auth/login',  // 教务系统登录接口
	LOGOUT: '/auth/logout',
	REFRESH_TOKEN: '/auth/refresh',

	// 用户信息
	USER_INFO: '/user/info',
	USER_PROFILE: '/user/profile',

	// 课程表
	SCHEDULE: '/schedule',
	SCHEDULE_BY_WEEK: '/schedule/week',

	// 成绩查询
	GRADES: '/grades',

	// 考试安排
	EXAMS: '/exams',

	// 选课系统
	COURSES: '/courses',
	COURSE_SELECTION: '/courses/selection',

	// 通知公告
	NOTICES: '/notices',

	// 爬虫相关
	CRAWLER_SYNC: '/crawler/sync',
	CRAWLER_STATUS: '/crawler/status',
	CRAWLER_TEST_LOGIN: '/crawler/test-login'
};

// 简化的HTTP请求工具
class SimpleHttp {
	constructor() {
		const apiConfig = config.getCurrentApiConfig();
		this.baseURL = apiConfig.BASE_URL;
		this.timeout = apiConfig.TIMEOUT;
		this.retryTimes = apiConfig.RETRY_TIMES;
	}

	request(options) {
		return new Promise((resolve, reject) => {
			const config = {
				url: this.baseURL + options.url,
				method: options.method || 'GET',
				data: options.data || {},
				header: {
					'Content-Type': 'application/json',
					...options.header
				},
				timeout: this.timeout
			};

			// 添加认证token（登录请求除外）
			if (!options.skipAuth) {
				const token = uni.getStorageSync('access_token');
				if (token) {
					config.header.Authorization = `Bearer ${token}`;
				}
			}

			// 简化请求日志
			console.log(`${config.method} ${config.url}`);

			uni.request({
				...config,
				success: (res) => {
					// 处理成功响应
					if (res.statusCode >= 200 && res.statusCode < 300) {
						resolve(res.data);
					} else if (res.statusCode === 401 && !options.skipAuth) {
						// 仅在非登录请求时处理token过期
						console.warn('Token已过期');
						this.handleTokenExpired();
						reject(new Error('登录已过期，请重新登录'));
					} else {
						// 其他错误
						const errorMsg = res.data?.detail || res.data?.message || `HTTP ${res.statusCode}`;
						console.error('请求失败:', errorMsg);
						reject(new Error(errorMsg));
					}
				},
				fail: (err) => {
					console.error('网络请求失败:', err.errMsg);
					reject(new Error(err.errMsg || '网络请求失败'));
				}
			});
		});
	}

	handleTokenExpired() {
		console.log('处理Token过期，清除认证信息');

		// 清除本地存储
		uni.removeStorageSync('access_token');
		uni.removeStorageSync('refresh_token');
		uni.removeStorageSync('userInfo');
		uni.removeStorageSync('isLoggedIn');
		uni.removeStorageSync('loginTime');

		// 显示友好的提示
		uni.showToast({
			title: '登录已过期，请重新登录',
			icon: 'none',
			duration: 2000
		});

		// 延迟跳转，让用户看到提示
		setTimeout(() => {
			uni.reLaunch({
				url: '/pages/login/login'
			});
		}, 2000);
	}

	get(url, params = {}) {
		const queryString = Object.keys(params)
			.map(key => `${key}=${encodeURIComponent(params[key])}`)
			.join('&');

		const fullUrl = queryString ? `${url}?${queryString}` : url;

		return this.request({
			url: fullUrl,
			method: 'GET'
		});
	}

	post(url, data = {}) {
		return this.request({
			url,
			method: 'POST',
			data
		});
	}
}

const http = new SimpleHttp();

export default http;
