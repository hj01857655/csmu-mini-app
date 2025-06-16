/**
 * 教务系统API服务
 * 提供所有教务相关的API接口
 */

import httpClient from './api.js';

/**
 * 教务API服务类
 */
class EducationApiService {
	
	/**
	 * 用户认证相关API
	 */
	
	/**
	 * 用户登录
	 * @param {Object} loginData - 登录数据
	 * @param {string} loginData.username - 用户名
	 * @param {string} loginData.password - 密码
	 * @param {string} loginData.userType - 用户类型 (student/teacher)
	 * @returns {Promise} 登录结果
	 */
	async login(loginData) {
		return await httpClient.post('/auth/login', loginData, {
			loadingText: '登录中...'
		});
	}

	/**
	 * 用户登出
	 * @returns {Promise} 登出结果
	 */
	async logout() {
		return await httpClient.post('/auth/logout', {}, {
			enableLoading: false
		});
	}

	/**
	 * 获取用户信息
	 * @returns {Promise} 用户信息
	 */
	async getUserProfile() {
		return await httpClient.get('/user/profile', {}, {
			loadingText: '获取用户信息...'
		});
	}

	/**
	 * 更新用户信息
	 * @param {Object} profileData - 用户信息
	 * @returns {Promise} 更新结果
	 */
	async updateUserProfile(profileData) {
		return await httpClient.put('/user/profile', profileData, {
			loadingText: '更新中...'
		});
	}

	/**
	 * 修改密码
	 * @param {Object} passwordData - 密码数据
	 * @param {string} passwordData.oldPassword - 旧密码
	 * @param {string} passwordData.newPassword - 新密码
	 * @returns {Promise} 修改结果
	 */
	async changePassword(passwordData) {
		return await httpClient.post('/user/change-password', passwordData, {
			loadingText: '修改密码中...'
		});
	}

	/**
	 * 课程表相关API
	 */

	/**
	 * 获取当前周课程表
	 * @param {number} week - 周次
	 * @returns {Promise} 课程表数据
	 */
	async getCurrentSchedule(week = null) {
		const params = week ? { week } : {};
		return await httpClient.get('/schedule/current', params, {
			loadingText: '加载课程表...'
		});
	}

	/**
	 * 获取指定学期课程表
	 * @param {string} semester - 学期标识
	 * @param {number} week - 周次
	 * @returns {Promise} 课程表数据
	 */
	async getScheduleBySemester(semester, week) {
		return await httpClient.get('/schedule/semester', { semester, week }, {
			loadingText: '加载课程表...'
		});
	}

	/**
	 * 成绩查询相关API
	 */

	/**
	 * 获取成绩列表
	 * @param {string} semester - 学期标识
	 * @returns {Promise} 成绩数据
	 */
	async getGradesList(semester = null) {
		const params = semester ? { semester } : {};
		return await httpClient.get('/grades/list', params, {
			loadingText: '加载成绩...'
		});
	}

	/**
	 * 获取成绩统计
	 * @param {string} semester - 学期标识
	 * @returns {Promise} 成绩统计数据
	 */
	async getGradesStatistics(semester = null) {
		const params = semester ? { semester } : {};
		return await httpClient.get('/grades/statistics', params);
	}

	/**
	 * 考试安排相关API
	 */

	/**
	 * 获取考试列表
	 * @param {string} semester - 学期标识
	 * @param {string} status - 考试状态 (upcoming/completed/all)
	 * @returns {Promise} 考试数据
	 */
	async getExamsList(semester = null, status = 'all') {
		const params = { status };
		if (semester) params.semester = semester;
		
		return await httpClient.get('/exams/list', params, {
			loadingText: '加载考试安排...'
		});
	}

	/**
	 * 获取考试详情
	 * @param {number} examId - 考试ID
	 * @returns {Promise} 考试详情
	 */
	async getExamDetail(examId) {
		return await httpClient.get(`/exams/${examId}`);
	}

	/**
	 * 选课系统相关API
	 */

	/**
	 * 获取可选课程列表
	 * @param {Object} filters - 筛选条件
	 * @param {string} filters.category - 课程类别
	 * @param {string} filters.keyword - 搜索关键词
	 * @returns {Promise} 课程列表
	 */
	async getAvailableCourses(filters = {}) {
		return await httpClient.get('/courses/available', filters, {
			loadingText: '加载课程列表...'
		});
	}

	/**
	 * 选择课程
	 * @param {number} courseId - 课程ID
	 * @returns {Promise} 选课结果
	 */
	async selectCourse(courseId) {
		return await httpClient.post('/courses/select', { courseId }, {
			loadingText: '选课中...'
		});
	}

	/**
	 * 退选课程
	 * @param {number} courseId - 课程ID
	 * @returns {Promise} 退选结果
	 */
	async dropCourse(courseId) {
		return await httpClient.post('/courses/drop', { courseId }, {
			loadingText: '退选中...'
		});
	}

