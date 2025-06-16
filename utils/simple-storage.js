/**
 * 简单存储工具（无加密版本）
 * 提供历史账号管理功能，不使用加密
 */

class SimpleStorage {
	constructor() {
		this.credentialsKey = 'csmu_credentials';
		this.historyKey = 'csmu_login_history';
		this.maxHistoryCount = 5; // 最多保存5个历史账号
	}

	// 保存记住的凭据（明文）
	saveRememberedCredentials(credentials, userType = 'student') {
		try {
			const data = {
				studentId: credentials.studentId,
				password: credentials.password, // 明文存储
				userType: userType,
				timestamp: Date.now()
			};

			uni.setStorageSync(this.credentialsKey, data);
			return true;
		} catch (e) {
			console.error('保存凭据失败:', e);
			return false;
		}
	}

	// 获取记住的凭据
	getRememberedCredentials() {
		try {
			const saved = uni.getStorageSync(this.credentialsKey);
			return saved || null;
		} catch (e) {
			console.error('获取凭据失败:', e);
			return null;
		}
	}

	// 清除记住的凭据
	clearRememberedCredentials() {
		try {
			uni.removeStorageSync(this.credentialsKey);
			return true;
		} catch (e) {
			console.error('清除凭据失败:', e);
			return false;
		}
	}

	// 添加到历史记录
	addToHistory(credentials, userType = 'student') {
		try {
			let history = this.getLoginHistory(userType);

			// 检查是否已存在相同账号
			const existingIndex = history.findIndex(item =>
				item.studentId === credentials.studentId
			);

			const newRecord = {
				studentId: credentials.studentId,
				password: credentials.password, // 明文存储
				userType: userType,
				lastLogin: Date.now(),
				displayName: this.generateDisplayName(credentials.studentId, userType)
			};

			if (existingIndex >= 0) {
				// 更新现有记录
				history[existingIndex] = newRecord;
			} else {
				// 添加新记录
				history.unshift(newRecord);
			}

			// 限制历史记录数量
			if (history.length > this.maxHistoryCount) {
				history = history.slice(0, this.maxHistoryCount);
			}

			// 按最后登录时间排序
			history.sort((a, b) => b.lastLogin - a.lastLogin);

			uni.setStorageSync(`${this.historyKey}_${userType}`, history);
			return true;
		} catch (e) {
			console.error('添加历史记录失败:', e);
			return false;
		}
	}

	// 获取登录历史
	getLoginHistory(userType = 'student') {
		try {
			const storageKey = `${this.historyKey}_${userType}`;
			const data = uni.getStorageSync(storageKey) || [];

			console.log('🔍 getLoginHistory - 存储键:', storageKey);
			console.log('🔍 getLoginHistory - 原始数据:', data);
			console.log('🔍 getLoginHistory - 数据类型:', typeof data);
			console.log('🔍 getLoginHistory - 是否为数组:', Array.isArray(data));

			return data;
		} catch (e) {
			console.error('获取历史记录失败:', e);
			return [];
		}
	}

	// 获取历史记录（无需解密）
	getDecryptedHistory(userType = 'student') {
		console.log('🔍 getDecryptedHistory - 用户类型:', userType);
		const history = this.getLoginHistory(userType);
		console.log('🔍 getDecryptedHistory - 返回数据:', history);
		return history;
	}

	// 删除单个历史记录
	removeFromHistory(studentId, userType = 'student') {
		try {
			let history = this.getLoginHistory(userType);
			history = history.filter(item => item.studentId !== studentId);
			uni.setStorageSync(`${this.historyKey}_${userType}`, history);
			return true;
		} catch (e) {
			console.error('删除历史记录失败:', e);
			return false;
		}
	}

	// 清空历史记录
	clearHistory(userType = 'student') {
		try {
			uni.removeStorageSync(`${this.historyKey}_${userType}`);
			return true;
		} catch (e) {
			console.error('清空历史记录失败:', e);
			return false;
		}
	}

	// 生成显示名称
	generateDisplayName(studentId, userType) {
		if (userType === 'teacher') {
			return `教师 ${studentId}`;
		} else {
			// 学号脱敏显示
			if (studentId.length > 6) {
				return `${studentId.substring(0, 4)}****${studentId.substring(studentId.length - 2)}`;
			}
			return studentId;
		}
	}

	// 清理过期数据
	cleanExpiredData() {
		try {
			const expireTime = 30 * 24 * 60 * 60 * 1000; // 30天
			const now = Date.now();

			// 清理学生历史记录
			let studentHistory = this.getLoginHistory('student');
			studentHistory = studentHistory.filter(item =>
				(now - item.lastLogin) < expireTime
			);
			uni.setStorageSync(`${this.historyKey}_student`, studentHistory);

			// 清理教师历史记录
			let teacherHistory = this.getLoginHistory('teacher');
			teacherHistory = teacherHistory.filter(item =>
				(now - item.lastLogin) < expireTime
			);
			uni.setStorageSync(`${this.historyKey}_teacher`, teacherHistory);

			return true;
		} catch (e) {
			console.error('清理过期数据失败:', e);
			return false;
		}
	}

	// 简化的初始化方法
	migrateAndValidateData() {
		try {
			console.info('清理过期数据...');
			this.cleanExpiredData();
			return true;
		} catch (e) {
			console.error('数据清理失败:', e);
			return false;
		}
	}

	// 简化的验证方法
	validateStorageIntegrity() {
		try {
			const credentials = this.getRememberedCredentials();
			const studentHistory = this.getLoginHistory('student');
			const teacherHistory = this.getLoginHistory('teacher');

			console.info('存储数据验证完成:', {
				hasCredentials: !!credentials,
				studentHistoryCount: studentHistory.length,
				teacherHistoryCount: teacherHistory.length
			});

			return true;
		} catch (e) {
			console.error('存储数据验证失败:', e);
			return false;
		}
	}
}

export default new SimpleStorage();
