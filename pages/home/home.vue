<template>
	<view class="home-container">
		<!-- 用户信息卡片 -->
		<view class="user-header">
			<view class="user-info">
				<image class="avatar" src="/static/avatar.png" mode="aspectFill"></image>
				<view class="user-details">
					<view class="greeting">{{ greeting }}，{{ userInfo.name }}</view>
					<view class="user-meta">{{ userInfo.major }} · {{ userInfo.grade }}</view>
					<view class="semester-info">{{ currentSemesterInfo }}</view>
				</view>
			</view>
			<view class="weather-info">
				<view class="weather-icon">☀️</view>
				<view class="weather-text">
					<view class="temperature">22°C</view>
					<view class="weather-desc">晴天</view>
				</view>
			</view>
		</view>

		<!-- 今日课程 -->
		<view class="today-schedule">
			<view class="section-header">
				<view class="section-title">今日课程</view>
				<view class="section-more" @click="goToSchedule">查看全部 ></view>
			</view>
			<scroll-view scroll-x class="schedule-scroll" v-if="todayCourses.length > 0">
				<view class="course-card" v-for="course in todayCourses" :key="course.id">
					<view class="course-time">{{ course.time }}</view>
					<view class="course-name">{{ course.name }}</view>
					<view class="course-location">{{ course.location }}</view>
					<view class="course-teacher">{{ course.teacher }}</view>
				</view>
			</scroll-view>
			<view class="no-course" v-else>
				<text class="no-course-icon">📚</text>
				<text class="no-course-text">今天没有课程安排</text>
			</view>
		</view>

		<!-- 快捷功能 -->
		<view class="quick-actions">
			<view class="section-header">
				<view class="section-title">快捷功能</view>
			</view>
			<view class="action-grid">
				<view class="action-item" @click="navigateTo('/pages/grades/grades')">
					<view class="action-icon grade-icon">📊</view>
					<text class="action-text">成绩查询</text>
				</view>
				<view class="action-item" @click="navigateTo('/pages/exam/exam')">
					<view class="action-icon exam-icon">📝</view>
					<text class="action-text">考试安排</text>
				</view>
				<view class="action-item" @click="navigateTo('/pages/course-selection/course-selection')">
					<view class="action-icon course-icon">📚</view>
					<text class="action-text">选课系统</text>
				</view>
				<view class="action-item" @click="showComingSoon">
					<view class="action-icon library-icon">🏛️</view>
					<text class="action-text">图书馆</text>
				</view>
				<view class="action-item" @click="showComingSoon">
					<view class="action-icon card-icon">💳</view>
					<text class="action-text">校园卡</text>
				</view>
				<view class="action-item" @click="navigateTo('/pages/evaluation/evaluation')">
					<view class="action-icon evaluation-icon">⭐</view>
					<text class="action-text">教学评价</text>
				</view>
			</view>
		</view>

		<!-- 校园通知 -->
		<view class="campus-notices">
			<view class="section-header">
				<view class="section-title">校园通知</view>
				<view class="section-more" @click="showAllNotices">查看全部 ></view>
			</view>
			<view class="notice-list">
				<view class="notice-item" v-for="notice in notices" :key="notice.id" @click="showNoticeDetail(notice)">
					<view class="notice-content">
						<view class="notice-title">{{ notice.title }}</view>
						<view class="notice-summary">{{ notice.summary }}</view>
						<view class="notice-meta">
							<text class="notice-department">{{ notice.department }}</text>
							<text class="notice-time">{{ notice.publishTime }}</text>
						</view>
					</view>
					<view class="notice-status" :class="notice.type">
						{{ notice.type === 'important' ? '重要' : notice.type === 'urgent' ? '紧急' : '通知' }}
					</view>
				</view>
			</view>
		</view>

		<!-- 学习统计 -->
		<view class="study-stats">
			<view class="section-header">
				<view class="section-title">学习统计</view>
			</view>
			<view class="stats-grid">
				<view class="stat-item">
					<view class="stat-number">{{ userInfo.totalCredits }}</view>
					<view class="stat-label">已修学分</view>
				</view>
				<view class="stat-item">
					<view class="stat-number">{{ userInfo.gpa }}</view>
					<view class="stat-label">平均绩点</view>
				</view>
				<view class="stat-item">
					<view class="stat-number">{{ userInfo.rank }}</view>
					<view class="stat-label">专业排名</view>
				</view>
				<view class="stat-item">
					<view class="stat-number">{{ attendanceRate }}%</view>
					<view class="stat-label">出勤率</view>
				</view>
			</view>
		</view>

		<!-- 通知详情弹窗 -->
		<view class="popup-mask" v-if="showNoticePopup" @click="closeNoticeDetail">
			<view class="notice-detail" v-if="selectedNotice" @click.stop>
				<view class="detail-header">
					<text class="notice-detail-title">{{ selectedNotice.title }}</text>
					<text class="close-btn" @click="closeNoticeDetail">×</text>
				</view>
				<view class="detail-content">
					<view class="detail-meta">
						<text class="detail-department">发布部门：{{ selectedNotice.department }}</text>
						<text class="detail-time">发布时间：{{ selectedNotice.publishTime }}</text>
					</view>
					<view class="detail-text">{{ selectedNotice.content }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import semesterCalculator from '../../utils/semester.js';
import dateFormatter from '../../utils/date-formatter.js';
import authService from '../../services/auth.js';
import educationApi from '../../services/education-api.js';

export default {
	data() {
		return {
			currentSemesterInfo: '',
			userInfo: {
				name: '张三',
				studentId: '2021001001',
				major: '计算机科学与技术',
				grade: '2021级',
				totalCredits: 45,
				gpa: '3.65',
				rank: '15/120'
			},
			attendanceRate: 95,
			showNoticePopup: false,
			selectedNotice: null,
			// 数据加载状态
			loadingStates: {
				userInfo: false,
				todayCourses: false,
				notices: false,
				studyStats: false
			},
			todayCourses: [
				{
					id: 1,
					name: '高等数学A',
					time: '08:00-09:40',
					location: '教学楼A101',
					teacher: '张教授'
				},
				{
					id: 2,
					name: '大学英语',
					time: '14:00-15:40',
					location: '教学楼B203',
					teacher: '李老师'
				}
			],
			notices: [
				{
					id: 1,
					title: '关于2024年春季学期选课的通知',
					summary: '2024年春季学期选课将于1月15日开始，请同学们及时关注...',
					content: '各位同学：\n\n2024年春季学期选课工作即将开始，现将有关事项通知如下：\n\n一、选课时间\n第一轮选课：2024年1月15日9:00 - 1月20日17:00\n第二轮选课：2024年1月25日9:00 - 1月30日17:00\n\n二、选课要求\n1. 请同学们认真阅读培养方案，合理安排课程\n2. 注意课程时间冲突，避免选择时间重叠的课程\n3. 选课期间如有问题，请及时联系教务处\n\n三、注意事项\n1. 选课系统开放时间为每日9:00-22:00\n2. 请使用校园网或VPN访问选课系统\n3. 选课结果以最终确认为准\n\n教务处\n2024年1月10日',
					department: '教务处',
					publishTime: '2024-01-10',
					type: 'important'
				},
				{
					id: 2,
					title: '期末考试安排及注意事项',
					summary: '本学期期末考试将于1月20日开始，请同学们做好复习准备...',
					content: '各位同学：\n\n本学期期末考试即将开始，现将考试安排及注意事项通知如下：\n\n一、考试时间\n考试周：2024年1月20日 - 1月26日\n\n二、考试要求\n1. 考生须提前15分钟到达考场\n2. 携带学生证和身份证参加考试\n3. 严格遵守考试纪律，诚信考试\n\n三、注意事项\n1. 考试期间请保持手机静音\n2. 考试用品请自行准备\n3. 如有特殊情况请及时联系监考老师\n\n祝同学们考试顺利！\n\n教务处\n2024年1月12日',
					department: '教务处',
					publishTime: '2024-01-12',
					type: 'urgent'
				},
				{
					id: 3,
					title: '图书馆寒假开放时间调整通知',
					summary: '寒假期间图书馆开放时间有所调整，请同学们注意...',
					content: '各位读者：\n\n寒假期间图书馆开放时间调整如下：\n\n一、开放时间\n1月27日 - 2月20日：每日9:00-17:00\n周末正常开放\n\n二、服务调整\n1. 借还书服务正常\n2. 自习室开放时间同步调整\n3. 电子资源24小时可访问\n\n三、注意事项\n1. 请合理安排学习时间\n2. 遵守图书馆相关规定\n3. 如有问题请咨询服务台\n\n图书馆\n2024年1月15日',
					department: '图书馆',
					publishTime: '2024-01-15',
					type: 'normal'
				}
			]
		}
	},
	computed: {
		greeting() {
			const hour = new Date().getHours();
			if (hour < 12) return '上午好';
			if (hour < 18) return '下午好';
			return '晚上好';
		}
	},
	onLoad() {
		this.checkLoginStatus();
		this.initPageData();
	},
	onShow() {
		// 页面显示时刷新数据
		this.checkAndUpdateSemesterInfo();
		// 只在API模式下刷新今日课程，避免重复加载
		if (!this.loadingStates.todayCourses) {
			this.loadTodayCoursesFromApi();
		}
	},
	methods: {
		checkLoginStatus() {
			if (!authService.isLoggedIn()) {
				console.log('用户未登录，跳转到登录页');
				uni.reLaunch({
					url: '/pages/login/login'
				});
				return;
			}

			// 检查token是否即将过期，自动刷新
			authService.autoRefreshToken().catch(error => {
				console.error('自动刷新token失败:', error);
			});
		},

		loadUserInfo() {
			try {
				const currentUser = authService.getCurrentUser();
				if (currentUser) {
					// 根据后端返回的用户信息结构更新
					this.userInfo = {
						...this.userInfo,
						name: currentUser.real_name || '未知用户',
						studentId: currentUser.student_id || currentUser.education_username || currentUser.username || '',
						major: currentUser.major || '未知专业',
						grade: currentUser.grade ? `${currentUser.grade}级` : '未知年级',
						className: currentUser.class_name || '未知班级',
						college: currentUser.college || '未知学院',
						phone: currentUser.phone || '',
						totalCredits: currentUser.total_credits || currentUser.completed_credits || 45,
						gpa: currentUser.gpa || '3.65',
						rank: currentUser.rank || '15/120'
					};
				}
			} catch (e) {
				console.error('加载用户信息失败:', e);
			}
		},
		initSemesterInfo() {
			// 获取当前学期和周次信息（使用缓存版本）
			const currentSemester = semesterCalculator.getCurrentSemester();
			const currentWeek = semesterCalculator.getCurrentWeekCached();

			this.currentSemesterInfo = `${currentSemester.name} · ${currentWeek.message}`;

			console.log('🏠 首页 - 当前学期信息:', this.currentSemesterInfo);

			// 在开发环境中验证周次计算
			if (process.env.NODE_ENV === 'development') {
				semesterCalculator.validateWeekCalculation();
			}
		},

		checkAndUpdateSemesterInfo() {
			// 检查是否需要更新学期信息
			const currentSemester = semesterCalculator.getCurrentSemester();
			const currentWeek = semesterCalculator.getCurrentWeekCached();
			const newSemesterInfo = `${currentSemester.name} · ${currentWeek.message}`;

			// 如果学期信息发生变化，更新显示
			if (newSemesterInfo !== this.currentSemesterInfo) {
				this.currentSemesterInfo = newSemesterInfo;
			}
		},
		loadTodayCourses() {
			// 获取今天是周几
			const today = new Date().getDay();
			const dayMap = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };
			const todayKey = dayMap[today];

			// 这里可以从课程表数据中筛选今天的课程
			// 暂时使用模拟数据
			if (today === 0 || today === 6) {
				// 周末没有课
				this.todayCourses = [];
			}
		},
		navigateTo(url) {
			if (url.includes('tab')) {
				uni.switchTab({ url });
			} else {
				uni.navigateTo({ url });
			}
		},
		goToSchedule() {
			uni.switchTab({
				url: '/pages/schedule/schedule'
			});
		},
		showNoticeDetail(notice) {
			this.selectedNotice = notice;
			this.showNoticePopup = true;
		},
		closeNoticeDetail() {
			this.showNoticePopup = false;
		},
		showAllNotices() {
			uni.navigateTo({
				url: '/pages/notices/notices'
			});
		},
		showComingSoon() {
			uni.showToast({
				title: '功能开发中...',
				icon: 'none',
				duration: 2000
			});
		},

		/**
		 * 初始化页面数据
		 * 使用新的API服务加载数据
		 */
		async initPageData() {
			// 并行加载多个数据源
			await Promise.all([
				this.loadUserInfoFromApi(),
				this.loadTodayCoursesFromApi(),
				this.loadNoticesFromApi(),
				this.loadStudyStatsFromApi()
			]);

			// 初始化学期信息
			this.initSemesterInfo();
		},

		/**
		 * 从API加载用户信息
		 */
		async loadUserInfoFromApi() {
			this.loadingStates.userInfo = true;
			try {
				const response = await educationApi.getUserProfile();
				if (response.success) {
					this.userInfo = {
						...this.userInfo,
						name: response.data.real_name || '未知用户',
						studentId: response.data.student_id || '',
						major: response.data.major || '未知专业',
						grade: response.data.grade ? `${response.data.grade}级` : '未知年级',
						className: response.data.class_name || '未知班级',
						college: response.data.college || '未知学院',
						totalCredits: response.data.total_credits || 45,
						gpa: response.data.gpa || '3.65',
						rank: response.data.rank || '15/120'
					};
				}
			} catch (error) {
				// 保持使用本地存储的用户信息作为备用
				this.loadUserInfo();
			} finally {
				this.loadingStates.userInfo = false;
			}
		},

		/**
		 * 从API加载今日课程
		 */
		async loadTodayCoursesFromApi() {
			this.loadingStates.todayCourses = true;
			try {
				const response = await educationApi.getCurrentSchedule();
				if (response.success && response.data.courses) {
					// 筛选今天的课程
					const today = new Date().getDay();
					const todayCourses = response.data.courses.filter(course => {
						return course.dayOfWeek === today;
					});

					this.todayCourses = todayCourses.map(course => ({
						id: course.id,
						name: course.name,
						time: course.timeSlot,
						location: course.location,
						teacher: course.teacher
					}));
				}
			} catch (error) {
				// 使用原有的模拟数据逻辑
				this.loadTodayCourses();
			} finally {
				this.loadingStates.todayCourses = false;
			}
		},

		/**
		 * 从API加载校园通知
		 */
		async loadNoticesFromApi() {
			this.loadingStates.notices = true;
			try {
				const response = await educationApi.getNoticesList({
					page: 1,
					pageSize: 5,
					type: 'important'
				});
				if (response.success && response.data) {
					this.notices = response.data.map(notice => ({
						id: notice.id,
						title: notice.title,
						summary: notice.content ? notice.content.substring(0, 50) + '...' : '',
						content: notice.content,
						department: notice.department,
						publishTime: notice.publishTime,
						type: notice.type
					}));
				}
			} catch (error) {
				// 保持使用模拟数据
			} finally {
				this.loadingStates.notices = false;
			}
		},

		/**
		 * 从API加载学习统计
		 */
		async loadStudyStatsFromApi() {
			this.loadingStates.studyStats = true;
			try {
				const response = await educationApi.getGradesStatistics();
				if (response.success && response.data) {
					// 更新学习统计数据
					this.userInfo.totalCredits = response.data.totalCredits || this.userInfo.totalCredits;
					this.userInfo.gpa = response.data.gpa || this.userInfo.gpa;
					this.attendanceRate = response.data.attendanceRate || this.attendanceRate;
				}
			} catch (error) {
				// 保持使用默认数据
			} finally {
				this.loadingStates.studyStats = false;
			}
		}
	}
}
</script>

