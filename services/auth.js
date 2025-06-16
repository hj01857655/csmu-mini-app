/**
 * 认证服务模块
 * 处理用户登录、注册、token管理等认证相关功能
 */

import http, { API_ENDPOINTS } from '../utils/simple-api.js';

class AuthService {
	constructor() {
		this.tokenKey = 'access_token';
		this.refreshTokenKey = 'refresh_token';
		this.userInfoKey = 'userInfo';
		this.loginStatusKey = 'isLoggedIn';
	}



	/**
	 * 教务系统登录
	 * @param {Object} credentials - 教务系统登录凭据
	 * @param {string} credentials.username - 学号
	 * @param {string} credentials.password - 教务系统密码
	 * @returns {Promise<Object>} 登录结果
	 */
	async login(credentials) {
		try {
			console.log('开始教务系统登录:', credentials.username);

			// 检查网络连接
			const networkInfo = await uni.getNetworkType();
			if (networkInfo.networkType === 'none') {
				throw new Error('网络连接不可用，请检查网络设置');
			}
			console.log('网络状态:', networkInfo.networkType);

			// 登录请求不需要token验证
			const response = await http.request({
				url: API_ENDPOINTS.LOGIN,
				method: 'POST',
				data: {
					username: credentials.username,
					password: credentials.password
				},
				skipAuth: true  // 跳过token验证
			});

			console.log('登录响应:', response);

			if (response && response.access_token) {
				// 保存认证信息
				await this.saveAuthData(response);
				console.log('教务系统登录成功');
				return {
					success: true,
					data: response,
					message: '登录成功'
				};
			} else {
				throw new Error('登录响应格式错误');
			}
		} catch (error) {
			console.error('教务系统登录失败:', error);
			return {
				success: false,
				message: error.message || '教务系统登录失败'
			};
		}
	}

	/**
	 * 保存认证数据到本地存储
	 * @param {Object} authData - 认证数据
	 */
	async saveAuthData(authData) {
		try {
			// 保存token
			uni.setStorageSync(this.tokenKey, authData.access_token);

			// 保存refresh token（如果有）
			if (authData.refresh_token) {
				uni.setStorageSync(this.refreshTokenKey, authData.refresh_token);
			} else {
				// 清除可能存在的旧refresh token
				uni.removeStorageSync(this.refreshTokenKey);
			}

			// 保存用户信息
			if (authData.user) {
				// 合并用户基本信息和学生信息
				const userInfo = {
					...authData.user,
					// 如果有学生信息，将其展开到用户信息中
					...(authData.user.student_info || {})
				};

				uni.setStorageSync(this.userInfoKey, userInfo);
				console.log('用户信息已保存');
			}

			// 保存登录状态
			uni.setStorageSync(this.loginStatusKey, true);

			// 保存登录时间
			uni.setStorageSync('loginTime', Date.now());

			console.log('认证数据保存成功');
		} catch (error) {
			console.error('保存认证数据失败:', error);
			throw error;
		}
	}

	/**
	 * 获取当前用户信息
	 * @returns {Object|null} 用户信息
	 */
	getCurrentUser() {
		try {
			return uni.getStorageSync(this.userInfoKey) || null;
		} catch (error) {
			console.error('获取用户信息失败:', error);
			return null;
		}
	}

	/**
	 * 检查是否已登录
	 * @returns {boolean} 是否已登录
	 */
	isLoggedIn() {
		try {
			const token = uni.getStorageSync(this.tokenKey);
			const loginStatus = uni.getStorageSync(this.loginStatusKey);
			return !!(token && loginStatus);
		} catch (error) {
			console.error('检查登录状态失败:', error);
			return false;
		}
	}

	/**
	 * 获取访问令牌
	 * @returns {string|null} 访问令牌
	 */
	getAccessToken() {
		try {
			return uni.getStorageSync(this.tokenKey) || null;
		} catch (error) {
			console.error('获取访问令牌失败:', error);
			return null;
		}
	}

