<template>
	<view class="container">
		<!-- 学期选择器 - 使用统一设计系统 -->
		<view class="container-base container-compact">
			<view class="accent-line"></view>
			<picker mode="selector" :value="currentSemesterIndex" :range="semesterOptions" @change="onSemesterChange">
				<view class="picker-base semester-picker">
					<view class="picker-content picker-content-compact">
						<view class="picker-left">
							<text class="picker-label">📊</text>
							<text class="picker-text">{{ semesterOptions[currentSemesterIndex] || '选择学期' }}</text>
						</view>
						<view class="picker-right">
							<view class="picker-indicator">
								<text class="picker-arrow">▼</text>
							</view>
						</view>
					</view>
					<view class="bottom-accent-line"></view>
				</view>
			</picker>
		</view>

		<!-- 成绩统计 -->
		<view class="grade-summary">
			<view class="summary-item">
				<view class="summary-value">{{ totalCredits }}</view>
				<view class="summary-label">总学分</view>
			</view>
			<view class="summary-item">
				<view class="summary-value">{{ gpa }}</view>
				<view class="summary-label">平均绩点</view>
			</view>
			<view class="summary-item">
				<view class="summary-value">{{ passedCourses }}/{{ totalCourses }}</view>
				<view class="summary-label">通过课程</view>
			</view>
		</view>

		<!-- 成绩列表 -->
		<view class="grade-list">
			<view class="list-header">
				<text class="header-title">课程成绩</text>
				<view class="filter-buttons">
					<text class="filter-btn" :class="{ active: filterType === 'all' }" @click="setFilter('all')">全部</text>
					<text class="filter-btn" :class="{ active: filterType === 'passed' }" @click="setFilter('passed')">已通过</text>
					<text class="filter-btn" :class="{ active: filterType === 'failed' }" @click="setFilter('failed')">未通过</text>
				</view>
			</view>

			<scroll-view scroll-y class="grade-scroll">
				<view class="grade-item" v-for="course in filteredGrades" :key="course.id" @click="showGradeDetail(course)">
					<view class="course-info">
						<view class="course-name">{{ course.name }}</view>
						<view class="course-details">
							<text class="course-code">{{ course.code }}</text>
							<text class="course-credit">{{ course.credit }}学分</text>
							<text class="course-type">{{ course.type }}</text>
						</view>
						<view class="teacher-info">任课教师：{{ course.teacher }}</view>
					</view>
					<view class="grade-info">
						<view class="grade-score" :class="getGradeClass(course.score)">
							{{ course.score }}
						</view>
						<view class="grade-point">{{ course.gradePoint }}</view>
						<view class="grade-status" :class="course.status">
							{{ course.status === 'passed' ? '通过' : '未通过' }}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 成绩详情弹窗 -->
		<view class="popup-mask" v-if="showPopup" @click="closeGradeDetail">
			<view class="grade-detail" v-if="selectedGrade" @click.stop>
				<view class="detail-header">
					<text class="course-title">{{ selectedGrade.name }}</text>
					<text class="close-btn" @click="closeGradeDetail">×</text>
				</view>
				<view class="detail-content">
					<view class="detail-item">
						<text class="label">课程代码：</text>
						<text>{{ selectedGrade.code }}</text>
					</view>
					<view class="detail-item">
						<text class="label">学分：</text>
						<text>{{ selectedGrade.credit }}</text>
					</view>
					<view class="detail-item">
						<text class="label">课程性质：</text>
						<text>{{ selectedGrade.type }}</text>
					</view>
					<view class="detail-item">
						<text class="label">任课教师：</text>
						<text>{{ selectedGrade.teacher }}</text>
					</view>
					<view class="detail-item">
						<text class="label">考试时间：</text>
						<text>{{ selectedGrade.examDate }}</text>
					</view>
					<view class="detail-item">
						<text class="label">成绩：</text>
						<text class="grade-value" :class="getGradeClass(selectedGrade.score)">{{ selectedGrade.score }}</text>
					</view>
					<view class="detail-item">
						<text class="label">绩点：</text>
						<text>{{ selectedGrade.gradePoint }}</text>
					</view>
					<view class="detail-item">
						<text class="label">排名：</text>
						<text>{{ selectedGrade.rank }}/{{ selectedGrade.totalStudents }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import semesterCalculator from '../../utils/semester.js';
import educationApi from '../../services/education-api.js';

export default {
	data() {
		return {
			currentSemesterIndex: 0,
			semesterOptions: [],
			filterType: 'all',
			grades: [
				{
					id: 1,
					name: '高等数学A',
					code: 'MATH001',
					credit: 4,
					type: '必修',
					teacher: '张教授',
					score: 92,
					gradePoint: 4.2,
					status: 'passed',
					examDate: '2024-01-15',
					rank: 5,
					totalStudents: 120
				},
				{
					id: 2,
					name: '大学英语',
					code: 'ENG001',
					credit: 3,
					type: '必修',
					teacher: '李老师',
					score: 85,
					gradePoint: 3.5,
					status: 'passed',
					examDate: '2024-01-12',
					rank: 15,
					totalStudents: 120
				},
				{
					id: 3,
					name: '计算机基础',
					code: 'CS001',
					credit: 3,
					type: '必修',
					teacher: '王老师',
					score: 78,
					gradePoint: 2.8,
					status: 'passed',
					examDate: '2024-01-18',
					rank: 35,
					totalStudents: 120
				},
				{
					id: 4,
					name: '线性代数',
					code: 'MATH002',
					credit: 3,
					type: '必修',
					teacher: '孙教授',
					score: 88,
					gradePoint: 3.8,
					status: 'passed',
					examDate: '2024-01-20',
					rank: 12,
					totalStudents: 120
				},
				{
					id: 5,
					name: '大学物理',
					code: 'PHY001',
					credit: 4,
					type: '必修',
					teacher: '陈老师',
					score: 58,
					gradePoint: 0,
					status: 'failed',
					examDate: '2024-01-22',
					rank: 95,
					totalStudents: 120
				}
			],
			selectedGrade: null,
			showPopup: false
		}
	},
	computed: {
		filteredGrades() {
			if (this.filterType === 'all') {
				return this.grades;
			} else if (this.filterType === 'passed') {
				return this.grades.filter(grade => grade.status === 'passed');
			} else {
				return this.grades.filter(grade => grade.status === 'failed');
			}
		},
		totalCredits() {
			return this.grades.filter(grade => grade.status === 'passed')
						   .reduce((sum, grade) => sum + grade.credit, 0);
		},
		gpa() {
			const passedGrades = this.grades.filter(grade => grade.status === 'passed');
			if (passedGrades.length === 0) return '0.00';

			const totalPoints = passedGrades.reduce((sum, grade) => sum + (grade.gradePoint * grade.credit), 0);
			const totalCredits = passedGrades.reduce((sum, grade) => sum + grade.credit, 0);

			return (totalPoints / totalCredits).toFixed(2);
		},
		passedCourses() {
			return this.grades.filter(grade => grade.status === 'passed').length;
		},
		totalCourses() {
			return this.grades.length;
		}
	},
	onLoad() {
		this.initSemesterData();
		this.loadGradesData();
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
			this.loadGradesData();
		},

		async loadGradesData() {
			try {
				const semester = this.semesterOptions[this.currentSemesterIndex];
				const response = await educationApi.getGradesList(semester);

				if (response.success && response.data.grades) {
					// 更新成绩数据
					this.grades = response.data.grades.map(grade => ({
						...grade,
						status: grade.score >= 60 ? 'passed' : 'failed'
					}));
					console.log('成绩数据加载成功');
				} else {
					console.warn('成绩数据为空，使用默认数据');
					// 保持使用默认的模拟数据
				}
			} catch (error) {
				console.error('加载成绩数据失败:', error);
				// 静默失败，使用模拟数据
			}
		},
		setFilter(type) {
			this.filterType = type;
		},
		getGradeClass(score) {
			if (score >= 90) return 'excellent';
			if (score >= 80) return 'good';
			if (score >= 70) return 'average';
			if (score >= 60) return 'pass';
			return 'fail';
		},
		showGradeDetail(grade) {
			this.selectedGrade = grade;
			this.showPopup = true;
		},
		closeGradeDetail() {
			this.showPopup = false;
		}
	}
}
</script>

