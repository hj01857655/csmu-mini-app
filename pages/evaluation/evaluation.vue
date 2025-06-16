<template>
	<view class="evaluation-container">
		<!-- 评价统计 -->
		<view class="stats-section">
			<view class="stats-card">
				<view class="stats-grid">
					<view class="stat-item">
						<view class="stat-number">{{ evaluationStats.total }}</view>
						<view class="stat-label">总课程</view>
					</view>
					<view class="stat-item">
						<view class="stat-number completed">{{ evaluationStats.completed }}</view>
						<view class="stat-label">已评价</view>
					</view>
					<view class="stat-item">
						<view class="stat-number pending">{{ evaluationStats.pending }}</view>
						<view class="stat-label">待评价</view>
					</view>
					<view class="stat-item">
						<view class="stat-number progress">{{ evaluationStats.progress }}%</view>
						<view class="stat-label">完成率</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 学期选择 -->
		<view class="semester-section">
			<picker mode="selector" :value="currentSemesterIndex" :range="semesterOptions" @change="onSemesterChange">
				<view class="semester-picker">
					<text class="semester-text">{{ semesterOptions[currentSemesterIndex] }}</text>
					<text class="picker-arrow">▼</text>
				</view>
			</picker>
		</view>
		
		<!-- 评价类型筛选 -->
		<view class="filter-section">
			<scroll-view scroll-x class="filter-scroll">
				<view class="filter-item" 
					  v-for="filter in filterOptions" 
					  :key="filter.key"
					  :class="{ active: selectedFilter === filter.key }"
					  @click="selectFilter(filter.key)">
					{{ filter.name }}
				</view>
			</scroll-view>
		</view>
		
		<!-- 课程评价列表 -->
		<view class="course-list">
			<view class="course-item" v-for="course in filteredCourses" :key="course.id" @click="startEvaluation(course)">
				<view class="course-header">
					<view class="course-info">
						<view class="course-name">{{ course.courseName }}</view>
						<view class="course-teacher">{{ course.teacher }}</view>
					</view>
					<view class="evaluation-status" :class="course.status">
						{{ getStatusText(course.status) }}
					</view>
				</view>
				<view class="course-details">
					<view class="detail-item">
						<text class="detail-label">课程代码：</text>
						<text class="detail-value">{{ course.courseCode }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">学分：</text>
						<text class="detail-value">{{ course.credit }}学分</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">评价类型：</text>
						<text class="detail-value">{{ course.evaluationType }}</text>
					</view>
					<view class="detail-item" v-if="course.status === 'completed'">
						<text class="detail-label">评价时间：</text>
						<text class="detail-value">{{ course.evaluationTime }}</text>
					</view>
					<view class="detail-item" v-if="course.deadline">
						<text class="detail-label">截止时间：</text>
						<text class="detail-value deadline">{{ course.deadline }}</text>
					</view>
				</view>
				<view class="course-actions">
					<button class="action-btn" 
							:class="course.status" 
							@click.stop="handleAction(course)">
						{{ getActionText(course.status) }}
					</button>
				</view>
			</view>
		</view>
		
		<!-- 空状态 -->
		<view class="empty-state" v-if="filteredCourses.length === 0">
			<text class="empty-icon">📝</text>
			<text class="empty-text">暂无相关课程评价</text>
		</view>
		
		<!-- 评价须知弹窗 -->
		<view class="popup-mask" v-if="showNoticePopup" @click="closeNotice">
			<view class="notice-popup" @click.stop>
				<view class="notice-header">
					<text class="notice-title">评价须知</text>
					<text class="close-btn" @click="closeNotice">×</text>
				</view>
				<view class="notice-content">
					<view class="notice-item">
						<text class="notice-number">1.</text>
						<text class="notice-text">请客观公正地评价课程和教师，您的评价将有助于改进教学质量。</text>
					</view>
					<view class="notice-item">
						<text class="notice-number">2.</text>
						<text class="notice-text">评价一旦提交不可修改，请仔细填写后再提交。</text>
					</view>
					<view class="notice-item">
						<text class="notice-number">3.</text>
						<text class="notice-text">请在规定时间内完成评价，逾期将无法提交。</text>
					</view>
					<view class="notice-item">
						<text class="notice-number">4.</text>
						<text class="notice-text">评价内容将严格保密，不会向教师透露评价者身份。</text>
					</view>
				</view>
				<view class="notice-actions">
					<button class="notice-btn confirm" @click="confirmNotice">我已了解</button>
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
			selectedFilter: 'all',
			showNoticePopup: false,
			pendingCourse: null,
			filterOptions: [
				{ key: 'all', name: '全部' },
				{ key: 'pending', name: '待评价' },
				{ key: 'completed', name: '已评价' },
				{ key: 'midterm', name: '期中评价' },
				{ key: 'final', name: '期末评价' }
			],
			evaluationStats: {
				total: 8,
				completed: 5,
				pending: 3,
				progress: 63
			},
			courses: [
				{
					id: 1,
					courseName: '高等数学A',
					teacher: '张教授',
					courseCode: 'MATH001',
					credit: 4,
					evaluationType: '期末评价',
					status: 'pending',
					deadline: '2024-01-25 23:59',
					semester: '2023-2024-1'
				},
				{
					id: 2,
					courseName: '大学英语',
					teacher: '李老师',
					courseCode: 'ENG001',
					credit: 3,
					evaluationType: '期末评价',
					status: 'completed',
					evaluationTime: '2024-01-15 14:30',
					semester: '2023-2024-1'
				},
				{
					id: 3,
					courseName: '计算机程序设计',
					teacher: '王教授',
					courseCode: 'CS001',
					credit: 4,
					evaluationType: '期末评价',
					status: 'pending',
					deadline: '2024-01-25 23:59',
					semester: '2023-2024-1'
				},
				{
					id: 4,
					courseName: '线性代数',
					teacher: '赵老师',
					courseCode: 'MATH002',
					credit: 3,
					evaluationType: '期中评价',
					status: 'completed',
					evaluationTime: '2023-11-20 16:45',
					semester: '2023-2024-1'
				},
				{
					id: 5,
					courseName: '大学物理',
					teacher: '陈教授',
					courseCode: 'PHY001',
					credit: 4,
					evaluationType: '期末评价',
					status: 'pending',
					deadline: '2024-01-25 23:59',
					semester: '2023-2024-1'
				}
			]
		}
	},
	computed: {
		filteredCourses() {
			let filtered = this.courses;
			
			// 按学期筛选
			const currentSemester = this.semesterOptions[this.currentSemesterIndex];
			if (currentSemester) {
				filtered = filtered.filter(course => course.semester === currentSemester.split('学年')[0] + '-' + (currentSemester.includes('第一学期') ? '1' : '2'));
			}
			
			// 按状态筛选
			if (this.selectedFilter !== 'all') {
				if (this.selectedFilter === 'midterm') {
					filtered = filtered.filter(course => course.evaluationType === '期中评价');
				} else if (this.selectedFilter === 'final') {
					filtered = filtered.filter(course => course.evaluationType === '期末评价');
				} else {
					filtered = filtered.filter(course => course.status === this.selectedFilter);
				}
			}
			
			return filtered;
		}
	},
	onLoad() {
		this.initSemesterData();
		this.updateStats();
	},
	methods: {
		initSemesterData() {
			const semesterOptions = semesterCalculator.getSemesterOptions();
			this.semesterOptions = semesterOptions.map(option => option.name);
			
			const currentSemesterIndex = semesterOptions.findIndex(option => option.isCurrent);
			this.currentSemesterIndex = Math.max(0, currentSemesterIndex);
		},
		onSemesterChange(e) {
			this.currentSemesterIndex = e.detail.value;
			this.updateStats();
		},
		selectFilter(filter) {
			this.selectedFilter = filter;
		},
		updateStats() {
			const currentCourses = this.filteredCourses;
			const completed = currentCourses.filter(course => course.status === 'completed').length;
			const pending = currentCourses.filter(course => course.status === 'pending').length;
			const total = currentCourses.length;
			
			this.evaluationStats = {
				total,
				completed,
				pending,
				progress: total > 0 ? Math.round((completed / total) * 100) : 0
			};
		},
		getStatusText(status) {
			const statusMap = {
				'pending': '待评价',
				'completed': '已评价',
				'expired': '已过期'
			};
			return statusMap[status] || status;
		},
		getActionText(status) {
			const actionMap = {
				'pending': '开始评价',
				'completed': '查看评价',
				'expired': '已过期'
			};
			return actionMap[status] || '评价';
		},
		handleAction(course) {
			if (course.status === 'pending') {
				this.startEvaluation(course);
			} else if (course.status === 'completed') {
				this.viewEvaluation(course);
			}
		},
		startEvaluation(course) {
			if (course.status !== 'pending') return;
			
			this.pendingCourse = course;
			this.showNoticePopup = true;
		},
		viewEvaluation(course) {
			uni.navigateTo({
				url: `/pages/evaluation-detail/evaluation-detail?courseId=${course.id}&mode=view`
			});
		},
		closeNotice() {
			this.showNoticePopup = false;
			this.pendingCourse = null;
		},
		confirmNotice() {
			if (this.pendingCourse) {
				uni.navigateTo({
					url: `/pages/evaluation-form/evaluation-form?courseId=${this.pendingCourse.id}`
				});
			}
			this.closeNotice();
		}
	}
}
</script>