	/**
	 * 刷新令牌
	 * @returns {Promise<boolean>} 刷新是否成功
	 */
	async refreshToken() {
		try {
			console.log('🔄 尝试刷新令牌...');

			const refreshToken = uni.getStorageSync(this.refreshTokenKey);
			if (!refreshToken) {
				console.log('⚠️ 没有refresh token，后端可能不支持刷新令牌机制');
				throw new Error('没有refresh token，需要重新登录');
			}

			console.log('🔄 发送刷新令牌请求...');
			const response = await http.post(API_ENDPOINTS.REFRESH_TOKEN, {
				refresh_token: refreshToken
			});

			if (response && response.access_token) {
				console.log('✅ 令牌刷新成功');
				await this.saveAuthData(response);
				return true;
			} else {
				throw new Error('刷新令牌失败');
			}
		} catch (error) {
			console.error('❌ 刷新令牌失败:', error);

			// 检查是否是501错误（后端不支持）
			if (error.message && error.message.includes('501')) {
				console.log('🔄 后端不支持刷新令牌，将提示用户重新登录');
				this.handleTokenExpiredWithoutRefresh();
				return false;
			}

			// 其他错误，清除认证信息并登出
			console.log('🔄 刷新失败，清除认证信息');
			this.logout();
			return false;
		}
	}

	/**
	 * 处理Token过期且不支持刷新的情况
	 */
	handleTokenExpiredWithoutRefresh() {
		console.log('🔄 处理Token过期（无刷新机制）');

		// 显示友好的提示信息
		uni.showModal({
			title: '登录已过期',
			content: '您的登录状态已过期，请重新登录以继续使用',
			showCancel: false,
			confirmText: '重新登录',
			success: (res) => {
				if (res.confirm) {
					this.logout();
				}
			}
		});
	}

	/**
	 * 检查是否支持刷新令牌
	 */
	supportsRefreshToken() {
		const refreshToken = uni.getStorageSync(this.refreshTokenKey);
		return !!refreshToken;
	}

	/**
	 * 登出
	 */
	async logout() {
		try {
			// 调用后端登出接口
			try {
				await http.post(API_ENDPOINTS.LOGOUT);
			} catch (error) {
				console.warn('调用后端登出接口失败:', error);
			}

			// 清除本地存储
			uni.removeStorageSync(this.tokenKey);
			uni.removeStorageSync(this.refreshTokenKey);
			uni.removeStorageSync(this.userInfoKey);
			uni.removeStorageSync(this.loginStatusKey);
			uni.removeStorageSync('loginTime');
			uni.removeStorageSync('savedCredentials');

			console.log('登出成功');

			// 跳转到登录页
			uni.reLaunch({
				url: '/pages/login/login'
			});
		} catch (error) {
			console.error('登出失败:', error);
		}
	}

	/**
	 * 检查token是否即将过期
	 * @returns {boolean} 是否即将过期
	 */
	isTokenExpiringSoon() {
		try {
			const loginTime = uni.getStorageSync('loginTime');
			if (!loginTime) return true;

			const now = Date.now();
			const expireTime = 30 * 60 * 1000; // 30分钟
			const timeLeft = expireTime - (now - loginTime);

			// 如果剩余时间少于5分钟，认为即将过期
			return timeLeft < 5 * 60 * 1000;
		} catch (error) {
			console.error('检查token过期时间失败:', error);
			return true;
		}
	}

	/**
	 * 自动刷新token（如果需要）
	 */
	async autoRefreshToken() {
		if (this.isLoggedIn() && this.isTokenExpiringSoon()) {
			console.log('🔄 Token即将过期，检查刷新策略...');

			if (this.supportsRefreshToken()) {
				console.log('🔄 支持刷新令牌，尝试自动刷新');
				return await this.refreshToken();
			} else {
				console.log('⚠️ 不支持刷新令牌，将在Token过期时提示重新登录');
				// 不支持刷新令牌的情况下，不进行自动刷新
				// 让Token自然过期，然后在API调用时处理401错误
				return true;
			}
		}
		return true;
	}

	/**
	 * 检查Token是否已过期（而不是即将过期）
	 */
	isTokenExpired() {
		try {
			const loginTime = uni.getStorageSync('loginTime');
			if (!loginTime) return true;

			const now = Date.now();
			const expireTime = 30 * 60 * 1000; // 30分钟
			const timeLeft = expireTime - (now - loginTime);

			return timeLeft <= 0;
		} catch (error) {
			console.error('检查token过期状态失败:', error);
			return true;
		}
	}
}

// 创建全局实例
const authService = new AuthService();

export default authService;