<style scoped>
.container {
	background-color: var(--background-tertiary);
	min-height: 100vh;
}

.semester-picker {
	margin-bottom: var(--spacing-md);
}

.grade-summary {
	display: flex;
	background-color: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.summary-item {
	flex: 1;
	text-align: center;
}

.summary-value {
	font-size: 48rpx;
	font-weight: bold;
	color: #007AFF;
	margin-bottom: 10rpx;
}

.summary-label {
	font-size: 28rpx;
	color: #666;
}

.grade-list {
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

.grade-scroll {
	height: calc(100vh - 500rpx);
}

.grade-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.course-info {
	flex: 1;
}

.course-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 10rpx;
}

.course-details {
	display: flex;
	margin-bottom: 8rpx;
}

.course-code, .course-credit, .course-type {
	font-size: 24rpx;
	color: #666;
	margin-right: 20rpx;
}

.teacher-info {
	font-size: 24rpx;
	color: #999;
}

.grade-info {
	text-align: center;
	min-width: 120rpx;
}

.grade-score {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 5rpx;
}

.grade-score.excellent { color: #4caf50; }
.grade-score.good { color: #2196f3; }
.grade-score.average { color: #ff9800; }
.grade-score.pass { color: #9c27b0; }
.grade-score.fail { color: #f44336; }

.grade-point {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 5rpx;
}

.grade-status {
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
}

.grade-status.passed {
	color: #4caf50;
	background-color: #e8f5e8;
}

.grade-status.failed {
	color: #f44336;
	background-color: #ffebee;
}

.grade-detail {
	background-color: #fff;
	border-radius: 20rpx;
	width: 600rpx;
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
	align-items: center;
}

.label {
	width: 160rpx;
	font-size: 28rpx;
	color: #666;
}

.grade-value {
	font-size: 32rpx;
	font-weight: bold;
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
</style>
