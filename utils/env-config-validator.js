/**
 * 环境配置验证工具
 * 用于检查和验证不同环境下的配置是否正确
 */

/**
 * 环境配置验证器
 */
class EnvironmentConfigValidator {
	constructor() {
		this.currentEnv = process.env.NODE_ENV || 'development';
		this.validationResults = [];
	}

	/**
	 * 验证API配置
	 * @param {Object} apiConfig - API配置对象
	 * @returns {Object} 验证结果
	 */
	validateApiConfig(apiConfig) {
		const results = {
			isValid: true,
			warnings: [],
			errors: [],
			suggestions: []
		};

		// 检查配置完整性
		if (!apiConfig.development || !apiConfig.production) {
			results.isValid = false;
			results.errors.push('缺少开发环境或生产环境配置');
			return results;
		}

		// 验证开发环境配置
		this.validateDevelopmentConfig(apiConfig.development, results);

		// 验证生产环境配置
		this.validateProductionConfig(apiConfig.production, results);

		// 检查环境间配置一致性
		this.checkConfigConsistency(apiConfig, results);

		return results;
	}

	/**
	 * 验证开发环境配置
	 */
	validateDevelopmentConfig(devConfig, results) {
		// 检查基础URL
		if (!devConfig.baseURL) {
			results.errors.push('开发环境缺少baseURL配置');
			results.isValid = false;
		} else if (!devConfig.baseURL.startsWith('http')) {
			results.warnings.push('开发环境baseURL应该包含协议(http/https)');
		}

		// 检查超时配置
		if (!devConfig.timeout || devConfig.timeout < 5000) {
			results.warnings.push('开发环境超时时间建议设置为5秒以上');
		}

		// 检查模拟数据配置
		if (devConfig.enableMock === undefined) {
			results.warnings.push('开发环境建议明确设置enableMock参数');
		}
	}

	/**
	 * 验证生产环境配置
	 */
	validateProductionConfig(prodConfig, results) {
		// 检查基础URL
		if (!prodConfig.baseURL) {
			results.errors.push('生产环境缺少baseURL配置');
			results.isValid = false;
		} else {
			// 检查是否为临时配置
			if (prodConfig.baseURL.includes('localhost') || prodConfig.baseURL.includes('127.0.0.1')) {
				results.warnings.push('⚠️ 生产环境正在使用localhost地址（临时配置）');
				results.suggestions.push('正式部署前请更新为真实的生产环境API地址');
			}

			// 检查HTTPS
			if (!prodConfig.baseURL.startsWith('https') && !prodConfig.baseURL.includes('localhost')) {
				results.warnings.push('生产环境建议使用HTTPS协议');
			}
		}

		// 检查超时配置
		if (!prodConfig.timeout || prodConfig.timeout < 10000) {
			results.warnings.push('生产环境超时时间建议设置为10秒以上');
		}

		// 检查模拟数据配置
		if (prodConfig.enableMock === true) {
			results.errors.push('❌ 生产环境不应启用模拟数据');
			results.isValid = false;
		}
	}

	/**
	 * 检查配置一致性
	 */
	checkConfigConsistency(apiConfig, results) {
		const devConfig = apiConfig.development;
		const prodConfig = apiConfig.production;

		// 检查API地址是否相同（临时配置检查）
		if (devConfig.baseURL === prodConfig.baseURL) {
			if (prodConfig.baseURL.includes('localhost')) {
				results.warnings.push('🔄 开发和生产环境使用相同的localhost地址（临时配置）');
				results.suggestions.push('这是开发阶段的临时配置，正式部署时需要更新生产环境地址');
			} else {
				results.warnings.push('开发和生产环境使用相同的API地址');
			}
		}

		// 检查超时时间差异
		if (Math.abs(devConfig.timeout - prodConfig.timeout) < 2000) {
			results.suggestions.push('建议生产环境的超时时间比开发环境更长');
		}
	}

	/**
	 * 生成配置报告
	 * @param {Object} apiConfig - API配置对象
	 * @returns {string} 格式化的报告
	 */
	generateConfigReport(apiConfig) {
		const validation = this.validateApiConfig(apiConfig);
		const currentConfig = apiConfig[this.currentEnv];

		let report = '\n📊 CSMU教务系统 - API配置验证报告\n';
		report += '='.repeat(50) + '\n\n';

		// 当前环境信息
		report += `🌍 当前环境: ${this.currentEnv}\n`;
		report += `🔗 API地址: ${currentConfig.baseURL}\n`;
		report += `⏱️ 超时时间: ${currentConfig.timeout}ms\n`;
		report += `🎭 模拟数据: ${currentConfig.enableMock ? '启用' : '禁用'}\n\n`;

		// 验证结果
		report += `✅ 配置有效性: ${validation.isValid ? '通过' : '失败'}\n\n`;

		// 错误信息
		if (validation.errors.length > 0) {
			report += '❌ 错误:\n';
			validation.errors.forEach(error => {
				report += `   • ${error}\n`;
			});
			report += '\n';
		}

		// 警告信息
		if (validation.warnings.length > 0) {
			report += '⚠️ 警告:\n';
			validation.warnings.forEach(warning => {
				report += `   • ${warning}\n`;
			});
			report += '\n';
		}

		// 建议信息
		if (validation.suggestions.length > 0) {
			report += '💡 建议:\n';
			validation.suggestions.forEach(suggestion => {
				report += `   • ${suggestion}\n`;
			});
			report += '\n';
		}

		// 部署检查清单
		if (this.currentEnv === 'production') {
			report += '📋 生产环境部署检查清单:\n';
			report += '   □ 确认API地址为真实的生产环境地址\n';
			report += '   □ 确认使用HTTPS协议\n';
			report += '   □ 确认禁用模拟数据\n';
			report += '   □ 确认超时时间适当\n';
			report += '   □ 确认网络安全配置\n';
			report += '   □ 确认API服务器可访问性\n\n';
		}

		report += '='.repeat(50) + '\n';
		return report;
	}