	/**
	 * 获取已选课程
	 * @returns {Promise} 已选课程列表
	 */
	async getSelectedCourses() {
		return await httpClient.get('/courses/selected');
	}

	/**
	 * 提交选课结果
	 * @param {Array} courseIds - 课程ID数组
	 * @returns {Promise} 提交结果
	 */
	async submitCourseSelection(courseIds) {
		return await httpClient.post('/courses/submit', { courseIds }, {
			loadingText: '提交选课...'
		});
	}

	/**
	 * 校园通知相关API
	 */

	/**
	 * 获取通知列表
	 * @param {Object} filters - 筛选条件
	 * @param {string} filters.type - 通知类型
	 * @param {string} filters.keyword - 搜索关键词
	 * @param {number} filters.page - 页码
	 * @param {number} filters.pageSize - 每页数量
	 * @returns {Promise} 通知列表
	 */
	async getNoticesList(filters = {}) {
		return await httpClient.get('/notices/list', filters, {
			loadingText: '加载通知...'
		});
	}

	/**
	 * 获取通知详情
	 * @param {number} noticeId - 通知ID
	 * @returns {Promise} 通知详情
	 */
	async getNoticeDetail(noticeId) {
		return await httpClient.get(`/notices/${noticeId}`);
	}

	/**
	 * 标记通知为已读
	 * @param {number} noticeId - 通知ID
	 * @returns {Promise} 标记结果
	 */
	async markNoticeAsRead(noticeId) {
		return await httpClient.post(`/notices/${noticeId}/read`, {}, {
			enableLoading: false
		});
	}

	/**
	 * 教学评价相关API
	 */

	/**
	 * 获取评价列表
	 * @param {string} semester - 学期标识
	 * @param {string} status - 评价状态 (pending/completed/all)
	 * @returns {Promise} 评价列表
	 */
	async getEvaluationList(semester = null, status = 'all') {
		const params = { status };
		if (semester) params.semester = semester;
		
		return await httpClient.get('/evaluation/list', params, {
			loadingText: '加载评价列表...'
		});
	}

	/**
	 * 提交课程评价
	 * @param {Object} evaluationData - 评价数据
	 * @param {number} evaluationData.courseId - 课程ID
	 * @param {Object} evaluationData.scores - 评分数据
	 * @param {string} evaluationData.comment - 评价意见
	 * @returns {Promise} 提交结果
	 */
	async submitEvaluation(evaluationData) {
		return await httpClient.post('/evaluation/submit', evaluationData, {
			loadingText: '提交评价...'
		});
	}

	/**
	 * 获取评价详情
	 * @param {number} evaluationId - 评价ID
	 * @returns {Promise} 评价详情
	 */
	async getEvaluationDetail(evaluationId) {
		return await httpClient.get(`/evaluation/${evaluationId}`);
	}

	/**
	 * 学期信息相关API
	 */

	/**
	 * 获取学期列表
	 * @returns {Promise} 学期列表
	 */
	async getSemesterList() {
		return await httpClient.get('/semester/list');
	}

	/**
	 * 获取当前学期信息
	 * @returns {Promise} 当前学期信息
	 */
	async getCurrentSemester() {
		return await httpClient.get('/semester/current');
	}

	/**
	 * 获取周次信息
	 * @param {string} semester - 学期标识
	 * @returns {Promise} 周次信息
	 */
	async getWeekInfo(semester = null) {
		const params = semester ? { semester } : {};
		return await httpClient.get('/semester/week-info', params);
	}

	/**
	 * 文件上传相关API
	 */

	/**
	 * 上传头像
	 * @param {string} filePath - 文件路径
	 * @returns {Promise} 上传结果
	 */
	async uploadAvatar(filePath) {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: httpClient.baseURL + '/upload/avatar',
				filePath: filePath,
				name: 'avatar',
				header: {
					'Authorization': httpClient.getAuthToken()
				},
				success: (res) => {
					try {
						const data = JSON.parse(res.data);
						resolve({
							success: true,
							data: data.data,
							message: data.message || '上传成功'
						});
					} catch (e) {
						reject(new Error('上传响应解析失败'));
					}
				},
				fail: (error) => {
					reject(error);
				}
			});
		});
	}

	/**
	 * 数据导出相关API
	 */

	/**
	 * 导出成绩单
	 * @param {string} semester - 学期标识
	 * @param {string} format - 导出格式 (pdf/excel)
	 * @returns {Promise} 导出结果
	 */
	async exportGrades(semester, format = 'pdf') {
		return await httpClient.get('/export/grades', { semester, format }, {
			loadingText: '导出中...'
		});
	}

	/**
	 * 导出课程表
	 * @param {string} semester - 学期标识
	 * @param {string} format - 导出格式 (pdf/excel)
	 * @returns {Promise} 导出结果
	 */
	async exportSchedule(semester, format = 'pdf') {
		return await httpClient.get('/export/schedule', { semester, format }, {
			loadingText: '导出中...'
		});
	}
}

// 创建教务API服务实例
const educationApi = new EducationApiService();

export default educationApi;
