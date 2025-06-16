/**
 * CSMU教务系统 - 统一存储管理器
 * 提供加密/非加密存储的统一接口，消除重复的存储实现
 */

import secureStorage from './secure-storage.js';
import simpleStorage from './simple-storage.js';

class StorageManager {
	constructor() {
		// 根据环境变量决定是否使用加密存储
		this.useEncryption = process.env.VUE_APP_ENABLE_ENCRYPTION !== 'false';
		
		// 选择存储策略
		this.storage = this.useEncryption ? secureStorage : simpleStorage;
		
		// 存储策略映射
		this.strategies = {
			secure: secureStorage,
			simple: simpleStorage
		};
		
		console.log(`存储管理器初始化: ${this.useEncryption ? '加密' : '简单'}存储模式`);
	}

	/**
	 * 保存用户凭据
	 * @param {Object} credentials - 用户凭据
	 * @param {string} userType - 用户类型
	 * @returns {boolean} 保存是否成功
	 */
	saveCredentials(credentials, userType = 'student') {
		try {
			if (this.useEncryption) {
				return this.storage.saveRememberedCredentials(credentials, userType);
			} else {
				return this.storage.saveRememberedCredentials(credentials, userType);
			}
		} catch (error) {
			console.error('保存凭据失败:', error);
			return false;
		}
	}

	/**
	 * 获取保存的凭据
	 * @param {string} userType - 用户类型
	 * @returns {Object|null} 用户凭据
	 */
	getCredentials(userType = 'student') {
		try {
			if (this.useEncryption) {
				return this.storage.getRememberedCredentials(userType);
			} else {
				return this.storage.getRememberedCredentials(userType);
			}
		} catch (error) {
			console.error('获取凭据失败:', error);
			return null;
		}
	}

	/**
	 * 添加到登录历史
	 * @param {Object} credentials - 用户凭据
	 * @param {string} userType - 用户类型
	 * @returns {boolean} 添加是否成功
	 */
	addToHistory(credentials, userType = 'student') {
		try {
			if (this.useEncryption) {
				return this.storage.addToHistory(credentials, userType);
			} else {
				return this.storage.addToHistory(credentials, userType);
			}
		} catch (error) {
			console.error('添加历史记录失败:', error);
			return false;
		}
	}

	/**
	 * 获取登录历史
	 * @param {string} userType - 用户类型
	 * @returns {Array} 登录历史列表
	 */
	getHistory(userType = 'student') {
		try {
			if (this.useEncryption) {
				return this.storage.getDecryptedHistory(userType);
			} else {
				return this.storage.getLoginHistory(userType);
			}
		} catch (error) {
			console.error('获取历史记录失败:', error);
			return [];
		}
	}

	/**
	 * 清除登录历史
	 * @param {string} userType - 用户类型
	 * @returns {boolean} 清除是否成功
	 */
	clearHistory(userType = 'student') {
		try {
			return this.storage.clearHistory(userType);
		} catch (error) {
			console.error('清除历史记录失败:', error);
			return false;
		}
	}

	/**
	 * 清除所有存储数据
	 * @returns {boolean} 清除是否成功
	 */
	clearAll() {
		try {
			// 清除两种存储的所有数据
			const secureResult = this.strategies.secure.clearAll ? this.strategies.secure.clearAll() : true;
			const simpleResult = this.strategies.simple.clearAll ? this.strategies.simple.clearAll() : true;
			
			// 清除uni-app存储
			uni.clearStorageSync();
			
			return secureResult && simpleResult;
		} catch (error) {
			console.error('清除所有数据失败:', error);
			return false;
		}
	}

	/**
	 * 切换到加密存储
	 * @param {boolean} migrateData - 是否迁移现有数据
	 */
	switchToEncrypted(migrateData = false) {
		if (this.useEncryption) {
			console.log('已经是加密存储模式');
			return;
		}

		if (migrateData) {
			this._migrateToEncrypted();
		}

		this.useEncryption = true;
		this.storage = this.strategies.secure;
		console.log('已切换到加密存储模式');
	}

