/**
 * 加密解密功能测试工具
 * 用于验证 secure-storage.js 的修复效果
 */

import secureStorage from './secure-storage.js';

class EncryptionTest {
	constructor() {
		this.testCases = [
			// 基本测试用例
			'123456',
			'password',
			'admin123',
			
			// 特殊字符测试
			'pass@word!',
			'密码123',
			'пароль',
			'パスワード',
			
			// 边界情况
			'',
			'a',
			'很长的密码包含各种字符1234567890!@#$%^&*()_+-=[]{}|;:,.<>?',
			
			// Unicode 测试
			'🔒🔑密码',
			'Ñoël123',
			'café@2023',
			
			// 常见密码格式
			'User123!',
			'myP@ssw0rd',
			'Test_Password_2024'
		];
	}

	// 运行所有测试
	runAllTests() {
		console.group('🔐 加密解密功能测试');
		
		let passCount = 0;
		let failCount = 0;
		
		this.testCases.forEach((testCase, index) => {
			try {
				const result = this.testEncryptDecrypt(testCase);
				if (result.success) {
					console.log(`✅ 测试 ${index + 1}: "${testCase}" - 通过`);
					passCount++;
				} else {
					console.error(`❌ 测试 ${index + 1}: "${testCase}" - 失败:`, result.error);
					failCount++;
				}
			} catch (e) {
				console.error(`💥 测试 ${index + 1}: "${testCase}" - 异常:`, e);
				failCount++;
			}
		});
		
		console.log(`\n📊 测试结果: ${passCount} 通过, ${failCount} 失败`);
		console.groupEnd();
		
		return { passCount, failCount };
	}

	// 测试单个加密解密过程
	testEncryptDecrypt(originalText) {
		try {
			// 加密
			const encrypted = secureStorage.encrypt(originalText);
			
			// 验证加密结果
			if (encrypted === '') {
				return { success: false, error: '加密返回空字符串' };
			}
			
			if (encrypted === originalText && originalText !== '') {
				return { success: false, error: '加密未改变原文' };
			}
			
			// 解密
			const decrypted = secureStorage.decrypt(encrypted);
			
			// 验证解密结果
			if (decrypted !== originalText) {
				return { 
					success: false, 
					error: `解密结果不匹配: 期望 "${originalText}", 实际 "${decrypted}"` 
				};
			}
			
			return { 
				success: true, 
				encrypted, 
				decrypted,
				isNewFormat: encrypted.startsWith('CSMU_ENC_V2:')
			};
		} catch (e) {
			return { success: false, error: e.message };
		}
	}

	// 测试旧版本兼容性
	testBackwardCompatibility() {
		console.group('🔄 向后兼容性测试');
		
		// 模拟旧版本加密数据（手动创建一些可能的旧格式）
		const oldFormatTests = [
			// 这些是模拟的旧格式数据，实际使用时需要根据真实的旧数据调整
			'MTIzNDU2', // 可能的旧格式
			'cGFzc3dvcmQ=', // 另一种可能的旧格式
		];
		
		oldFormatTests.forEach((oldData, index) => {
			try {
				const decrypted = secureStorage.decrypt(oldData);
				console.log(`📜 旧格式测试 ${index + 1}: "${oldData}" -> "${decrypted}"`);
			} catch (e) {
				console.warn(`⚠️ 旧格式测试 ${index + 1} 失败:`, e.message);
			}
		});
		
		console.groupEnd();
	}

	// 测试错误处理
	testErrorHandling() {
		console.group('🛡️ 错误处理测试');
		
		const errorCases = [
			null,
			undefined,
			123,
			{},
			[],
			'invalid_base64_!@#$%',
			'CSMU_ENC_V2:invalid_data'
		];
		
		errorCases.forEach((errorCase, index) => {
			try {
				const encrypted = secureStorage.encrypt(errorCase);
				const decrypted = secureStorage.decrypt(errorCase);
				console.log(`🔍 错误处理测试 ${index + 1}: 输入 ${typeof errorCase} -> 加密: "${encrypted}", 解密: "${decrypted}"`);
			} catch (e) {
				console.log(`⚠️ 错误处理测试 ${index + 1}: 捕获异常:`, e.message);
			}
		});
		
		console.groupEnd();
	}

	// 性能测试
	testPerformance() {
		console.group('⚡ 性能测试');
		
		const testData = 'TestPassword123!';
		const iterations = 1000;
		
		// 加密性能测试
		const encryptStart = performance.now();
		for (let i = 0; i < iterations; i++) {
			secureStorage.encrypt(testData);
		}
		const encryptTime = performance.now() - encryptStart;
		
		// 解密性能测试
		const encrypted = secureStorage.encrypt(testData);
		const decryptStart = performance.now();
		for (let i = 0; i < iterations; i++) {
			secureStorage.decrypt(encrypted);
		}
		const decryptTime = performance.now() - decryptStart;
		
		console.log(`📈 性能测试结果 (${iterations} 次迭代):`);
		console.log(`   加密平均时间: ${(encryptTime / iterations).toFixed(3)}ms`);
		console.log(`   解密平均时间: ${(decryptTime / iterations).toFixed(3)}ms`);
		
		console.groupEnd();
	}

	// 完整测试套件
	runFullTestSuite() {
		console.log('🚀 开始完整的加密解密测试套件');
		
		const results = this.runAllTests();
		this.testBackwardCompatibility();
		this.testErrorHandling();
		this.testPerformance();
		
		console.log('✨ 测试套件完成');
		return results;
	}
}

// 导出测试工具
export default new EncryptionTest();

// 如果在浏览器环境中，添加到全局对象以便调试
if (typeof window !== 'undefined') {
	window.encryptionTest = new EncryptionTest();
}
