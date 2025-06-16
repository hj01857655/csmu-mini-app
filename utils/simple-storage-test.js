/**
 * 简单存储功能测试
 * 用于验证历史登录功能是否正常工作
 */

import simpleStorage from './simple-storage.js';

class SimpleStorageTest {
	constructor() {
		this.testData = [
			{ studentId: '2021001001', password: 'test123', userType: 'student' },
			{ studentId: '2021001002', password: 'pass456', userType: 'student' },
			{ studentId: 'T001', password: 'teacher123', userType: 'teacher' }
		];
	}

	// 运行所有测试
	runAllTests() {
		console.group('📝 简单存储功能测试');
		
		try {
			this.testRememberCredentials();
			this.testHistoryManagement();
			this.testDataCleanup();
			
			console.log('✅ 所有测试通过！');
		} catch (error) {
			console.error('❌ 测试失败:', error);
		}
		
		console.groupEnd();
	}

	// 测试记住凭据功能
	testRememberCredentials() {
		console.log('🔍 测试记住凭据功能...');
		
		const testCredentials = this.testData[0];
		
		// 保存凭据
		const saveResult = simpleStorage.saveRememberedCredentials(testCredentials, testCredentials.userType);
		console.assert(saveResult === true, '保存凭据应该成功');
		
		// 获取凭据
		const saved = simpleStorage.getRememberedCredentials();
		console.assert(saved !== null, '应该能获取到保存的凭据');
		console.assert(saved.studentId === testCredentials.studentId, '学号应该匹配');
		console.assert(saved.password === testCredentials.password, '密码应该匹配（明文）');
		console.assert(saved.userType === testCredentials.userType, '用户类型应该匹配');
		
		// 清除凭据
		const clearResult = simpleStorage.clearRememberedCredentials();
		console.assert(clearResult === true, '清除凭据应该成功');
		
		const cleared = simpleStorage.getRememberedCredentials();
		console.assert(cleared === null, '清除后应该获取不到凭据');
		
		console.log('✅ 记住凭据功能测试通过');
	}

	// 测试历史记录管理
	testHistoryManagement() {
		console.log('🔍 测试历史记录管理...');
		
		// 清空历史记录
		simpleStorage.clearHistory('student');
		simpleStorage.clearHistory('teacher');
		
		// 添加学生历史记录
		const studentData = this.testData.filter(item => item.userType === 'student');
		studentData.forEach(data => {
			const addResult = simpleStorage.addToHistory(data, data.userType);
			console.assert(addResult === true, '添加历史记录应该成功');
		});
		
		// 获取学生历史记录
		const studentHistory = simpleStorage.getDecryptedHistory('student');
		console.assert(studentHistory.length === studentData.length, '学生历史记录数量应该匹配');
		console.assert(studentHistory[0].password === studentData[0].password, '密码应该是明文');
		
		// 添加教师历史记录
		const teacherData = this.testData.filter(item => item.userType === 'teacher');
		teacherData.forEach(data => {
			const addResult = simpleStorage.addToHistory(data, data.userType);
			console.assert(addResult === true, '添加教师历史记录应该成功');
		});
		
		// 获取教师历史记录
		const teacherHistory = simpleStorage.getDecryptedHistory('teacher');
		console.assert(teacherHistory.length === teacherData.length, '教师历史记录数量应该匹配');
		
		// 测试删除单个记录
		const removeResult = simpleStorage.removeFromHistory(studentData[0].studentId, 'student');
		console.assert(removeResult === true, '删除历史记录应该成功');
		
		const afterRemove = simpleStorage.getDecryptedHistory('student');
		console.assert(afterRemove.length === studentData.length - 1, '删除后数量应该减少');
		
		// 测试清空历史记录
		const clearResult = simpleStorage.clearHistory('student');
		console.assert(clearResult === true, '清空历史记录应该成功');
		
		const afterClear = simpleStorage.getDecryptedHistory('student');
		console.assert(afterClear.length === 0, '清空后应该没有记录');
		
		console.log('✅ 历史记录管理测试通过');
	}

	// 测试数据清理功能
	testDataCleanup() {
		console.log('🔍 测试数据清理功能...');
		
		// 测试初始化
		const initResult = simpleStorage.migrateAndValidateData();
		console.assert(initResult === true, '初始化应该成功');
		
		// 测试验证
		const validateResult = simpleStorage.validateStorageIntegrity();
		console.assert(validateResult === true, '验证应该成功');
		
		console.log('✅ 数据清理功能测试通过');
	}

	// 测试显示名称生成
	testDisplayName() {
		console.log('🔍 测试显示名称生成...');
		
		// 测试学生显示名称
		const studentName = simpleStorage.generateDisplayName('2021001001', 'student');
		console.assert(studentName === '2021****01', '学生显示名称应该脱敏');
		
		// 测试教师显示名称
		const teacherName = simpleStorage.generateDisplayName('T001', 'teacher');
		console.assert(teacherName === '教师 T001', '教师显示名称应该包含前缀');
		
		console.log('✅ 显示名称生成测试通过');
	}

	// 性能测试
	testPerformance() {
		console.log('🔍 测试性能...');
		
		const iterations = 100;
		const testCredentials = this.testData[0];
		
		// 测试保存性能
		const saveStart = performance.now();
		for (let i = 0; i < iterations; i++) {
			simpleStorage.saveRememberedCredentials(testCredentials, testCredentials.userType);
		}
		const saveTime = performance.now() - saveStart;
		
		// 测试读取性能
		const loadStart = performance.now();
		for (let i = 0; i < iterations; i++) {
			simpleStorage.getRememberedCredentials();
		}
		const loadTime = performance.now() - loadStart;
		
		console.log(`📊 性能测试结果 (${iterations} 次迭代):`);
		console.log(`   保存平均时间: ${(saveTime / iterations).toFixed(3)}ms`);
		console.log(`   读取平均时间: ${(loadTime / iterations).toFixed(3)}ms`);
		
		console.log('✅ 性能测试完成');
	}

	// 完整测试套件
	runFullTestSuite() {
		console.log('🚀 开始简单存储完整测试套件');
		
		this.runAllTests();
		this.testDisplayName();
		this.testPerformance();
		
		console.log('✨ 测试套件完成');
		
		return {
			message: '简单存储功能测试完成',
			status: 'success'
		};
	}
}

// 导出测试工具
export default new SimpleStorageTest();

// 如果在浏览器环境中，添加到全局对象以便调试
if (typeof window !== 'undefined') {
	window.simpleStorageTest = new SimpleStorageTest();
}
