/**
 * API服务层
 * 统一管理所有API请求和数据处理
 *
 * 配置说明：
 * - 开发环境：使用本地API服务器，启用模拟数据
 * - 生产环境：当前为临时配置，使用与开发环境相同的API地址
 *
 * 重要提醒：
 * 正式部署前需要将生产环境的baseURL更新为真实的API地址
 * 例如：https://api.csmu.edu.cn 或实际的生产环境API服务器地址
 */

// 导入配置
import config from '../config/index.js';

// 获取当前环境配置
const apiConfig = config.getCurrentApiConfig();
const currentEnv = config.CURRENT_ENV;

// 小程序环境兼容的环境检查
const getEnvVar = (key, defaultValue = '') => {
	if (typeof process !== 'undefined' && process.env) {
		return process.env[key] || defaultValue;
	}
	return defaultValue;
};

// 验证API配置（仅在非测试环境）
if (getEnvVar('NODE_ENV') !== 'test') {
	console.log('🔧 API服务初始化:', {
		环境: currentEnv,
		API地址: apiConfig.BASE_URL,
		模拟数据: apiConfig.ENABLE_MOCK ? '启用' : '禁用',
		超时时间: apiConfig.TIMEOUT + 'ms'
	});
}

/**
 * HTTP请求工具类
 */
class HttpClient {
	constructor() {
		this.baseURL = apiConfig.BASE_URL;
		this.timeout = apiConfig.TIMEOUT;
		this.enableMock = apiConfig.ENABLE_MOCK;

		// 环境检测和警告
		this.checkEnvironmentConfig();
	}

	/**
	 * 检查环境配置并输出警告
	 */
	checkEnvironmentConfig() {
		const isDevelopment = currentEnv === 'development';
		const isProduction = currentEnv === 'production';

		// 开发环境信息
		if (isDevelopment) {
			console.log('🔧 API服务 - 开发环境配置:', {
				环境: currentEnv,
				API地址: this.baseURL,
				模拟数据: this.enableMock ? '启用' : '禁用',
				超时时间: this.timeout + 'ms'
			});
		}

		// 生产环境警告
		if (isProduction) {
			console.warn('⚠️ API服务 - 生产环境配置检查:', {
				环境: currentEnv,
				API地址: this.baseURL,
				模拟数据: this.enableMock ? '启用' : '禁用',
				超时时间: this.timeout + 'ms'
			});

			// 检查是否为临时配置
			if (this.baseURL.includes('localhost')) {
				console.warn('🚨 警告：生产环境正在使用localhost API地址！');
				console.warn('📋 部署提醒：请在正式部署前更新为生产环境API地址');
				console.warn('🔗 建议地址：https://api.csmu.edu.cn');
			}

			// 检查模拟数据状态
			if (this.enableMock) {
				console.error('❌ 错误：生产环境不应启用模拟数据！');
			}
		}
	}

	/**
	 * 发送HTTP请求
	 * @param {Object} options - 请求选项
	 * @returns {Promise} 请求结果
	 */
	async request(options) {
		const {
			url,
			method = 'GET',
			data = {},
			header = {},
			enableLoading = true,
			loadingText = '加载中...'
		} = options;

		// 如果启用模拟数据，直接返回模拟结果
		if (this.enableMock) {
			return this.getMockData(url, method, data);
		}

		// 显示加载提示
		if (enableLoading) {
			uni.showLoading({
				title: loadingText,
				mask: true
			});
		}

		try {
			const response = await new Promise((resolve, reject) => {
				uni.request({
					url: this.baseURL + url,
					method,
					data,
					header: {
						'Content-Type': 'application/json',
						'Authorization': this.getAuthToken(),
						...header
					},
					timeout: this.timeout,
					success: resolve,
					fail: reject
				});
			});

			// 隐藏加载提示
			if (enableLoading) {
				uni.hideLoading();
			}

			// 处理响应数据
			return this.handleResponse(response);

		} catch (error) {
			// 隐藏加载提示
			if (enableLoading) {
				uni.hideLoading();
			}

			// 处理错误
			return this.handleError(error);
		}
	}

	/**
	 * GET请求
	 */
	get(url, params = {}, options = {}) {
		const queryString = Object.keys(params).length > 0
			? '?' + Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&')
			: '';

		return this.request({
			url: url + queryString,
			method: 'GET',
			...options
		});
	}

