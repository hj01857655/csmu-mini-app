<template>
	<view class="container">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="avatar-section">
				<image class="avatar" src="/static/avatar.png" mode="aspectFill"></image>
				<view class="user-info">
					<view class="username">{{ userInfo.name }}</view>
					<view class="student-id">学号：{{ userInfo.studentId }}</view>
					<view class="major">{{ userInfo.major }} · {{ userInfo.grade }}</view>
					<view class="class-info">{{ userInfo.className }} · {{ userInfo.college }}</view>
				</view>
			</view>
			<view class="user-stats">
				<view class="stat-item">
					<view class="stat-value">{{ userInfo.totalCredits }}</view>
					<view class="stat-label">总学分</view>
				</view>
				<view class="stat-item">
					<view class="stat-value">{{ userInfo.gpa }}</view>
					<view class="stat-label">平均绩点</view>
				</view>
				<view class="stat-item">
					<view class="stat-value">{{ userInfo.rank }}</view>
					<view class="stat-label">专业排名</view>
				</view>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="menu-group">
				<view class="group-title">个人信息</view>
				<view class="menu-item" @click="navigateToPage('/pages/profile-detail/profile-detail')">
					<view class="menu-icon info-icon">👤</view>
					<view class="menu-content">
						<view class="menu-title">个人资料</view>
						<view class="menu-desc">查看和编辑个人信息</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
				<view class="menu-item" @click="navigateToPage('/pages/change-password/change-password')">
					<view class="menu-icon password-icon">🔒</view>
					<view class="menu-content">
						<view class="menu-title">修改密码</view>
						<view class="menu-desc">更改登录密码</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
				<view class="menu-item" @click="navigateToPage('/pages/semester-info/semester-info')">
					<view class="menu-icon semester-icon">📅</view>
					<view class="menu-content">
						<view class="menu-title">学期信息</view>
						<view class="menu-desc">查看学期和周次信息</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
			</view>

			<view class="menu-group">
				<view class="group-title">学习工具</view>
				<view class="menu-item" @click="navigateToPage('/pages/grades/grades')">
					<view class="menu-icon grade-icon">📊</view>
					<view class="menu-content">
						<view class="menu-title">成绩查询</view>
						<view class="menu-desc">查看各科成绩详情</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
				<view class="menu-item" @click="navigateToPage('/pages/exam/exam')">
					<view class="menu-icon exam-icon">📝</view>
					<view class="menu-content">
						<view class="menu-title">考试安排</view>
						<view class="menu-desc">查看考试时间地点</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
				<view class="menu-item" @click="navigateToPage('/pages/course-selection/course-selection')">
					<view class="menu-icon course-icon">📚</view>
					<view class="menu-content">
						<view class="menu-title">选课系统</view>
						<view class="menu-desc">在线选课退课</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
				<view class="menu-item" @click="navigateToPage('/pages/evaluation/evaluation')">
					<view class="menu-icon evaluation-icon">⭐</view>
					<view class="menu-content">
						<view class="menu-title">教学评价</view>
						<view class="menu-desc">课程和教师评价</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
			</view>

			<view class="menu-group">
				<view class="group-title">校园服务</view>
				<view class="menu-item" @click="navigateToPage('/pages/notices/notices')">
					<view class="menu-icon notice-icon">📢</view>
					<view class="menu-content">
						<view class="menu-title">校园通知</view>
						<view class="menu-desc">查看最新校园动态</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
				<view class="menu-item" @click="showFeatureInfo('图书馆')">
					<view class="menu-icon library-icon">📚</view>
					<view class="menu-content">
						<view class="menu-title">图书馆</view>
						<view class="menu-desc">图书查询与借阅</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
				<view class="menu-item" @click="showFeatureInfo('校园卡')">
					<view class="menu-icon card-icon">💳</view>
					<view class="menu-content">
						<view class="menu-title">校园卡</view>
						<view class="menu-desc">余额查询与充值</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
			</view>

			<view class="menu-group">
				<view class="group-title">系统设置</view>
				<view class="menu-item" @click="showFeatureInfo('系统设置')">
					<view class="menu-icon setting-icon">⚙️</view>
					<view class="menu-content">
						<view class="menu-title">系统设置</view>
						<view class="menu-desc">个性化设置</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
				<view class="menu-item" @click="showHelpInfo">
					<view class="menu-icon help-icon">❓</view>
					<view class="menu-content">
						<view class="menu-title">帮助反馈</view>
						<view class="menu-desc">使用帮助与问题反馈</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
				<view class="menu-item" @click="logout">
					<view class="menu-icon logout-icon">🚪</view>
					<view class="menu-content">
						<view class="menu-title">退出登录</view>
						<view class="menu-desc">安全退出系统</view>
					</view>
					<view class="menu-arrow">></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import authService from '../../services/auth.js';

