<template>
	<view class="container">
		<!-- 学期选择器 -->
		<view class="semester-selector">
			<picker mode="selector" :value="currentSemesterIndex" :range="semesterOptions" @change="onSemesterChange">
				<view class="picker-text">
					{{ semesterOptions[currentSemesterIndex] }}
					<text class="arrow">▼</text>
				</view>
			</picker>
		</view>
		
		<!-- 考试统计 -->
		<view class="exam-summary">
			<view class="summary-card">
				<view class="summary-icon">📝</view>
				<view class="summary-info">
					<view class="summary-number">{{ totalExams }}</view>
					<view class="summary-label">总考试科目</view>
				</view>
			</view>
			<view class="summary-card">
				<view class="summary-icon">⏰</view>
				<view class="summary-info">
					<view class="summary-number">{{ upcomingExams }}</view>
					<view class="summary-label">即将考试</view>
				</view>
			</view>
			<view class="summary-card">
				<view class="summary-icon">✅</view>
				<view class="summary-info">
					<view class="summary-number">{{ completedExams }}</view>
					<view class="summary-label">已完成</view>
				</view>
			</view>
		</view>
		
		<!-- 考试列表 -->
		<view class="exam-list">
			<view class="list-header">
				<text class="header-title">考试安排</text>
				<view class="filter-buttons">
					<text class="filter-btn" :class="{ active: filterType === 'all' }" @click="setFilter('all')">全部</text>
					<text class="filter-btn" :class="{ active: filterType === 'upcoming' }" @click="setFilter('upcoming')">即将考试</text>
					<text class="filter-btn" :class="{ active: filterType === 'completed' }" @click="setFilter('completed')">已完成</text>
				</view>
			</view>
			
			<scroll-view scroll-y class="exam-scroll">
				<view class="exam-item" v-for="exam in filteredExams" :key="exam.id" @click="showExamDetail(exam)">
					<view class="exam-status" :class="exam.status"></view>
					<view class="exam-info">
						<view class="exam-name">{{ exam.courseName }}</view>
						<view class="exam-details">
							<view class="detail-row">
								<text class="detail-icon">📅</text>
								<text class="detail-text">{{ exam.date }} {{ exam.time }}</text>
							</view>
							<view class="detail-row">
								<text class="detail-icon">📍</text>
								<text class="detail-text">{{ exam.location }}</text>
							</view>
							<view class="detail-row">
								<text class="detail-icon">👨‍🏫</text>
								<text class="detail-text">{{ exam.teacher }}</text>
							</view>
						</view>
					</view>
					<view class="exam-type" :class="exam.type">
						{{ exam.type === 'final' ? '期末' : exam.type === 'midterm' ? '期中' : '平时' }}
					</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 考试详情弹窗 -->
		<view class="popup-mask" v-if="showPopup" @click="closeExamDetail">
			<view class="exam-detail" v-if="selectedExam" @click.stop>
				<view class="detail-header">
					<text class="course-title">{{ selectedExam.courseName }}</text>
					<text class="close-btn" @click="closeExamDetail">×</text>
				</view>
				<view class="detail-content">
					<view class="detail-item">
						<text class="label">考试类型：</text>
						<text>{{ selectedExam.type === 'final' ? '期末考试' : selectedExam.type === 'midterm' ? '期中考试' : '平时考试' }}</text>
					</view>
					<view class="detail-item">
						<text class="label">考试时间：</text>
						<text>{{ selectedExam.date }} {{ selectedExam.time }}</text>
					</view>
					<view class="detail-item">
						<text class="label">考试地点：</text>
						<text>{{ selectedExam.location }}</text>
					</view>
					<view class="detail-item">
						<text class="label">座位号：</text>
						<text>{{ selectedExam.seatNumber }}</text>
					</view>
					<view class="detail-item">
						<text class="label">任课教师：</text>
						<text>{{ selectedExam.teacher }}</text>
					</view>
					<view class="detail-item">
						<text class="label">考试时长：</text>
						<text>{{ selectedExam.duration }}</text>
					</view>
					<view class="detail-item">
						<text class="label">考试形式：</text>
						<text>{{ selectedExam.format }}</text>
					</view>
					<view class="detail-item">
						<text class="label">注意事项：</text>
						<text>{{ selectedExam.notes }}</text>
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
			currentSemesterIndex: 0,
			semesterOptions: [],
			filterType: 'all',
			exams: [
				{
					id: 1,
					courseName: '高等数学A',
					date: '2024-01-15',
					time: '09:00-11:00',
					location: '教学楼A101',
					teacher: '张教授',
					type: 'final',
					status: 'upcoming',
					seatNumber: '15',
					duration: '120分钟',
					format: '闭卷笔试',
					notes: '请携带学生证、身份证，禁止携带计算器'
				},
				{
					id: 2,
					courseName: '大学英语',
					date: '2024-01-12',
					time: '14:00-16:00',
					location: '教学楼B203',
					teacher: '李老师',
					type: 'final',
					status: 'completed',
					seatNumber: '23',
					duration: '120分钟',
					format: '闭卷笔试',
					notes: '听力考试需要耳机'
				},
				{
					id: 3,
					courseName: '计算机基础',
					date: '2024-01-18',
					time: '10:00-12:00',
					location: '机房C301',
					teacher: '王老师',
					type: 'final',
					status: 'upcoming',
					seatNumber: '08',
					duration: '120分钟',
					format: '上机考试',
					notes: '请提前15分钟到达考场'
				},
				{
					id: 4,
					courseName: '线性代数',
					date: '2024-01-20',
					time: '09:00-11:00',
					location: '教学楼A102',
					teacher: '孙教授',
					type: 'final',
					status: 'upcoming',
					seatNumber: '31',
					duration: '120分钟',
					format: '闭卷笔试',
					notes: '可携带无编程功能计算器'
				},
				{
					id: 5,
					courseName: '大学物理',
					date: '2023-12-25',
					time: '14:00-15:30',
					location: '教学楼D201',
					teacher: '陈老师',
					type: 'midterm',
					status: 'completed',
					seatNumber: '12',
					duration: '90分钟',
					format: '闭卷笔试',
					notes: '期中考试，占总成绩30%'
				}
			],
			selectedExam: null,
			showPopup: false
		}
	},
	computed: {
		filteredExams() {
			if (this.filterType === 'all') {
				return this.exams;
			} else if (this.filterType === 'upcoming') {
				return this.exams.filter(exam => exam.status === 'upcoming');
			} else {
				return this.exams.filter(exam => exam.status === 'completed');
			}
		},
		totalExams() {
			return this.exams.length;
		},
		upcomingExams() {
			return this.exams.filter(exam => exam.status === 'upcoming').length;
		},
		completedExams() {
			return this.exams.filter(exam => exam.status === 'completed').length;
		}
	},
	onLoad() {
		this.initSemesterData();
	},
	methods: {
		initSemesterData() {
			// 获取学期选项
			const semesterOptions = semesterCalculator.getSemesterOptions();
			this.semesterOptions = semesterOptions.map(option => option.name);

			// 设置当前学期为默认选择
			const currentSemesterIndex = semesterOptions.findIndex(option => option.isCurrent);
			this.currentSemesterIndex = Math.max(0, currentSemesterIndex);

			console.log('当前学期:', this.semesterOptions[this.currentSemesterIndex]);
		},
		onSemesterChange(e) {
			this.currentSemesterIndex = e.detail.value;
		},
		setFilter(type) {
			this.filterType = type;
		},
		showExamDetail(exam) {
			this.selectedExam = exam;
			this.showPopup = true;
		},
		closeExamDetail() {
			this.showPopup = false;
		}
	}
}
</script>

