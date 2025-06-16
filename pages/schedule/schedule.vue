<template>
	<view class="container">
		<!-- 周次选择器 -->
		<view class="week-selector">
			<view class="week-navigation">
				<button class="week-btn prev-btn" @click="prevWeek" :disabled="currentWeekIndex <= 0">
					<text class="btn-icon">‹</text>
				</button>
				<picker mode="selector" :value="currentWeekIndex" :range="weekOptions" @change="onWeekChange">
					<view class="picker-text">
						{{ weekOptions[currentWeekIndex] }}
						<text class="arrow">▼</text>
					</view>
				</picker>
				<button class="week-btn next-btn" @click="nextWeek" :disabled="currentWeekIndex >= weekOptions.length - 1">
					<text class="btn-icon">›</text>
				</button>
			</view>
		</view>

		<!-- 课程表头部 -->
		<view class="schedule-header">
			<view class="time-column">时间</view>
			<view class="day-column"
				  v-for="day in weekDays"
				  :key="day.key"
				  :class="{ 'today-column': isCurrentWeek && day.key === todayDayKey }">
				<view class="day-name">
					{{ day.name }}
					<text class="today-badge" v-if="isCurrentWeek && day.key === todayDayKey">今天</text>
				</view>
				<view class="day-date">{{ day.date }}</view>
			</view>
		</view>

		<!-- 课程表内容 -->
		<scroll-view scroll-y class="schedule-content">
			<view class="schedule-row" v-for="(time, index) in timeSlots" :key="index">
				<view class="time-cell">
					<view class="period">{{ time.period }}</view>
					<view class="time-range">{{ time.time }}</view>
				</view>
				<view class="course-cell"
					  v-for="day in weekDays"
					  :key="day.key"
					  :class="{ 'today-cell': isCurrentWeek && day.key === todayDayKey }">
					<view v-if="getCourse(day.key, index)"
						  class="course-item"
						  :class="[
							  getCourse(day.key, index).type,
							  { 'today-course': isCurrentWeek && day.key === todayDayKey }
						  ]"
						  @click="showCourseDetail(getCourse(day.key, index))">
						<view class="course-name">{{ getCourse(day.key, index).name }}</view>
						<view class="course-location">{{ getCourse(day.key, index).location }}</view>
						<view class="course-teacher">{{ getCourse(day.key, index).teacher }}</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 课程详情弹窗 -->
		<view class="popup-mask" v-if="showPopup" @click="closeCourseDetail">
			<view class="course-detail" v-if="selectedCourse" @click.stop>
				<view class="detail-header">
					<text class="course-title">{{ selectedCourse.name }}</text>
					<text class="close-btn" @click="closeCourseDetail">×</text>
				</view>
				<view class="detail-content">
					<view class="detail-item">
						<text class="label">👨‍🏫 教师：</text>
						<text>{{ selectedCourse.teacher }}</text>
					</view>
					<view class="detail-item">
						<text class="label">📍 地点：</text>
						<text>{{ selectedCourse.location }}</text>
					</view>
					<view class="detail-item">
						<text class="label">⏰ 时间：</text>
						<text>{{ selectedCourse.timeText }}</text>
					</view>
					<view class="detail-item">
						<text class="label">⭐ 学分：</text>
						<text>{{ selectedCourse.credit }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import semesterCalculator from '../../utils/semester.js';
import courseTimeManager from '../../utils/course-time.js';
import educationApi from '../../services/education-api.js';
import dateFormatter from '../../utils/date-formatter.js';

export default {
	data() {
		return {
			currentWeekIndex: 0,
			currentSemester: null,
			weekOptions: [],
			weekDays: [],
			timeSlots: [
				{ period: '第1-2节', time: '08:00-09:50' },
				{ period: '第3-4节', time: '10:10-12:00' },
				{ period: '第5-6节', time: '14:00-15:50' },
				{ period: '第7-8节', time: '16:10-18:00' },
				{ period: '第9-10节', time: '19:00-20:50' }
			],
			courses: {
				mon: [
					{ name: '高等数学', teacher: '张教授', location: '教学楼A101', type: 'math', credit: '4', timeText: '周一 1-2节' },
					null,
					{ name: '大学英语', teacher: '李老师', location: '教学楼B203', type: 'english', credit: '3', timeText: '周一 5-6节' },
					null,
					null
				],
				tue: [
					null,
					{ name: '计算机基础', teacher: '王老师', location: '机房C301', type: 'computer', credit: '3', timeText: '周二 3-4节' },
					null,
					{ name: '体育', teacher: '刘教练', location: '体育馆', type: 'sports', credit: '1', timeText: '周二 7-8节' },
					null
				],
				wed: [
					{ name: '高等数学', teacher: '张教授', location: '教学楼A101', type: 'math', credit: '4', timeText: '周三 1-2节' },
					null,
					{ name: '物理实验', teacher: '陈老师', location: '实验楼D201', type: 'physics', credit: '2', timeText: '周三 5-6节' },
					null,
					null
				],
				thu: [
					null,
					{ name: '大学英语', teacher: '李老师', location: '教学楼B203', type: 'english', credit: '3', timeText: '周四 3-4节' },
					null,
					null,
					{ name: '选修课', teacher: '赵老师', location: '教学楼E105', type: 'elective', credit: '2', timeText: '周四 9-10节' }
				],
				fri: [
					{ name: '线性代数', teacher: '孙教授', location: '教学楼A102', type: 'math', credit: '3', timeText: '周五 1-2节' },
					null,
					null,
					{ name: '计算机基础', teacher: '王老师', location: '机房C301', type: 'computer', credit: '3', timeText: '周五 7-8节' },
					null
				],
				sat: [null, null, null, null, null],
				sun: [null, null, null, null, null]
			},
			selectedCourse: null,
			showPopup: false
		}
	},
	computed: {
		// 获取今天是星期几
		todayDayKey() {
			const today = new Date();
			const dayOfWeek = today.getDay(); // 0=周日, 1=周一, ..., 6=周六
			const dayMap = {
				0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed',
				4: 'thu', 5: 'fri', 6: 'sat'
			};
			return dayMap[dayOfWeek];
		},
		// 判断当前显示的周是否为本周
		isCurrentWeek() {
			const currentWeekInfo = semesterCalculator.getCurrentWeekCached();
			return this.currentWeekIndex + 1 === currentWeekInfo.week;
		}
	},
	onLoad() {
		this.checkLoginStatus();
		this.initSemesterData();
		this.loadScheduleData();
	},
	onShow() {
		// 页面显示时检查是否需要更新周次信息
		this.checkAndUpdateWeekInfo();
	},
	methods: {
		checkLoginStatus() {
			const isLoggedIn = uni.getStorageSync('isLoggedIn');
			if (!isLoggedIn) {
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		},
		initSemesterData() {
			// 获取当前学期信息
			this.currentSemester = semesterCalculator.getCurrentSemester();

			// 获取当前周次（使用缓存版本）
			const currentWeekInfo = semesterCalculator.getCurrentWeekCached();

			// 生成周次选项
			this.weekOptions = semesterCalculator.getWeekOptions(this.currentSemester).map(option => option.label);

			// 设置当前周次索引
			this.currentWeekIndex = Math.max(0, currentWeekInfo.week - 1);

			// 更新周日期显示
			this.updateWeekDays();

			// 显示当前学期和周次信息

			// 如果不在学期时间内，显示提示
			if (!currentWeekInfo.isValid) {
				uni.showToast({
					title: currentWeekInfo.message,
					icon: 'none',
					duration: 3000
				});
			}
		},

		checkAndUpdateWeekInfo() {
			// 检查是否需要更新周次信息
			const currentWeekInfo = semesterCalculator.getCurrentWeekCached();
			const newWeekIndex = Math.max(0, currentWeekInfo.week - 1);

			// 如果周次发生变化，更新显示
			if (newWeekIndex !== this.currentWeekIndex) {
				this.currentWeekIndex = newWeekIndex;
				this.updateWeekDays();
				this.loadScheduleData();

				// 显示更新提示
				uni.showToast({
					title: `已更新到${currentWeekInfo.message}`,
					icon: 'success',
					duration: 2000
				});
			}
		},
		updateWeekDays() {
			// 根据当前选择的周次更新日期显示
			const week = this.currentWeekIndex + 1;
			this.weekDays = semesterCalculator.getWeekDays(week, this.currentSemester);
		},
		async onWeekChange(e) {
			this.currentWeekIndex = e.detail.value;
			this.updateWeekDays();
			await this.loadScheduleData();
		},
		async prevWeek() {
			if (this.currentWeekIndex > 0) {
				this.currentWeekIndex--;
				this.updateWeekDays();
				await this.loadScheduleData();
			}
		},
		async nextWeek() {
			if (this.currentWeekIndex < this.weekOptions.length - 1) {
				this.currentWeekIndex++;
				this.updateWeekDays();
				await this.loadScheduleData();
			}
		},
		async loadScheduleData() {
			try {
				// 使用新的教务API服务
				const week = this.currentWeekIndex + 1;
				const response = await educationApi.getCurrentSchedule(week);

				if (response.success && response.data.courses) {
					this.courses = this.formatScheduleData(response.data.courses);
				} else {
					// 保持使用默认的模拟数据
				}
			} catch (error) {
				// 不显示错误提示，静默失败并使用模拟数据
				// 这样可以确保在API不可用时仍能正常显示课程表
			}
		},
		formatScheduleData(coursesData) {
			// 将后端返回的课程数据格式化为前端需要的格式
			const formattedCourses = {
				mon: [null, null, null, null, null],
				tue: [null, null, null, null, null],
				wed: [null, null, null, null, null],
				thu: [null, null, null, null, null],
				fri: [null, null, null, null, null],
				sat: [null, null, null, null, null],
				sun: [null, null, null, null, null]
			};

			coursesData.forEach(course => {
				const dayKey = this.getDayKey(course.dayOfWeek);
				const timeIndex = this.getTimeIndex(course.timeSlot);

				if (dayKey && timeIndex !== -1) {
					formattedCourses[dayKey][timeIndex] = {
						name: course.courseName,
						teacher: course.teacher,
						location: course.location,
						type: course.courseType || 'default',
						credit: course.credit,
						timeText: course.timeText
					};
				}
			});

			return formattedCourses;
		},
		getDayKey(dayOfWeek) {
			const dayMap = {
				1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu',
				5: 'fri', 6: 'sat', 7: 'sun'
			};
			return dayMap[dayOfWeek];
		},
		getTimeIndex(timeSlot) {
			// 根据时间段返回对应的索引
			const timeMap = {
				'1-2': 0, '3-4': 1, '5-6': 2, '7-8': 3, '9-10': 4
			};
			return timeMap[timeSlot] !== undefined ? timeMap[timeSlot] : -1;
		},
		getCourse(day, timeIndex) {
			return this.courses[day] && this.courses[day][timeIndex];
		},
		showCourseDetail(course) {
			this.selectedCourse = course;
			this.showPopup = true;
		},
		closeCourseDetail() {
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

.week-selector {
	background-color: #fff;
	padding: 20rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.week-navigation {
	display: flex;
	align-items: center;
	justify-content: center;
}

.week-btn {
	width: 80rpx;
	height: 60rpx;
	border: 1rpx solid #1976D2;
	background-color: #fff;
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 20rpx;
}

.week-btn:disabled {
	border-color: #ccc;
	background-color: #f5f5f5;
}

.week-btn:disabled .btn-icon {
	color: #ccc;
}

.btn-icon {
	font-size: 32rpx;
	color: #1976D2;
	font-weight: bold;
}

.picker-text {
	text-align: center;
	font-size: 32rpx;
	color: #1976D2;
	padding: 20rpx 40rpx;
	border: 1rpx solid #1976D2;
	border-radius: 8rpx;
	background-color: #E3F2FD;
	min-width: 400rpx;
}

.arrow {
	margin-left: 10rpx;
	font-size: 24rpx;
}

.schedule-header {
	display: flex;
	background-color: #fff;
	border-bottom: 2rpx solid #e5e5e5;
}

.time-column {
	width: 120rpx;
	padding: 20rpx 10rpx;
	text-align: center;
	font-size: 28rpx;
	font-weight: bold;
	background-color: #f8f8f8;
}

.day-column {
	flex: 1;
	padding: 15rpx 5rpx;
	text-align: center;
	border-left: 1rpx solid #e5e5e5;
	position: relative;
}

/* 今天的列头样式 - 更温和的视觉效果 */
.today-column {
	background-color: #F3F8FF;
	border-left: 2rpx solid #1976D2;
	border-right: 2rpx solid #1976D2;
	position: relative;
}

/* 添加微妙的渐变效果 */
.today-column::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(180deg, rgba(25, 118, 210, 0.05) 0%, transparent 100%);
	pointer-events: none;
}

.day-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	position: relative;
}

/* 今天标识 */
.today-badge {
	background-color: #1976D2;
	color: white;
	font-size: 18rpx;
	padding: 2rpx 8rpx;
	border-radius: 10rpx;
	margin-left: 8rpx;
	font-weight: normal;
}

.day-date {
	font-size: 24rpx;
	color: #666;
	margin-top: 5rpx;
}

.schedule-content {
	height: calc(100vh - 300rpx);
}

.schedule-row {
	display: flex;
	background-color: #fff;
	border-bottom: 1rpx solid #e5e5e5;
	min-height: 120rpx;
}

.time-cell {
	width: 120rpx;
	padding: 15rpx 10rpx;
	text-align: center;
	background-color: #f8f8f8;
	border-right: 1rpx solid #e5e5e5;
}

.period {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.time-range {
	font-size: 22rpx;
	color: #666;
	margin-top: 5rpx;
}

.course-cell {
	flex: 1;
	padding: 10rpx 5rpx;
	border-left: 1rpx solid #e5e5e5;
	min-height: 100rpx;
	position: relative;
}

/* 今天的课程单元格 - 更温和的视觉效果 */
.today-cell {
	background-color: #FAFCFF;
	border-left: 2rpx solid #1976D2;
	border-right: 2rpx solid #1976D2;
	position: relative;
}

/* 添加微妙的渐变背景 */
.today-cell::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(180deg, rgba(25, 118, 210, 0.02) 0%, transparent 100%);
	pointer-events: none;
}

.course-item {
	background-color: #e3f2fd;
	border-radius: 8rpx;
	padding: 15rpx 10rpx;
	height: 100%;
	border-left: 6rpx solid #2196f3;
	position: relative;
	transition: all 0.3s ease;
}

/* 今天的课程特殊样式 - 优化性能的视觉效果 */
.course-item.today-course {
	background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
	color: white;
	border-left: 8rpx solid #0D47A1;
	box-shadow:
		0 6rpx 20rpx rgba(25, 118, 210, 0.4),
		0 0 0 2rpx rgba(25, 118, 210, 0.2),
		inset 0 1rpx 0 rgba(255, 255, 255, 0.2);
	transform: translateY(-2rpx);
	position: relative;
	overflow: hidden;
	/* 优化动画性能：使用will-change提示浏览器优化 */
	will-change: box-shadow;
	/* 减少动画频率，从3s改为4s，减少性能消耗 */
	animation: todayPulse 4s ease-in-out infinite;
}

/* 优化的呼吸动画 - 减少复杂度 */
@keyframes todayPulse {
	0%, 100% {
		box-shadow:
			0 6rpx 20rpx rgba(25, 118, 210, 0.4),
			0 0 0 2rpx rgba(25, 118, 210, 0.2);
	}
	50% {
		box-shadow:
			0 8rpx 25rpx rgba(25, 118, 210, 0.5),
			0 0 0 3rpx rgba(25, 118, 210, 0.3);
	}
}

/* 低性能设备的降级方案 */
@media (prefers-reduced-motion: reduce) {
	.course-item.today-course {
		animation: none;
		/* 静态的强调效果 */
		box-shadow:
			0 8rpx 25rpx rgba(25, 118, 210, 0.5),
			0 0 0 3rpx rgba(25, 118, 210, 0.3);
	}
}

/* 优化的发光边框效果 */
.course-item.today-course::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
	/* 减少动画频率，从2s改为3s */
	animation: shimmer 3s ease-in-out infinite;
	pointer-events: none;
	/* 优化性能 */
	will-change: transform;
}

@keyframes shimmer {
	0% {
		transform: translateX(-100%);
	}
	100% {
		transform: translateX(100%);
	}
}

/* 低性能设备禁用闪烁效果 */
@media (prefers-reduced-motion: reduce) {
	.course-item.today-course::before {
		animation: none;
		opacity: 0;
	}
}

.course-item.today-course .course-name,
.course-item.today-course .course-location,
.course-item.today-course .course-teacher {
	color: white;
	position: relative;
	z-index: 2;
}

.course-item.today-course .course-name {
	font-weight: bold;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

.course-item.math {
	background-color: #fff3e0;
	border-left-color: #ff9800;
}

.course-item.english {
	background-color: #e8f5e8;
	border-left-color: #4caf50;
}

.course-item.computer {
	background-color: #f3e5f5;
	border-left-color: #9c27b0;
}

.course-item.physics {
	background-color: #fce4ec;
	border-left-color: #e91e63;
}

.course-item.sports {
	background-color: #e0f2f1;
	border-left-color: #009688;
}

.course-item.elective {
	background-color: #f1f8e9;
	border-left-color: #8bc34a;
}

.course-name {
	font-size: 24rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 5rpx;
}

.course-location {
	font-size: 20rpx;
	color: #666;
	margin-bottom: 3rpx;
}

.course-teacher {
	font-size: 20rpx;
	color: #999;
}



/* 课程详情弹窗主体 - 全面美化 */
.course-detail {
	background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
	border-radius: 24rpx;
	width: 640rpx;
	max-width: 90vw;
	padding: 0;
	box-shadow:
		0 20rpx 60rpx rgba(0, 0, 0, 0.15),
		0 8rpx 20rpx rgba(0, 0, 0, 0.1),
		0 0 0 1rpx rgba(255, 255, 255, 0.8);
	animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
	overflow: hidden;
	position: relative;
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(60rpx) scale(0.9);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

/* 弹窗装饰性背景 */
.course-detail::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 8rpx;
	background: linear-gradient(90deg, #1976D2, #42A5F5, #64B5F6, #42A5F5, #1976D2);
	background-size: 200% 100%;
	animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
	0%, 100% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
}

/* 弹窗头部 - 优化设计 */
.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 40rpx 40rpx 30rpx;
	margin-bottom: 0;
	background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
	border-bottom: 2rpx solid #f0f0f0;
	position: relative;
}

.detail-header::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 40rpx;
	right: 40rpx;
	height: 1rpx;
	background: linear-gradient(90deg, transparent, #1976D2, transparent);
}

/* 课程标题 - 增强视觉效果 */
.course-title {
	font-size: 38rpx;
	font-weight: 700;
	color: #1976D2;
	text-shadow: 0 1rpx 2rpx rgba(25, 118, 210, 0.1);
	letter-spacing: 1rpx;
	flex: 1;
	margin-right: 20rpx;
}

/* 关闭按钮 - 现代化设计 */
.close-btn {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
	color: #666;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	border: 1rpx solid rgba(0, 0, 0, 0.05);
}

.close-btn:active {
	background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
	transform: scale(0.95);
	box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.15);
}

/* 弹窗内容区域 */
.detail-content {
	padding: 30rpx 40rpx 40rpx;
	background-color: #ffffff;
}

/* 详情项 - 优化布局和视觉 */
.detail-item {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
	padding: 16rpx 20rpx;
	background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
	border-radius: 12rpx;
	border-left: 4rpx solid #1976D2;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.detail-item:last-child {
	margin-bottom: 0;
}

.detail-item:hover {
	transform: translateX(4rpx);
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

/* 详情项装饰 */
.detail-item::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 4rpx;
	height: 100%;
	background: linear-gradient(180deg, #1976D2, #42A5F5);
}

/* 标签样式 - 添加图标效果 */
.label {
	width: 140rpx;
	font-size: 28rpx;
	font-weight: 600;
	color: #1976D2;
	position: relative;
	margin-right: 20rpx;
}

/* 详情值样式 */
.detail-item text:not(.label) {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	flex: 1;
	line-height: 1.4;
}

/* 弹窗遮罩层 - 优化性能和兼容性 */
.popup-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.6);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
	/* 降级方案：优先使用backdrop-filter，不支持时使用普通背景 */
	backdrop-filter: blur(4rpx);
	-webkit-backdrop-filter: blur(4rpx);
	animation: fadeIn 0.3s ease-out;
}

/* 不支持backdrop-filter的降级方案 */
@supports not (backdrop-filter: blur(4rpx)) {
	.popup-mask {
		background-color: rgba(0, 0, 0, 0.75);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
</style>
