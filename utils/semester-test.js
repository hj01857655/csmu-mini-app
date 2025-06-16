/**
 * 学期计算工具测试文件
 * 用于验证学年学期选择功能
 */

import semesterCalculator from './semester.js';

// 测试学年学期功能
function testAcademicYearFunctions() {
	console.log('=== 学年学期功能测试 ===');

	try {
		// 测试获取学年选项
		console.log('\n1. 测试获取学年选项:');
		const academicYears = semesterCalculator.getAcademicYearOptions();
		console.log('学年选项:', academicYears);

		// 测试获取指定学年的学期选项
		console.log('\n2. 测试获取指定学年的学期选项:');
		if (academicYears.length > 0) {
			const firstYear = academicYears[0];
			const semesters = semesterCalculator.getSemestersByYear(firstYear.key);
			console.log(`${firstYear.name} 的学期选项:`, semesters);
		}

		// 测试解析学期标识
		console.log('\n3. 测试解析学期标识:');
		const testKeys = ['2024-2025-1', '2023-2024-2', 'invalid-key'];
		testKeys.forEach(key => {
			const parsed = semesterCalculator.parseSemesterKey(key);
			console.log(`解析 "${key}":`, parsed);
		});

		// 测试获取当前学年学期信息
		console.log('\n4. 测试获取当前学年学期信息:');
		const currentAcademicInfo = semesterCalculator.getCurrentAcademicInfo();
		console.log('当前学年学期信息:', currentAcademicInfo);

		// 测试学期选项
		console.log('\n5. 测试学期选项:');
		const allSemesters = semesterCalculator.getSemesterOptions();
		console.log('所有学期选项:', allSemesters);

		console.log('\n✅ 学年学期功能测试完成');
		return true;
	} catch (error) {
		console.error('❌ 学年学期功能测试失败:', error);
		return false;
	}
}

// 测试课表页面数据初始化流程
function testSchedulePageFlow() {
	console.log('\n=== 课表页面数据流程测试 ===');

	try {
		// 模拟课表页面的初始化流程
		console.log('\n1. 初始化统一学年学期选择器数据:');

		// 获取所有学期选项
		const allSemesterOptions = semesterCalculator.getSemesterOptions();
		console.log('所有学期选项数量:', allSemesterOptions.length);

		// 模拟添加显示名称
		const semesterOptionsWithDisplay = allSemesterOptions.map(semester => ({
			key: semester.key,
			displayName: semester.name,
			startDate: semester.startDate,
			endDate: semester.endDate,
			isCurrent: semester.isCurrent
		}));

		console.log('\n2. 学期选项（带显示名称）:');
		semesterOptionsWithDisplay.forEach((semester, index) => {
			console.log(`${index}: ${semester.displayName} (${semester.key})`);
		});

		// 获取当前学年学期信息
		const currentAcademicInfo = semesterCalculator.getCurrentAcademicInfo();
		console.log('\n3. 当前学年学期信息:', currentAcademicInfo);

		// 模拟选择学期
		if (currentAcademicInfo && semesterOptionsWithDisplay.length > 0) {
			const selectedSemesterKey = currentAcademicInfo.semesterKey;
			const selectedIndex = semesterOptionsWithDisplay.findIndex(s => s.key === selectedSemesterKey);

			console.log('\n4. 模拟选择学期:');
			console.log('选择的学期标识:', selectedSemesterKey);
			console.log('选择的索引:', selectedIndex);
			console.log('显示名称:', semesterOptionsWithDisplay[selectedIndex]?.displayName);

			// 获取学期配置
			const semesterConfig = semesterCalculator.semesterConfig[selectedSemesterKey];
			if (semesterConfig) {
				console.log('\n5. 学期配置信息:');
				console.log('学期名称:', semesterConfig.name);
				console.log('开始日期:', semesterConfig.startDate);
				console.log('结束日期:', semesterConfig.endDate);
				console.log('总周数:', semesterConfig.weeks);

				// 生成周次选项
				const currentSemester = {
					key: selectedSemesterKey,
					name: semesterConfig.name,
					startDate: semesterConfig.startDate,
					endDate: semesterConfig.endDate,
					weeks: semesterConfig.weeks,
					examWeeks: semesterConfig.examWeeks,
					holidayWeeks: semesterConfig.holidayWeeks
				};

				const weekOptions = semesterCalculator.getWeekOptions(currentSemester);
				console.log('\n6. 周次选项数量:', weekOptions.length);
				console.log('前3个周次选项:', weekOptions.slice(0, 3).map(w => w.label));
			}
		}

		console.log('\n✅ 课表页面数据流程测试完成');
		return true;
	} catch (error) {
		console.error('❌ 课表页面数据流程测试失败:', error);
		return false;
	}
}

// 运行所有测试
function runAllTests() {
	console.log('开始运行学期计算工具测试...\n');

	const test1 = testAcademicYearFunctions();
	const test2 = testSchedulePageFlow();

	console.log('\n=== 测试结果汇总 ===');
	console.log('学年学期功能测试:', test1 ? '✅ 通过' : '❌ 失败');
	console.log('课表页面流程测试:', test2 ? '✅ 通过' : '❌ 失败');

	if (test1 && test2) {
		console.log('\n🎉 所有测试通过！学年学期选择功能可以正常使用。');
	} else {
		console.log('\n⚠️ 部分测试失败，请检查代码实现。');
	}
}

// 导出测试函数
export default {
	runAllTests,
	testAcademicYearFunctions,
	testSchedulePageFlow
};

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined') {
	// 浏览器环境
	window.semesterTest = {
		runAllTests,
		testAcademicYearFunctions,
		testSchedulePageFlow
	};
	console.log('学期测试工具已加载，可以在控制台中调用 semesterTest.runAllTests() 运行测试');
}