export default {
	data() {
		return {
			userInfo: {
				name: '张三',
				studentId: '2021001001',
				major: '计算机科学与技术',
				grade: '2021级',
				totalCredits: 45,
				gpa: '3.65',
				rank: '15/120'
			}
		}
	},
	onLoad() {
		this.checkLoginStatus();
		this.loadUserInfo();
	},
	methods: {
		checkLoginStatus() {
			if (!authService.isLoggedIn()) {
				console.log('用户未登录，跳转到登录页');
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		},

		async loadUserInfo() {
			try {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});

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

				// 尝试从API获取最新的用户统计信息
				try {
					const educationApi = (await import('../../services/education-api.js')).default;
					const response = await educationApi.getUserStats();
					if (response.success && response.data) {
						this.userInfo = {
							...this.userInfo,
							totalCredits: response.data.totalCredits || this.userInfo.totalCredits,
							gpa: response.data.gpa || this.userInfo.gpa,
							rank: response.data.rank || this.userInfo.rank
						};
					}
				} catch (apiError) {
					console.log('获取用户统计信息失败，使用缓存数据:', apiError);
				}

			} catch (e) {
				console.error('加载用户信息失败:', e);
				uni.showToast({
					title: '加载用户信息失败',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
		},
		navigateTo(url) {
			uni.switchTab({
				url: url
			});
		},
		navigateToPage(url) {
			uni.navigateTo({
				url: url
			});
		},
		showFeatureInfo(featureName) {
			const featureInfos = {
				'图书馆': {
					title: '图书馆服务',
					content: '图书馆功能包括：\n• 图书检索与预约\n• 借阅记录查询\n• 座位预约\n• 电子资源访问\n\n该功能将在后续版本中推出，敬请期待！'
				},
				'校园卡': {
					title: '校园卡服务',
					content: '校园卡功能包括：\n• 余额查询\n• 消费记录\n• 在线充值\n• 挂失与解挂\n\n该功能将在后续版本中推出，敬请期待！'
				},
				'系统设置': {
					title: '系统设置',
					content: '系统设置功能包括：\n• 主题切换\n• 通知设置\n• 隐私设置\n• 缓存清理\n\n该功能将在后续版本中推出，敬请期待！'
				}
			};

			const info = featureInfos[featureName];
			if (info) {
				uni.showModal({
					title: info.title,
					content: info.content,
					showCancel: false,
					confirmText: '我知道了'
				});
			}
		},

		showHelpInfo() {
			uni.showModal({
				title: '帮助与反馈',
				content: '如果您在使用过程中遇到问题或有建议，可以通过以下方式联系我们：\n\n📧 邮箱：support@csmu.edu.cn\n📞 电话：0731-12345678\n🕐 服务时间：周一至周五 9:00-17:00',
				showCancel: true,
				cancelText: '取消',
				confirmText: '联系客服',
				success: (res) => {
					if (res.confirm) {
						uni.makePhoneCall({
							phoneNumber: '073112345678'
						});
					}
				}
			});
		},
		async logout() {
			uni.showModal({
				title: '确认退出',
				content: '确定要退出登录吗？',
				success: async (res) => {
					if (res.confirm) {
						try {
							// 使用认证服务退出
							await authService.logout();

							uni.showToast({
								title: '退出成功',
								icon: 'success',
								duration: 1500
							});
						} catch (error) {
							console.error('退出登录失败:', error);
							uni.showToast({
								title: '退出失败',
								icon: 'none',
								duration: 2000
							});
						}
					}
				}
			});
		}
	}
}
</script>

<style scoped>
.container {
	background-color: var(--background-tertiary);
	min-height: 100vh;
}

.user-card {
	background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
	margin: var(--spacing-md);
	border-radius: var(--border-radius-lg);
	padding: var(--spacing-xl);
	color: white;
	box-shadow: var(--shadow-md);
}

.avatar-section {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-right: 30rpx;
	background-color: rgba(255,255,255,0.2);
}

.user-info {
	flex: 1;
}

.username {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.student-id {
	font-size: 28rpx;
	opacity: 0.9;
	margin-bottom: 8rpx;
}

.major {
	font-size: 26rpx;
	opacity: 0.8;
	margin-bottom: 6rpx;
}

.class-info {
	font-size: 24rpx;
	opacity: 0.7;
}

.user-stats {
	display: flex;
	justify-content: space-around;
	background-color: rgba(255,255,255,0.1);
	border-radius: 16rpx;
	padding: 30rpx;
}

.stat-item {
	text-align: center;
}

.stat-value {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.stat-label {
	font-size: 24rpx;
	opacity: 0.8;
}

.menu-section {
	margin: 20rpx;
}

.menu-group {
	background-color: #fff;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
}

.group-title {
	padding: 30rpx;
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
	background-color: #f8f9fa;
	border-bottom: 1rpx solid #e9ecef;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
	border-bottom: none;
}

.menu-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin-right: 24rpx;
}

.info-icon { background-color: #e3f2fd; }
.password-icon { background-color: #ffebee; }
.home-icon { background-color: #e8f5e8; }
.schedule-icon { background-color: #e3f2fd; }
.grade-icon { background-color: #f3e5f5; }
.exam-icon { background-color: #fff3e0; }
.course-icon { background-color: #e1f5fe; }
.evaluation-icon { background-color: #fff8e1; }
.library-icon { background-color: #e8f5e8; }
.card-icon { background-color: #fce4ec; }
.notice-icon { background-color: #e0f2f1; }
.semester-icon { background-color: #fce4ec; }
.setting-icon { background-color: #f1f8e9; }
.help-icon { background-color: #fff8e1; }
.logout-icon { background-color: #ffebee; }

.menu-content {
	flex: 1;
}

.menu-title {
	font-size: 32rpx;
	color: #333;
	margin-bottom: 8rpx;
}

.menu-desc {
	font-size: 24rpx;
	color: #666;
}

.menu-arrow {
	font-size: 32rpx;
	color: #ccc;
}
</style>
