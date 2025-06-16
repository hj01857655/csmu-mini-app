/**
 * CSMU教务系统 - 统一API配置管理
 * 所有API相关配置的唯一来源，消除重复配置
 */

class ApiConfig {
	constructor() {
		// 环境配置映射
		this.environments = {
			development: {
				baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000/api',
				timeout: 10000,
				enableMock: true,
				retryTimes: 3,
				enableHttps: false,
				enableCompression: false,
				enableCache: true,
				maxConcurrentRequests: 5,
				// 开发环境特定配置
				enableDebugLog: true,
				enableNetworkLog: true,
				enableErrorLog: true
			},
			production: {
				baseURL: process.env.VUE_APP_API_BASE_URL || 'https://api.csmu.edu.cn/api',
				timeout: 15000,
				enableMock: false,
				retryTimes: 2,
				enableHttps: true,
				enableCompression: true,
				enableCache: true,
				maxConcurrentRequests: 3,
				// 生产环境特定配置
				enableDebugLog: false,
				enableNetworkLog: false,
				enableErrorLog: true,
				enableAnalytics: true,
				enableErrorTracking: true
			},
			staging: {
				baseURL: process.env.VUE_APP_API_BASE_URL || 'https://staging-api.csmu.edu.cn/api',
				timeout: 12000,
				enableMock: false,
				retryTimes: 2,
				enableHttps: true,
				enableCompression: true,
				enableCache: true,
				maxConcurrentRequests: 4,
				// 预发布环境特定配置
				enableDebugLog: true,
				enableNetworkLog: true,
				enableErrorLog: true
			}
		};

		// 当前环境
		this.currentEnv = process.env.NODE_ENV || 'development';
		
		// 缓存当前配置
		this._currentConfig = null;
	}

	/**
	 * 获取当前环境的配置
	 * @returns {Object} 当前环境配置
	 */
	getCurrentConfig() {
		if (!this._currentConfig) {
			this._currentConfig = this.getConfig(this.currentEnv);
		}
		return this._currentConfig;
	}

	/**
	 * 获取指定环境的配置
	 * @param {string} environment - 环境名称
	 * @returns {Object} 环境配置
	 */
	getConfig(environment) {
		const config = this.environments[environment];
		if (!config) {
			console.warn(`未找到环境 "${environment}" 的配置，使用开发环境配置`);
			return this.environments.development;
		}
		return { ...config };
	}

	/**
	 * 更新指定环境的配置
	 * @param {string} environment - 环境名称
	 * @param {Object} updates - 更新的配置项
	 */
	updateConfig(environment, updates) {
		if (this.environments[environment]) {
			this.environments[environment] = { 
				...this.environments[environment], 
				...updates 
			};
			
			// 如果更新的是当前环境，清除缓存
			if (environment === this.currentEnv) {
				this._currentConfig = null;
			}
		}
	}

	/**
	 * 获取API基础URL
	 * @param {string} environment - 环境名称，默认为当前环境
	 * @returns {string} API基础URL
	 */
	getBaseURL(environment = this.currentEnv) {
		return this.getConfig(environment).baseURL;
	}

	/**
	 * 获取请求超时时间
	 * @param {string} environment - 环境名称，默认为当前环境
	 * @returns {number} 超时时间（毫秒）
	 */
	getTimeout(environment = this.currentEnv) {
		return this.getConfig(environment).timeout;
	}

	/**
	 * 检查是否启用模拟数据
	 * @param {string} environment - 环境名称，默认为当前环境
	 * @returns {boolean} 是否启用模拟数据
	 */
	isMockEnabled(environment = this.currentEnv) {
		return this.getConfig(environment).enableMock;
	}

	/**
	 * 获取重试次数
	 * @param {string} environment - 环境名称，默认为当前环境
	 * @returns {number} 重试次数
	 */
	getRetryTimes(environment = this.currentEnv) {
		return this.getConfig(environment).retryTimes;
	}

	/**
	 * 检查是否强制使用HTTPS
	 * @param {string} environment - 环境名称，默认为当前环境
	 * @returns {boolean} 是否强制HTTPS
	 */
	isHttpsEnabled(environment = this.currentEnv) {
		return this.getConfig(environment).enableHttps;
	}

	/**
	 * 验证配置的有效性
	 * @param {string} environment - 环境名称，默认为当前环境
	 * @returns {Object} 验证结果
	 */
	validateConfig(environment = this.currentEnv) {
		const config = this.getConfig(environment);
		const results = {
			isValid: true,
			errors: [],
			warnings: []
		};

		// 验证必需字段
		if (!config.baseURL) {
			results.errors.push('缺少baseURL配置');
			results.isValid = false;
		}

		if (!config.timeout || config.timeout <= 0) {
			results.errors.push('timeout配置无效');
			results.isValid = false;
		}

		// 验证URL格式
		if (config.baseURL) {
			try {
				const url = new URL(config.baseURL);
				
				// 生产环境检查
				if (environment === 'production') {
					if (url.protocol !== 'https:') {
						results.warnings.push('生产环境建议使用HTTPS');
					}
					
					if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
						results.errors.push('生产环境不应使用localhost');
						results.isValid = false;
					}
					
					if (config.enableMock) {
						results.errors.push('生产环境不应启用模拟数据');
						results.isValid = false;
					}
				}
			} catch (error) {
				results.errors.push(`baseURL格式无效: ${config.baseURL}`);
				results.isValid = false;
			}
		}

		return results;
	}

	/**
	 * 获取所有环境列表
	 * @returns {Array} 环境名称列表
	 */
	getEnvironments() {
		return Object.keys(this.environments);
	}

	/**
	 * 获取当前环境名称
	 * @returns {string} 当前环境名称
	 */
	getCurrentEnvironment() {
		return this.currentEnv;
	}

	/**
	 * 切换环境（主要用于测试）
	 * @param {string} environment - 目标环境名称
	 */
	switchEnvironment(environment) {
		if (this.environments[environment]) {
			this.currentEnv = environment;
			this._currentConfig = null; // 清除缓存
		} else {
			throw new Error(`未知环境: ${environment}`);
		}
	}

	/**
	 * 获取配置摘要信息
	 * @returns {Object} 配置摘要
	 */
	getConfigSummary() {
		const config = this.getCurrentConfig();
		return {
			environment: this.currentEnv,
			baseURL: config.baseURL,
			timeout: config.timeout,
			enableMock: config.enableMock,
			enableHttps: config.enableHttps,
			retryTimes: config.retryTimes
		};
	}

	/**
	 * 重置配置到默认值
	 * @param {string} environment - 环境名称
	 */
	resetConfig(environment) {
		if (environment && this.environments[environment]) {
			// 这里可以添加重置到默认值的逻辑
			console.log(`重置环境 "${environment}" 的配置`);
		}
	}
}

// 创建单例实例
const apiConfig = new ApiConfig();

// 导出单例和类
export default apiConfig;
export { ApiConfig };