<style scoped>
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.semester-selector {
	background-color: #fff;
	padding: 20rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.picker-text {
	text-align: center;
	font-size: 32rpx;
	color: #007AFF;
	padding: 20rpx;
}

.arrow {
	margin-left: 10rpx;
	font-size: 24rpx;
}

.exam-summary {
	display: flex;
	padding: 20rpx;
	gap: 20rpx;
}

.summary-card {
	flex: 1;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.summary-icon {
	font-size: 48rpx;
	margin-right: 20rpx;
}

.summary-number {
	font-size: 36rpx;
	font-weight: bold;
	color: #007AFF;
	margin-bottom: 8rpx;
}

.summary-label {
	font-size: 24rpx;
	color: #666;
}

.exam-list {
	margin: 20rpx;
	background-color: #fff;
	border-radius: 16rpx;
	overflow: hidden;
}

.list-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.header-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.filter-buttons {
	display: flex;
}

.filter-btn {
	padding: 10rpx 20rpx;
	margin-left: 10rpx;
	font-size: 24rpx;
	color: #666;
	background-color: #f5f5f5;
	border-radius: 20rpx;
}

.filter-btn.active {
	color: #007AFF;
	background-color: #e3f2fd;
}

.exam-scroll {
	height: calc(100vh - 450rpx);
}

.exam-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	position: relative;
}

.exam-status {
	width: 8rpx;
	height: 80rpx;
	border-radius: 4rpx;
	margin-right: 20rpx;
}

.exam-status.upcoming {
	background-color: #ff9800;
}

.exam-status.completed {
	background-color: #4caf50;
}

.exam-info {
	flex: 1;
}

.exam-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 15rpx;
}

.detail-row {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.detail-icon {
	font-size: 24rpx;
	margin-right: 10rpx;
	width: 30rpx;
}

.detail-text {
	font-size: 26rpx;
	color: #666;
}

.exam-type {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: bold;
}

.exam-type.final {
	background-color: #ffebee;
	color: #f44336;
}

.exam-type.midterm {
	background-color: #fff3e0;
	color: #ff9800;
}

.exam-type.regular {
	background-color: #e8f5e8;
	color: #4caf50;
}

.popup-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.exam-detail {
	background-color: #fff;
	border-radius: 20rpx;
	width: 600rpx;
	max-height: 80vh;
	overflow-y: auto;
	padding: 40rpx;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.course-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	font-size: 48rpx;
	color: #999;
	width: 60rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
}

.detail-item {
	display: flex;
	margin-bottom: 20rpx;
	align-items: flex-start;
}

.label {
	width: 160rpx;
	font-size: 28rpx;
	color: #666;
	flex-shrink: 0;
}
</style>