<style scoped>
.home-container {
	background-color: #f5f7fa;
	min-height: 100vh;
	padding-bottom: 20rpx;
}

.user-header {
	background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
	padding: 40rpx 30rpx 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: white;
}

.user-info {
	display: flex;
	align-items: center;
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	margin-right: 20rpx;
	background-color: rgba(255,255,255,0.2);
}

.greeting {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.user-meta {
	font-size: 26rpx;
	opacity: 0.9;
	margin-bottom: 8rpx;
}

.semester-info {
	font-size: 24rpx;
	opacity: 0.8;
	background-color: rgba(255,255,255,0.2);
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	display: inline-block;
}

.weather-info {
	display: flex;
	align-items: center;
}

.weather-icon {
	font-size: 48rpx;
	margin-right: 10rpx;
}

.temperature {
	font-size: 32rpx;
	font-weight: bold;
}

.weather-desc {
	font-size: 24rpx;
	opacity: 0.8;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	padding-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.section-more {
	font-size: 26rpx;
	color: #1976D2;
}

.today-schedule {
	background-color: white;
	margin: 20rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.schedule-scroll {
	padding: 0 30rpx 30rpx;
	white-space: nowrap;
}

.course-card {
	display: inline-block;
	background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
	border-radius: 12rpx;
	padding: 20rpx;
	margin-right: 20rpx;
	min-width: 200rpx;
	border-left: 6rpx solid #1976D2;
}

.course-time {
	font-size: 24rpx;
	color: #1976D2;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.course-name {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.course-location, .course-teacher {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 4rpx;
}

.no-course {
	text-align: center;
	padding: 60rpx 30rpx;
	color: #999;
}

.no-course-icon {
	font-size: 64rpx;
	display: block;
	margin-bottom: 20rpx;
}

.no-course-text {
	font-size: 28rpx;
}

.quick-actions {
	background-color: white;
	margin: 20rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.action-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1rpx;
	background-color: #f0f0f0;
	padding: 30rpx;
}

.action-item {
	background-color: white;
	padding: 30rpx 20rpx;
	text-align: center;
	border-radius: 12rpx;
}

.action-icon {
	font-size: 48rpx;
	margin-bottom: 15rpx;
	display: block;
}

.action-text {
	font-size: 26rpx;
	color: #333;
}

.campus-notices {
	background-color: white;
	margin: 20rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.notice-list {
	padding: 0 30rpx 30rpx;
}

.notice-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 25rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.notice-item:last-child {
	border-bottom: none;
}

.notice-content {
	flex: 1;
}

.notice-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.notice-summary {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.notice-meta {
	display: flex;
	gap: 20rpx;
}

.notice-department, .notice-time {
	font-size: 22rpx;
	color: #999;
}

.notice-status {
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	font-weight: bold;
}

.notice-status.important {
	background-color: #ffebee;
	color: #f44336;
}

.notice-status.urgent {
	background-color: #fff3e0;
	color: #ff9800;
}

.notice-status.normal {
	background-color: #e8f5e8;
	color: #4caf50;
}

.study-stats {
	background-color: white;
	margin: 20rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 1rpx;
	background-color: #f0f0f0;
	padding: 30rpx;
}

.stat-item {
	background-color: white;
	padding: 30rpx;
	text-align: center;
	border-radius: 12rpx;
}

.stat-number {
	font-size: 36rpx;
	font-weight: bold;
	color: #1976D2;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 24rpx;
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

.notice-detail {
	background-color: white;
	border-radius: 20rpx;
	width: 90%;
	max-height: 80vh;
	overflow-y: auto;
	padding: 40rpx;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.notice-detail-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
	line-height: 1.4;
}

.close-btn {
	font-size: 48rpx;
	color: #999;
	width: 60rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
	margin-left: 20rpx;
}

.detail-meta {
	margin-bottom: 30rpx;
	padding: 20rpx;
	background-color: #f8f9fa;
	border-radius: 12rpx;
}

.detail-department, .detail-time {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.detail-text {
	font-size: 28rpx;
	line-height: 1.6;
	color: #333;
	white-space: pre-line;
}
</style>
