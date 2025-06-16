<template>
	<view class="container">
		<view class="header">
			<text class="title">周次计算测试</text>
		</view>

		<view class="test-section">
			<view class="section-title">当前周次信息</view>
			<view class="info-card">
				<view class="info-item">
					<text class="label">当前时间：</text>
					<text class="value">{{ currentTime }}</text>
				</view>
				<view class="info-item">
					<text class="label">当前学期：</text>
					<text class="value">{{ currentSemester.name }}</text>
				</view>
				<view class="info-item">
					<text class="label">学期开始：</text>
					<text class="value">{{ currentSemester.startDate }}</text>
				</view>
				<view class="info-item">
					<text class="label">当前周次：</text>
					<text class="value week-number">第{{ currentWeek.week }}周</text>
				</view>
				<view class="info-item">
					<text class="label">周次状态：</text>
					<text class="value" :class="{ valid: currentWeek.isValid, invalid: !currentWeek.isValid }">
						{{ currentWeek.message }}
					</text>
				</view>
			</view>
		</view>

		<view class="test-section">
			<view class="section-title">测试用例验证</view>
			<view class="test-cases">
				<view
					class="test-case"
					v-for="(testCase, index) in testCases"
					:key="index"
					:class="{ correct: testCase.isCorrect, incorrect: !testCase.isCorrect }"
				>
					<view class="test-info">
						<text class="test-date">{{ testCase.date }}</text>
						<text class="test-desc">{{ testCase.description }}</text>
					</view>
					<view class="test-result">
						<text class="expected">期望：第{{ testCase.expectedWeek }}周</text>
						<text class="actual">实际：第{{ testCase.actualWeek }}周</text>
						<text class="status">{{ testCase.isCorrect ? '✅' : '❌' }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="test-section">
			<view class="section-title">手动测试</view>
			<view class="manual-test">
				<view class="input-group">
					<text class="input-label">测试日期：</text>
					<input
						class="date-input"
						type="date"
						v-model="testDate"
						@change="testManualDate"
					/>
				</view>
				<view class="manual-result" v-if="manualTestResult">
					<text class="result-text">
						{{ testDate }} 是第{{ manualTestResult.week }}周
					</text>
					<text class="result-message">{{ manualTestResult.message }}</text>
				</view>
			</view>
		</view>

		<view class="test-section">
			<view class="section-title">时间格式验证</view>
			<view class="time-format-test">
				<view class="format-item" v-for="(item, index) in timeFormatTests" :key="index">
					<text class="format-label">{{ item.label }}：</text>
					<text class="format-value">{{ item.value }}</text>
				</view>
			</view>
		</view>

		<view class="action-section">
			<button class="test-btn" @click="runAllTests">重新运行测试</button>
			<button class="validate-btn" @click="validateCalculation">验证计算逻辑</button>
			<button class="format-btn" @click="testTimeFormats">测试时间格式</button>
		</view>
	</view>
</template>

<script>
import semesterCalculator from '../../utils/semester.js';
import dateFormatter from '../../utils/date-formatter.js';

export default {
	data() {
		return {
			currentTime: '',
			currentSemester: null,
			currentWeek: null,
			testDate: '',
			manualTestResult: null,
			timeFormatTests: [],
			testCases: [
				{ date: '2025-02-17', expectedWeek: 1, description: '学期第一天（周一）' },
				{ date: '2025-02-23', expectedWeek: 1, description: '第一周周日' },
				{ date: '2025-02-24', expectedWeek: 2, description: '第二周周一' },
				{ date: '2025-03-03', expectedWeek: 3, description: '第三周周一' },
				{ date: '2025-06-16', expectedWeek: 17, description: '当前日期（应为第17周）' },
				{ date: '2025-06-22', expectedWeek: 17, description: '当前周周日' },
				{ date: '2025-06-23', expectedWeek: 18, description: '下周周一' }
			]
		}
	},

	onLoad() {
		this.initData();
		this.runAllTests();
		this.testTimeFormats();
	},

	methods: {
		initData() {
			// 获取当前时间（使用24小时制格式）
			this.currentTime = dateFormatter.formatDateTime(new Date(), 'chinese');

			// 获取当前学期信息
			this.currentSemester = semesterCalculator.getCurrentSemester();
			this.currentWeek = semesterCalculator.getCurrentWeek();

			// 设置默认测试日期为今天
			const today = new Date();
			this.testDate = dateFormatter.formatDate(today, 'iso');
		},

		runAllTests() {
			console.log('🧪 开始运行周次计算测试');

			// 测试每个用例
			this.testCases.forEach(testCase => {
				const result = semesterCalculator.getCurrentWeek(new Date(testCase.date));
				testCase.actualWeek = result.week;
				testCase.isCorrect = result.week === testCase.expectedWeek;

				console.log(`测试 ${testCase.date}: 期望第${testCase.expectedWeek}周, 实际第${testCase.actualWeek}周, ${testCase.isCorrect ? '✅' : '❌'}`);
			});

			// 更新当前信息
			this.initData();

			// 显示测试结果
			const passCount = this.testCases.filter(tc => tc.isCorrect).length;
			const totalCount = this.testCases.length;

			uni.showToast({
				title: `测试完成：${passCount}/${totalCount} 通过`,
				icon: passCount === totalCount ? 'success' : 'none',
				duration: 3000
			});
		},

		testManualDate() {
			if (this.testDate) {
				this.manualTestResult = semesterCalculator.getCurrentWeek(new Date(this.testDate));
				console.log('手动测试结果:', this.testDate, this.manualTestResult);
			}
		},

		validateCalculation() {
			// 运行详细的验证
			const result = semesterCalculator.validateWeekCalculation();

			uni.showModal({
				title: '验证结果',
				content: `当前是第${result.currentWeek}周\n学期：${result.semester.name}\n测试时间：${result.testDate}`,
				showCancel: false
			});
		},

		testTimeFormats() {
			// 测试不同时间格式
			const now = new Date();

			// 测试特殊时间点
			const testTimes = [
				new Date(2025, 5, 16, 0, 54, 42), // 凌晨00:54:42
				new Date(2025, 5, 16, 12, 30, 15), // 中午12:30:15
				new Date(2025, 5, 16, 23, 59, 59), // 深夜23:59:59
				now // 当前时间
			];

			this.timeFormatTests = [];

			testTimes.forEach((time, index) => {
				const label = index === 0 ? '凌晨时间' :
							 index === 1 ? '中午时间' :
							 index === 2 ? '深夜时间' : '当前时间';

				this.timeFormatTests.push(
					{ label: `${label}(标准)`, value: dateFormatter.formatDateTime(time, 'standard') },
					{ label: `${label}(中文)`, value: dateFormatter.formatDateTime(time, 'chinese') },
					{ label: `${label}(ISO)`, value: dateFormatter.formatDateTime(time, 'iso') },
					{ label: `${label}(仅时间)`, value: dateFormatter.formatTime(time) }
				);
			});

			console.log('🕐 时间格式测试完成');
			console.log('时间格式测试结果:', this.timeFormatTests);
		}
	}
}
</script>

<style scoped>
.container {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	text-align: center;
	margin-bottom: 30rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.test-section {
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #1976D2;
	margin-bottom: 16rpx;
}

.info-card {
	background-color: white;
	border-radius: 12rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.info-item {
	display: flex;
	margin-bottom: 16rpx;
}

.info-item:last-child {
	margin-bottom: 0;
}

.label {
	width: 160rpx;
	font-size: 26rpx;
	color: #666;
}

.value {
	flex: 1;
	font-size: 26rpx;
	color: #333;
}

.week-number {
	font-weight: bold;
	color: #1976D2;
	font-size: 28rpx;
}

.valid {
	color: #4CAF50;
}

.invalid {
	color: #F44336;
}

.test-cases {
	background-color: white;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.test-case {
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.test-case:last-child {
	border-bottom: none;
}

.test-case.correct {
	background-color: #E8F5E8;
}

.test-case.incorrect {
	background-color: #FFEBEE;
}

.test-info {
	flex: 1;
}

.test-date {
	font-size: 24rpx;
	color: #666;
	display: block;
	margin-bottom: 4rpx;
}

.test-desc {
	font-size: 26rpx;
	color: #333;
}

.test-result {
	text-align: right;
}

.expected, .actual {
	font-size: 22rpx;
	color: #666;
	display: block;
	margin-bottom: 2rpx;
}

.status {
	font-size: 24rpx;
}

.manual-test {
	background-color: white;
	border-radius: 12rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.input-group {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.input-label {
	width: 120rpx;
	font-size: 26rpx;
	color: #666;
}

.date-input {
	flex: 1;
	height: 60rpx;
	border: 1rpx solid #ddd;
	border-radius: 8rpx;
	padding: 0 16rpx;
	font-size: 26rpx;
}

.manual-result {
	padding: 16rpx;
	background-color: #f8f9fa;
	border-radius: 8rpx;
}

.result-text {
	font-size: 26rpx;
	color: #333;
	font-weight: bold;
	display: block;
	margin-bottom: 8rpx;
}

.result-message {
	font-size: 24rpx;
	color: #666;
}

.time-format-test {
	background-color: white;
	border-radius: 12rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.format-item {
	display: flex;
	margin-bottom: 12rpx;
	align-items: center;
}

.format-item:last-child {
	margin-bottom: 0;
}

.format-label {
	width: 200rpx;
	font-size: 24rpx;
	color: #666;
	flex-shrink: 0;
}

.format-value {
	flex: 1;
	font-size: 24rpx;
	color: #333;
	font-family: 'Courier New', monospace;
	background-color: #f8f9fa;
	padding: 8rpx 12rpx;
	border-radius: 6rpx;
	border: 1rpx solid #e9ecef;
}

.action-section {
	display: flex;
	gap: 20rpx;
}

.test-btn, .validate-btn, .format-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	border: none;
}

.test-btn {
	background-color: #1976D2;
	color: white;
}

.validate-btn {
	background-color: #FF9800;
	color: white;
}

.format-btn {
	background-color: #4CAF50;
	color: white;
}
</style>
