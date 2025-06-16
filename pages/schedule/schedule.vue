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
			<view class="day-column" v-for="day in weekDays" :key="day.key">
				<view class="day-name">{{ day.name }}</view>
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
				<view class="course-cell" v-for="day in weekDays" :key="day.key">
					<view v-if="getCourse(day.key, index)"
						  class="course-item"
						  :class="getCourse(day.key, index).type"
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
						<text class="label">教师：</text>
						<text>{{ selectedCourse.teacher }}</text>
					</view>
					<view class="detail-item">
						<text class="label">地点：</text>
						<text>{{ selectedCourse.location }}</text>
					</view>
					<view class="detail-item">
						<text class="label">时间：</text>
						<text>{{ selectedCourse.timeText }}</text>
					</view>
					<view class="detail-item">
						<text class="label">学分：</text>
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
			console.log('📅 课程表页面 - 当前学期:', this.currentSemester.name);
			console.log('📅 课程表页面 - 当前周次:', currentWeekInfo.message);

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
				console.log('📅 检测到周次变化，从第', this.currentWeekIndex + 1, '周更新到第', newWeekIndex + 1, '周');
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
			console.log('加载课程表数据，周次:', this.currentWeekIndex + 1);

			try {
				// 使用新的教务API服务
				const week = this.currentWeekIndex + 1;
				const response = await educationApi.getCurrentSchedule(week);

				if (response.success && response.data.courses) {
					this.courses = this.formatScheduleData(response.data.courses);
					console.log('课程表数据加载成功');
				} else {
					console.warn('课程表数据为空，使用默认数据');
					// 保持使用默认的模拟数据
				}
			} catch (error) {
				console.error('加载课程表失败:', error);
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
}

.day-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
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
}

.course-item {
	background-color: #e3f2fd;
	border-radius: 8rpx;
	padding: 15rpx 10rpx;
	height: 100%;
	border-left: 6rpx solid #2196f3;
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

.course-detail {
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
}

.label {
	width: 120rpx;
	font-size: 28rpx;
	color: #666;
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
