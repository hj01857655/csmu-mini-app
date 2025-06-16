/**
 * 安全存储工具
 * 提供加密存储和历史账号管理功能
 */

class SecureStorage {
	constructor() {
		this.key = 'csmu_secure_key';
		this.credentialsKey = 'csmu_credentials';
		this.historyKey = 'csmu_login_history';
		this.maxHistoryCount = 5; // 最多保存5个历史账号
	}

	// 输入验证函数
	isValidInput(text) {
		return text !== null && text !== undefined && typeof text === 'string' && text.length > 0;
	}

	// 检查是否为有效的加密数据
	isValidEncryptedData(encryptedText) {
		if (!this.isValidInput(encryptedText)) return false;

		// 检查是否包含我们的加密标识
		return encryptedText.startsWith('CSMU_ENC_V2:');
	}

	// 改进的加密函数（使用更安全的方法）
	encrypt(text) {
		try {
			// 输入验证
			if (!this.isValidInput(text)) {
				console.warn('加密输入无效:', text);
				return '';
			}

			// 使用 TextEncoder 处理 Unicode 字符
			const encoder = new TextEncoder();
			const data = encoder.encode(text);

			// 转换为 Base64
			const base64 = btoa(String.fromCharCode(...data));

			// 简单的字符替换加密（避免产生无效字符）
			const encrypted = base64.split('').map(char => {
				const code = char.charCodeAt(0);
				// 只对 Base64 字符进行安全的位移
				if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
					// A-Z, a-z
					return String.fromCharCode(((code - 65 + 13) % 26) + 65);
				} else if (code >= 48 && code <= 57) {
					// 0-9
					return String.fromCharCode(((code - 48 + 5) % 10) + 48);
				} else {
					// +, /, = 保持不变
					return char;
				}
			}).join('');

			// 添加版本标识
			return 'CSMU_ENC_V2:' + encrypted;
		} catch (e) {
			console.error('加密失败:', e);
			return '';
		}
	}

	// 改进的解密函数
	decrypt(encryptedText) {
		try {
			// 输入验证
			if (!this.isValidInput(encryptedText)) {
				console.warn('解密输入无效:', encryptedText);
				return '';
			}

			// 检查是否为新版本加密数据
			if (this.isValidEncryptedData(encryptedText)) {
				return this.decryptV2(encryptedText);
			} else {
				// 尝试解密旧版本数据
				return this.decryptV1(encryptedText);
			}
		} catch (e) {
			console.error('解密失败:', e);
			return '';
		}
	}

	// 新版本解密
	decryptV2(encryptedText) {
		try {
			// 移除版本标识
			const encrypted = encryptedText.replace('CSMU_ENC_V2:', '');

			// 逆向字符替换
			const base64 = encrypted.split('').map(char => {
				const code = char.charCodeAt(0);
				if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
					// A-Z, a-z
					return String.fromCharCode(((code - 65 - 13 + 26) % 26) + 65);
				} else if (code >= 48 && code <= 57) {
					// 0-9
					return String.fromCharCode(((code - 48 - 5 + 10) % 10) + 48);
				} else {
					return char;
				}
			}).join('');

			// 验证 Base64 格式
			if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
				throw new Error('Invalid Base64 format');
			}

			// 解码 Base64
			const binaryString = atob(base64);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}

			// 使用 TextDecoder 处理 Unicode
			const decoder = new TextDecoder();
			return decoder.decode(bytes);
		} catch (e) {
			console.error('V2解密失败:', e);
			throw e;
		}
	}

	// 旧版本解密（向后兼容）
	decryptV1(encryptedText) {
		try {
			console.warn('使用旧版本解密，建议重新保存数据');

			// 验证输入是否可能是旧版本加密数据
			if (encryptedText.length === 0) {
				return '';
			}

			// 尝试逆向位移
			const shifted = encryptedText.split('').map(char => {
				const code = char.charCodeAt(0);
				// 安全检查，避免产生无效字符
				if (code >= 3) {
					return String.fromCharCode(code - 3);
				} else {
					return char;
				}
			}).join('');

			// 验证是否为有效的 Base64
			if (!/^[A-Za-z0-9+/]*={0,2}$/.test(shifted)) {
				console.warn('旧版本数据格式无效，返回空字符串');
				return '';
			}

			// 尝试解码
			const decoded = atob(shifted);

			// 尝试处理 Unicode（使用旧方法）
			try {
				return decodeURIComponent(escape(decoded));
			} catch (unicodeError) {
				// 如果 Unicode 处理失败，直接返回解码结果
				console.warn('Unicode处理失败，返回原始解码结果');
				return decoded;
			}
		} catch (e) {
			console.error('V1解密失败:', e);
			// 旧版本解密失败时返回空字符串而不是原文
			return '';
		}
	}

	// 保存记住的凭据
	saveRememberedCredentials(credentials, userType = 'student') {
		try {
			const encryptedData = {
				studentId: credentials.studentId,
				password: this.encrypt(credentials.password),
				userType: userType,
				timestamp: Date.now()
			};

			uni.setStorageSync(this.credentialsKey, encryptedData);
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
			if (saved && saved.password) {
				const decryptedPassword = this.decrypt(saved.password);

				// 如果解密失败（返回空字符串），清除损坏的数据
				if (decryptedPassword === '') {
					console.warn('密码解密失败，清除损坏的凭据数据');
					this.clearRememberedCredentials();
					return null;
				}

				return {
					...saved,
					password: decryptedPassword
				};
			}
			return null;
		} catch (e) {
			console.error('获取凭据失败:', e);
			// 清除可能损坏的数据
			this.clearRememberedCredentials();
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
				password: this.encrypt(credentials.password),
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
			return uni.getStorageSync(`${this.historyKey}_${userType}`) || [];
		} catch (e) {
			console.error('获取历史记录失败:', e);
			return [];
		}
	}

	// 获取解密后的历史记录
	getDecryptedHistory(userType = 'student') {
		try {
			const history = this.getLoginHistory(userType);
			const validHistory = [];

			for (const item of history) {
				try {
					const decryptedPassword = this.decrypt(item.password);

					// 只保留成功解密的记录
					if (decryptedPassword !== '') {
						validHistory.push({
							...item,
							password: decryptedPassword
						});
					} else {
						console.warn('跳过解密失败的历史记录:', item.studentId);
					}
				} catch (itemError) {
					console.warn('单个历史记录解密失败:', item.studentId, itemError);
					// 继续处理其他记录
				}
			}

			// 如果有记录被过滤掉，更新存储
			if (validHistory.length !== history.length) {
				console.info('清理了损坏的历史记录，保留有效记录:', validHistory.length);
				this.saveValidHistory(validHistory, userType);
			}

			return validHistory;
		} catch (e) {
			console.error('解密历史记录失败:', e);
			return [];
		}
	}

	// 保存有效的历史记录
	saveValidHistory(validHistory, userType) {
		try {
			uni.setStorageSync(`${this.historyKey}_${userType}`, validHistory);
		} catch (e) {
			console.error('保存有效历史记录失败:', e);
		}
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

	// 数据迁移和验证
	migrateAndValidateData() {
		try {
			console.info('开始数据迁移和验证...');

			// 验证和迁移记住的凭据
			this.migrateRememberedCredentials();

			// 验证和迁移历史记录
			this.migrateHistoryData('student');
			this.migrateHistoryData('teacher');

			console.info('数据迁移和验证完成');
			return true;
		} catch (e) {
			console.error('数据迁移失败:', e);
			return false;
		}
	}

	// 迁移记住的凭据
	migrateRememberedCredentials() {
		try {
			const saved = uni.getStorageSync(this.credentialsKey);
			if (saved && saved.password) {
				// 如果不是新版本格式，尝试重新加密
				if (!this.isValidEncryptedData(saved.password)) {
					console.info('迁移记住的凭据到新格式');
					const decrypted = this.decryptV1(saved.password);
					if (decrypted) {
						saved.password = this.encrypt(decrypted);
						uni.setStorageSync(this.credentialsKey, saved);
						console.info('记住的凭据迁移成功');
					} else {
						console.warn('记住的凭据迁移失败，清除数据');
						this.clearRememberedCredentials();
					}
				}
			}
		} catch (e) {
			console.error('迁移记住的凭据失败:', e);
			this.clearRememberedCredentials();
		}
	}

	// 迁移历史数据
	migrateHistoryData(userType) {
		try {
			const history = this.getLoginHistory(userType);
			let needUpdate = false;

			const migratedHistory = history.map(item => {
				if (item.password && !this.isValidEncryptedData(item.password)) {
					console.info(`迁移${userType}历史记录:`, item.studentId);
					const decrypted = this.decryptV1(item.password);
					if (decrypted) {
						needUpdate = true;
						return {
							...item,
							password: this.encrypt(decrypted)
						};
					} else {
						console.warn(`${userType}历史记录迁移失败:`, item.studentId);
						return null; // 标记为删除
					}
				}
				return item;
			}).filter(item => item !== null); // 移除迁移失败的记录

			if (needUpdate) {
				uni.setStorageSync(`${this.historyKey}_${userType}`, migratedHistory);
				console.info(`${userType}历史记录迁移完成，保留记录:`, migratedHistory.length);
			}
		} catch (e) {
			console.error(`迁移${userType}历史数据失败:`, e);
			// 如果迁移失败，清空该类型的历史记录
			this.clearHistory(userType);
		}
	}

	// 验证存储数据完整性
	validateStorageIntegrity() {
		try {
			console.info('验证存储数据完整性...');

			// 验证记住的凭据
			const credentials = this.getRememberedCredentials();
			if (credentials) {
				console.info('记住的凭据验证通过');
			}

			// 验证历史记录
			const studentHistory = this.getDecryptedHistory('student');
			const teacherHistory = this.getDecryptedHistory('teacher');

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

export default new SecureStorage();