	/**
	 * POST请求
	 */
	post(url, data = {}, options = {}) {
		return this.request({
			url,
			method: 'POST',
			data,
			...options
		});
	}

	/**
	 * PUT请求
	 */
	put(url, data = {}, options = {}) {
		return this.request({
			url,
			method: 'PUT',
			data,
			...options
		});
	}

	/**
	 * DELETE请求
	 */
	delete(url, options = {}) {
		return this.request({
			url,
			method: 'DELETE',
			...options
		});
	}

	/**
	 * 获取认证令牌
	 */
	getAuthToken() {
		try {
			const token = uni.getStorageSync('authToken');
			return token ? `Bearer ${token}` : '';
		} catch (e) {
			return '';
		}
	}

	/**
	 * 处理响应数据
	 */
	handleResponse(response) {
		const { statusCode, data } = response;

		if (statusCode === 200) {
			if (data.code === 0 || data.success) {
				return {
					success: true,
					data: data.data || data.result || data,
					message: data.message || '请求成功'
				};
			} else {
				throw new Error(data.message || '请求失败');
			}
		} else {
			throw new Error(`HTTP ${statusCode}: 请求失败`);
		}
	}

	/**
	 * 处理错误
	 */
	handleError(error) {
		console.error('API请求错误:', error);

		let errorMessage = '网络请求失败';

		if (error.errMsg) {
			if (error.errMsg.includes('timeout')) {
				errorMessage = '请求超时，请检查网络连接';
			} else if (error.errMsg.includes('fail')) {
				errorMessage = '网络连接失败，请检查网络设置';
			}
		} else if (error.message) {
			errorMessage = error.message;
		}

		// 显示错误提示
		uni.showToast({
			title: errorMessage,
			icon: 'none',
			duration: 3000
		});

		return {
			success: false,
			data: null,
			message: errorMessage,
			error
		};
	}

	/**
	 * 获取模拟数据
	 */
	async getMockData(url, method, data) {
		// 模拟网络延迟
		await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

		// 根据URL返回对应的模拟数据
		const mockDataMap = {
			'/auth/login': this.getMockLoginData(data),
			'/user/profile': this.getMockUserProfile(),
			'/schedule/current': this.getMockScheduleData(),
			'/schedule/semester': this.getMockScheduleData(), // 指定学期课表使用相同数据
			'/schedule': this.getMockScheduleData(), // 通用课表接口
			'/grades/list': this.getMockGradesData(),
			'/exams/list': this.getMockExamsData(),
			'/courses/available': this.getMockCoursesData(),
			'/notices/list': this.getMockNoticesData(),
			'/evaluation/list': this.getMockEvaluationData()
		};

		const mockData = mockDataMap[url];

		if (mockData) {
			return {
				success: true,
				data: mockData,
				message: '模拟数据请求成功'
			};
		} else {
			return {
				success: false,
				data: null,
				message: '未找到对应的模拟数据'
			};
		}
	}

	/**
	 * 模拟登录数据
	 */
	getMockLoginData(loginData) {
		const { username, password } = loginData;

		// 模拟登录验证
		if (username && password) {
			return {
				token: 'mock_token_' + Date.now(),
				user: {
					id: 1,
					username: username,
					real_name: '张三',
					student_id: username,
					role: 'student',
					major: '计算机科学与技术',
					grade: '2021',
					class_name: '计科2101班',
					college: '计算机学院'
				}
			};
		} else {
			throw new Error('用户名或密码错误');
		}
	}

	/**
	 * 模拟用户资料数据
	 */
	getMockUserProfile() {
		return {
			id: 1,
			real_name: '张三',
			student_id: '2021001001',
			major: '计算机科学与技术',
			grade: '2021',
			class_name: '计科2101班',
			college: '计算机学院',
			phone: '13800138000',
			email: 'zhangsan@csmu.edu.cn',
			total_credits: 45,
			gpa: '3.65',
			rank: '15/120'
		};
	}

