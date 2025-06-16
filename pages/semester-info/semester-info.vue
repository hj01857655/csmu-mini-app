<template>
	<view class="semester-container">
		<!-- 当前学期信息 -->
		<view class="current-semester">
			<view class="section-title">当前学期信息</view>
			<view class="semester-card current">
				<view class="semester-header">
					<view class="semester-name">{{ currentSemester.name }}</view>
					<view class="semester-status current-tag">当前学期</view>
				</view>
				<view class="semester-details">
					<view class="detail-row">
						<text class="detail-label">开始日期：</text>
						<text class="detail-value">{{ currentSemester.startDate }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">结束日期：</text>
						<text class="detail-value">{{ currentSemester.endDate }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">总周数：</text>
						<text class="detail-value">{{ currentSemester.weeks }}周</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">考试周：</text>
						<text class="detail-value">第{{ currentSemester.examWeeks ? currentSemester.examWeeks.join('、') : '--' }}周</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 当前周次信息 -->
		<view class="current-week">
			<view class="section-title">当前周次信息</view>
			<view class="week-card">
				<view class="week-header">
					<view class="week-number">{{ currentWeek.message }}</view>
					<view class="week-status" :class="{ valid: currentWeek.isValid, exam: currentWeek.isExamWeek }">
						{{ currentWeek.isExamWeek ? '考试周' : currentWeek.isValid ? '正常教学' : '非教学周' }}
					</view>
				</view>
				<view class="week-dates">
					<view class="date-range">
						{{ weekDateRange.startDateStr }} 至 {{ weekDateRange.endDateStr }}
					</view>
				</view>
				<view class="week-days">
					<view class="day-item" v-for="day in weekDays" :key="day.key">
						<view class="day-name">{{ day.name }}</view>
						<view class="day-date">{{ day.date }}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 学期列表 -->
		<view class="semester-list">
			<view class="section-title">所有学期</view>
			<view class="semester-item" v-for="semester in allSemesters" :key="semester.key">
				<view class="semester-card" :class="{ current: semester.isCurrent }">
					<view class="semester-header">
						<view class="semester-name">{{ semester.name }}</view>
						<view class="semester-status" :class="{ current: semester.isCurrent }">
							{{ semester.isCurrent ? '当前' : '历史' }}
						</view>
					</view>
					<view class="semester-details">
						<view class="detail-row">
							<text class="detail-label">时间范围：</text>
							<text class="detail-value">{{ semester.startDate }} 至 {{ semester.endDate }}</text>
						</view>
						<view class="detail-row">
							<text class="detail-label">总周数：</text>
							<text class="detail-value">{{ semester.weeks }}周</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 周次选择器 -->
		<view class="week-selector">
			<view class="section-title">周次查看</view>
			<view class="selector-row">
				<picker mode="selector" :value="selectedWeekIndex" :range="weekOptions" @change="onWeekChange">
					<view class="picker-display">
						<text class="picker-text">{{ weekOptions[selectedWeekIndex] }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
			<view class="selected-week-info" v-if="selectedWeekInfo">
				<view class="week-detail">
					<view class="detail-title">{{ selectedWeekInfo.label }}</view>
					<view class="detail-content">
						<view class="detail-row">
							<text class="detail-label">日期范围：</text>
							<text class="detail-value">{{ selectedWeekInfo.dateRange.startDateStr }} 至 {{ selectedWeekInfo.dateRange.endDateStr }}</text>
						</view>
						<view class="detail-row">
							<text class="detail-label">周次类型：</text>
							<text class="detail-value">
								{{ selectedWeekInfo.isExamWeek ? '考试周' : selectedWeekInfo.isHolidayWeek ? '假期周' : '正常教学周' }}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import semesterCalculator from '../../utils/semester.js';

export default {
	data() {
		return {
			currentSemester: {
				name: '',
				startDate: '',
				endDate: '',
				weeks: 0,
				examWeeks: []
			},
			currentWeek: {
				week: 1,
				message: '',
				isValid: false,
				isExamWeek: false
			},
			weekDateRange: {
				startDateStr: '',
				endDateStr: ''
			},
			weekDays: [],
			allSemesters: [],
			weekOptions: [],
			selectedWeekIndex: 0,
			selectedWeekInfo: null
		}
	},
	onLoad() {
		this.initData();
	},
	methods: {
		initData() {
			try {
				// 获取当前学期信息
				this.currentSemester = semesterCalculator.getCurrentSemester() || this.currentSemester;

				// 获取当前周次信息
				this.currentWeek = semesterCalculator.getCurrentWeek() || this.currentWeek;

				// 获取当前周的日期范围
				this.weekDateRange = semesterCalculator.getWeekDateRange(this.currentWeek.week, this.currentSemester) || this.weekDateRange;

				// 获取当前周的每一天
				this.weekDays = semesterCalculator.getWeekDays(this.currentWeek.week, this.currentSemester) || [];

				// 获取所有学期
				this.allSemesters = semesterCalculator.getSemesterOptions() || [];

				// 获取周次选项
				const weekOptionsData = semesterCalculator.getWeekOptions(this.currentSemester) || [];
				this.weekOptions = weekOptionsData.map(option => option.label);

				// 设置当前周次为默认选择
				this.selectedWeekIndex = Math.max(0, this.currentWeek.week - 1);
				this.selectedWeekInfo = weekOptionsData[this.selectedWeekIndex] || null;

				console.log('学期信息初始化完成');
			} catch (error) {
				console.error('学期信息初始化失败:', error);
				uni.showToast({
					title: '数据加载失败',
					icon: 'none'
				});
			}
		},
		onWeekChange(e) {
			this.selectedWeekIndex = e.detail.value;
			
			// 更新选中周次的详细信息
			const weekOptionsData = semesterCalculator.getWeekOptions(this.currentSemester);
			this.selectedWeekInfo = weekOptionsData[this.selectedWeekIndex];
		}
	}
}
</script>

<style scoped>
.semester-container {
	background-color: #f5f7fa;
	min-height: 100vh;
	padding: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	padding-left: 10rpx;
}

.current-semester, .current-week, .semester-list, .week-selector {
	margin-bottom: 30rpx;
}

.semester-card {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.semester-card.current {
	border: 2rpx solid #1976D2;
	background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
}

.semester-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.semester-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.semester-status {
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	font-weight: bold;
}

.semester-status.current, .current-tag {
	background-color: #1976D2;
	color: white;
}

.semester-status:not(.current) {
	background-color: #f5f5f5;
	color: #666;
}

.semester-details {
	margin-top: 20rpx;
}

.detail-row {
	display: flex;
	margin-bottom: 12rpx;
}

.detail-row:last-child {
	margin-bottom: 0;
}

.detail-label {
	width: 160rpx;
	font-size: 26rpx;
	color: #666;
}

.detail-value {
	font-size: 26rpx;
	color: #333;
	flex: 1;
}

.week-card {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.week-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.week-number {
	font-size: 32rpx;
	font-weight: bold;
	color: #1976D2;
}

.week-status {
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	font-weight: bold;
}

.week-status.valid {
	background-color: #e8f5e8;
	color: #4caf50;
}

.week-status.exam {
	background-color: #fff3e0;
	color: #ff9800;
}

.week-status:not(.valid):not(.exam) {
	background-color: #ffebee;
	color: #f44336;
}

.week-dates {
	margin-bottom: 20rpx;
}

.date-range {
	font-size: 28rpx;
	color: #666;
	text-align: center;
}

.week-days {
	display: flex;
	justify-content: space-between;
}

.day-item {
	text-align: center;
	flex: 1;
}

.day-name {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.day-date {
	font-size: 26rpx;
	color: #333;
	font-weight: bold;
}

.semester-item {
	margin-bottom: 20rpx;
}

.selector-row {
	margin-bottom: 20rpx;
}

.picker-display {
	background-color: white;
	border-radius: 12rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.picker-text {
	font-size: 28rpx;
	color: #333;
}

.picker-arrow {
	font-size: 24rpx;
	color: #999;
}

.selected-week-info {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.detail-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #1976D2;
	margin-bottom: 20rpx;
}

.detail-content {
	margin-top: 20rpx;
}
</style>