<style scoped>
.evaluation-container {
	background-color: #f5f7fa;
	min-height: 100vh;
}

.stats-section {
	padding: 20rpx;
}

.stats-card {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 20rpx;
}

.stat-item {
	text-align: center;
}

.stat-number {
	font-size: 36rpx;
	font-weight: bold;
	color: #1976D2;
	margin-bottom: 8rpx;
}

.stat-number.completed {
	color: #4CAF50;
}

.stat-number.pending {
	color: #FF9800;
}

.stat-number.progress {
	color: #9C27B0;
}

.stat-label {
	font-size: 24rpx;
	color: #666;
}

.semester-section {
	padding: 0 20rpx 20rpx;
}

.semester-picker {
	background-color: white;
	border-radius: 12rpx;
	padding: 25rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.semester-text {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.picker-arrow {
	font-size: 24rpx;
	color: #999;
}

.filter-section {
	padding: 0 20rpx 20rpx;
}

.filter-scroll {
	white-space: nowrap;
}

.filter-item {
	display: inline-block;
	padding: 15rpx 25rpx;
	margin-right: 15rpx;
	font-size: 26rpx;
	color: #666;
	background-color: white;
	border-radius: 20rpx;
	border: 1rpx solid #e5e5e5;
}

.filter-item.active {
	color: #1976D2;
	background-color: #E3F2FD;
	border-color: #1976D2;
}

.course-list {
	padding: 0 20rpx;
}

.course-item {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.course-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.course-name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.course-teacher {
	font-size: 26rpx;
	color: #666;
}

.evaluation-status {
	padding: 8rpx 16rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	font-weight: bold;
}

.evaluation-status.pending {
	background-color: #FFF3E0;
	color: #FF9800;
}

.evaluation-status.completed {
	background-color: #E8F5E8;
	color: #4CAF50;
}

.evaluation-status.expired {
	background-color: #FFEBEE;
	color: #F44336;
}

.course-details {
	margin-bottom: 20rpx;
}

.detail-item {
	display: flex;
	margin-bottom: 8rpx;
}

.detail-label {
	width: 160rpx;
	font-size: 24rpx;
	color: #666;
}

.detail-value {
	font-size: 24rpx;
	color: #333;
	flex: 1;
}

.detail-value.deadline {
	color: #FF9800;
	font-weight: bold;
}

.course-actions {
	text-align: right;
}

.action-btn {
	padding: 15rpx 30rpx;
	border-radius: 8rpx;
	font-size: 26rpx;
	border: none;
}

.action-btn.pending {
	background-color: #1976D2;
	color: white;
}

.action-btn.completed {
	background-color: #4CAF50;
	color: white;
}

.action-btn.expired {
	background-color: #CCCCCC;
	color: #666;
}

.empty-state {
	text-align: center;
	padding: 100rpx 30rpx;
	color: #999;
}

.empty-icon {
	font-size: 80rpx;
	display: block;
	margin-bottom: 30rpx;
}

.empty-text {
	font-size: 28rpx;
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

.notice-popup {
	background-color: white;
	border-radius: 20rpx;
	width: 85%;
	max-height: 70vh;
	overflow-y: auto;
}

.notice-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 30rpx 20rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.notice-title {
	font-size: 32rpx;
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

.notice-content {
	padding: 30rpx;
}

.notice-item {
	display: flex;
	margin-bottom: 20rpx;
	line-height: 1.6;
}

.notice-number {
	font-size: 26rpx;
	color: #1976D2;
	font-weight: bold;
	width: 40rpx;
}

.notice-text {
	font-size: 26rpx;
	color: #333;
	flex: 1;
}

.notice-actions {
	padding: 20rpx 30rpx 30rpx;
	text-align: center;
}

.notice-btn {
	width: 200rpx;
	height: 70rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	border: none;
}

.notice-btn.confirm {
	background-color: #1976D2;
	color: white;
}
</style>