	/**
	 * 模拟课程表数据 - 符合真实接口格式
	 */
	getMockScheduleData() {
		return {
			semester: '2024-2025-1',
			week: 17,
			weekInfo: {
				startDate: '2025-06-16',
				endDate: '2025-06-22',
				isCurrentWeek: true
			},
			courses: [
				{
					id: 1,
					courseId: 'MATH001',
					courseName: '高等数学A',
					courseCode: 'MATH001',
					teacher: '张教授',
					location: '教学楼A101',
					dayOfWeek: 1, // 周一
					timeSlot: '1-2',
					timeText: '08:00-09:50',
					credit: 4,
					courseType: 'math',
					weeks: '1-18',
					classType: '必修'
				},
				{
					id: 2,
					courseId: 'ENG001',
					courseName: '大学英语',
					courseCode: 'ENG001',
					teacher: '李老师',
					location: '教学楼B203',
					dayOfWeek: 1, // 周一
					timeSlot: '5-6',
					timeText: '14:00-15:50',
					credit: 3,
					courseType: 'language',
					weeks: '1-16',
					classType: '必修'
				},
				{
					id: 3,
					courseId: 'CS001',
					courseName: '数据结构与算法',
					courseCode: 'CS001',
					teacher: '王教授',
					location: '教学楼C301',
					dayOfWeek: 3, // 周三
					timeSlot: '3-4',
					timeText: '10:10-12:00',
					credit: 4,
					courseType: 'cs',
					weeks: '1-18',
					classType: '专业必修'
				},
				{
					id: 4,
					courseId: 'PHY001',
					courseName: '大学物理',
					courseCode: 'PHY001',
					teacher: '赵老师',
					location: '教学楼D102',
					dayOfWeek: 2, // 周二
					timeSlot: '1-2',
					timeText: '08:00-09:50',
					credit: 3,
					courseType: 'science',
					weeks: '1-16',
					classType: '必修'
				},
				{
					id: 5,
					courseId: 'PE001',
					courseName: '体育',
					courseCode: 'PE001',
					teacher: '刘教练',
					location: '体育馆',
					dayOfWeek: 4, // 周四
					timeSlot: '7-8',
					timeText: '16:00-17:50',
					credit: 1,
					courseType: 'pe',
					weeks: '1-16',
					classType: '必修'
				},
				{
					id: 6,
					courseId: 'CS002',
					courseName: '计算机网络',
					courseCode: 'CS002',
					teacher: '陈教授',
					location: '教学楼C205',
					dayOfWeek: 5, // 周五
					timeSlot: '3-4',
					timeText: '10:10-12:00',
					credit: 3,
					courseType: 'cs',
					weeks: '1-18',
					classType: '专业必修'
				}
			],
			statistics: {
				totalCourses: 6,
				totalCredits: 18,
				weeklyHours: 24
			}
		};
	}

	/**
	 * 模拟成绩数据
	 */
	getMockGradesData() {
		return {
			semester: '2024-2025-1',
			grades: [
				{
					id: 1,
					courseName: '高等数学A',
					courseCode: 'MATH001',
					credit: 4,
					score: 92,
					gradePoint: 4.2,
					teacher: '张教授',
					examDate: '2024-01-15'
				}
			],
			statistics: {
				totalCredits: 45,
				gpa: 3.65,
				passedCourses: 15,
				totalCourses: 16
			}
		};
	}

	/**
	 * 模拟考试数据
	 */
	getMockExamsData() {
		return [
			{
				id: 1,
				courseName: '高等数学A',
				date: '2025-06-20',
				time: '09:00-11:00',
				location: '教学楼A101',
				teacher: '张教授',
				status: 'upcoming'
			}
		];
	}

	/**
	 * 模拟选课数据
	 */
	getMockCoursesData() {
		return [
			{
				id: 1,
				name: '数据结构与算法',
				code: 'CS201',
				credit: 4,
				teacher: '王教授',
				currentCount: 45,
				maxCount: 50,
				type: 'required'
			}
		];
	}

	/**
	 * 模拟通知数据
	 */
	getMockNoticesData() {
		return [
			{
				id: 1,
				title: '关于2024年春季学期选课的通知',
				content: '选课通知内容...',
				department: '教务处',
				publishTime: '2024-01-10',
				type: 'important'
			}
		];
	}

	/**
	 * 模拟评价数据
	 */
	getMockEvaluationData() {
		return [
			{
				id: 1,
				courseName: '高等数学A',
				teacher: '张教授',
				courseCode: 'MATH001',
				status: 'pending',
				deadline: '2024-01-25 23:59'
			}
		];
	}
}

// 创建HTTP客户端实例
const httpClient = new HttpClient();

export default httpClient;