	/**
	 * 输出配置验证结果到控制台
	 * @param {Object} apiConfig - API配置对象
	 */
	logConfigValidation(apiConfig) {
		const report = this.generateConfigReport(apiConfig);
		console.log(report);

		// 根据环境输出不同级别的日志
		const validation = this.validateApiConfig(apiConfig);

		if (!validation.isValid) {
			console.error('🚨 API配置验证失败，请检查配置！');
		} else if (validation.warnings.length > 0) {
			console.warn('⚠️ API配置存在警告，建议检查！');
		} else {
			console.log('✅ API配置验证通过！');
		}
	}

	/**
	 * 检查网络连接
	 * @param {string} baseURL - API基础地址
	 * @returns {Promise<boolean>} 连接状态
	 */
	async checkNetworkConnectivity(baseURL) {
		try {
			// 简单的网络连接检查
			const response = await new Promise((resolve, reject) => {
				uni.request({
					url: baseURL + '/health',
					method: 'GET',
					timeout: 5000,
					success: resolve,
					fail: reject
				});
			});

			return response.statusCode === 200;
		} catch (error) {
			console.warn('网络连接检查失败:', error.errMsg || error.message);
			return false;
		}
	}

	/**
	 * 获取环境配置建议
	 * @param {string} environment - 环境名称
	 * @returns {Object} 配置建议
	 */
	getEnvironmentRecommendations(environment) {
		const recommendations = {
			development: {
				baseURL: 'http://localhost:8000/api',
				timeout: 10000,
				enableMock: true,
				description: '开发环境建议使用本地API服务器和模拟数据',
				envVars: {
					'VUE_APP_API_BASE_URL': 'http://localhost:8000/api/v1',
					'VUE_APP_ENABLE_MOCK': 'true',
					'VUE_APP_DEBUG': 'true'
				}
			},
			production: {
				baseURL: 'https://api.csmu.edu.cn/api',
				timeout: 15000,
				enableMock: false,
				description: '生产环境必须使用真实API地址和禁用模拟数据',
				envVars: {
					'VUE_APP_API_BASE_URL': 'https://api.csmu.edu.cn/api/v1',
					'VUE_APP_ENABLE_MOCK': 'false',
					'VUE_APP_DEBUG': 'false',
					'VUE_APP_FORCE_HTTPS': 'true'
				}
			},
			staging: {
				baseURL: 'https://staging-api.csmu.edu.cn/api',
				timeout: 12000,
				enableMock: false,
				description: '预发布环境使用预发布API服务器',
				envVars: {
					'VUE_APP_API_BASE_URL': 'https://staging-api.csmu.edu.cn/api/v1',
					'VUE_APP_ENABLE_MOCK': 'false',
					'VUE_APP_DEBUG': 'false'
				}
			}
		};

		return recommendations[environment] || recommendations.development;
	}

	/**
	 * 小程序环境兼容的环境变量获取函数
	 */
	getEnvVar(key, defaultValue = '') {
		if (typeof process !== 'undefined' && process.env) {
			return process.env[key] || defaultValue;
		}

		// 小程序环境下的备用配置
		const envConfig = {
			'NODE_ENV': 'development',
			'VUE_APP_API_BASE_URL': '',
			'VUE_APP_ENABLE_MOCK': 'true',
			'VUE_APP_DEBUG': 'true'
		};

		return envConfig[key] || defaultValue;
	}

	/**
	 * 验证环境变量配置
	 * @returns {Object} 验证结果
	 */
	validateEnvironmentVariables() {
		const results = {
			isValid: true,
			warnings: [],
			errors: [],
			suggestions: []
		};

		// 检查必需的环境变量
		const requiredVars = [
			'VUE_APP_API_BASE_URL',
			'VUE_APP_ENABLE_MOCK',
			'NODE_ENV'
		];

		requiredVars.forEach(varName => {
			if (!this.getEnvVar(varName)) {
				results.warnings.push(`缺少环境变量: ${varName}`);
			}
		});

		// 检查生产环境特定配置
		if (this.currentEnv === 'production') {
			if (this.getEnvVar('VUE_APP_ENABLE_MOCK') === 'true') {
				results.errors.push('生产环境不应启用模拟数据');
				results.isValid = false;
			}

			if (this.getEnvVar('VUE_APP_DEBUG') === 'true') {
				results.warnings.push('生产环境建议禁用调试模式');
			}

			const apiBaseUrl = this.getEnvVar('VUE_APP_API_BASE_URL');
			if (apiBaseUrl && !apiBaseUrl.startsWith('https')) {
				results.warnings.push('生产环境建议使用HTTPS协议');
			}
		}

		return results;
	}
}

// 创建验证器实例
const envValidator = new EnvironmentConfigValidator();

export default envValidator;