	/**
	 * 切换到简单存储
	 * @param {boolean} migrateData - 是否迁移现有数据
	 */
	switchToSimple(migrateData = false) {
		if (!this.useEncryption) {
			console.log('已经是简单存储模式');
			return;
		}

		if (migrateData) {
			this._migrateToSimple();
		}

		this.useEncryption = false;
		this.storage = this.strategies.simple;
		console.log('已切换到简单存储模式');
	}

	/**
	 * 获取当前存储模式
	 * @returns {string} 存储模式
	 */
	getCurrentMode() {
		return this.useEncryption ? 'encrypted' : 'simple';
	}

	/**
	 * 检查存储可用性
	 * @returns {Object} 可用性检查结果
	 */
	checkAvailability() {
		const result = {
			simple: false,
			encrypted: false,
			current: this.getCurrentMode()
		};

		try {
			// 测试简单存储
			uni.setStorageSync('test_simple', 'test');
			uni.removeStorageSync('test_simple');
			result.simple = true;
		} catch (error) {
			console.warn('简单存储不可用:', error);
		}

		try {
			// 测试加密存储
			this.strategies.secure.saveRememberedCredentials({ test: 'test' }, 'test');
			this.strategies.secure.clearHistory('test');
			result.encrypted = true;
		} catch (error) {
			console.warn('加密存储不可用:', error);
		}

		return result;
	}

	/**
	 * 获取存储统计信息
	 * @returns {Object} 存储统计
	 */
	getStorageStats() {
		const stats = {
			mode: this.getCurrentMode(),
			totalKeys: 0,
			usedSpace: 0,
			historyCount: {}
		};

		try {
			// 获取所有存储键
			const storageInfo = uni.getStorageInfoSync();
			stats.totalKeys = storageInfo.keys.length;
			stats.usedSpace = storageInfo.currentSize;

			// 统计各用户类型的历史记录数量
			const userTypes = ['student', 'teacher', 'admin'];
			userTypes.forEach(userType => {
				const history = this.getHistory(userType);
				stats.historyCount[userType] = history.length;
			});
		} catch (error) {
			console.error('获取存储统计失败:', error);
		}

		return stats;
	}

	/**
	 * 迁移数据到加密存储
	 * @private
	 */
	_migrateToEncrypted() {
		try {
			console.log('开始迁移数据到加密存储...');
			
			const userTypes = ['student', 'teacher', 'admin'];
			userTypes.forEach(userType => {
				// 获取简单存储的数据
				const credentials = this.strategies.simple.getRememberedCredentials(userType);
				const history = this.strategies.simple.getLoginHistory(userType);

				// 保存到加密存储
				if (credentials) {
					this.strategies.secure.saveRememberedCredentials(credentials, userType);
				}
				
				if (history && history.length > 0) {
					history.forEach(item => {
						this.strategies.secure.addToHistory(item, userType);
					});
				}
			});

			console.log('数据迁移完成');
		} catch (error) {
			console.error('数据迁移失败:', error);
		}
	}

	/**
	 * 迁移数据到简单存储
	 * @private
	 */
	_migrateToSimple() {
		try {
			console.log('开始迁移数据到简单存储...');
			
			const userTypes = ['student', 'teacher', 'admin'];
			userTypes.forEach(userType => {
				// 获取加密存储的数据
				const credentials = this.strategies.secure.getRememberedCredentials(userType);
				const history = this.strategies.secure.getDecryptedHistory(userType);

				// 保存到简单存储
				if (credentials) {
					this.strategies.simple.saveRememberedCredentials(credentials, userType);
				}
				
				if (history && history.length > 0) {
					history.forEach(item => {
						this.strategies.simple.addToHistory(item, userType);
					});
				}
			});

			console.log('数据迁移完成');
		} catch (error) {
			console.error('数据迁移失败:', error);
		}
	}
}

// 创建单例实例
const storageManager = new StorageManager();

// 导出单例和类
export default storageManager;
export { StorageManager };
