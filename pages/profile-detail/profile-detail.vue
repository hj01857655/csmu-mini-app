<template>
	<view class="container">
		<!-- 头像区域 -->
		<view class="header-section">
			<view class="header-bg"></view>
			<view class="avatar-section">
				<view class="avatar-container">
					<image class="avatar" src="/static/avatar.png" mode="aspectFill"></image>
					<view class="avatar-edit" @click="changeAvatar">
						<text class="edit-icon">📷</text>
					</view>
				</view>
				<view class="name-section">
					<text class="user-name">{{ userInfo.name }}</text>
					<view class="user-tags">
						<text class="user-role">{{ userInfo.role === 'student' ? '学生' : '教师' }}</text>
						<text class="user-status">{{ userInfo.status === 'active' ? '在读' : '其他' }}</text>
					</view>
					<text class="user-id">学号：{{ userInfo.studentId }}</text>
				</view>
			</view>
		</view>

		<!-- 基本信息 -->
		<view class="info-section">
			<view class="section-header">
				<view class="section-icon">👤</view>
				<text class="section-title">基本信息</text>
			</view>
			<view class="info-card">
				<view class="info-item">
					<view class="info-icon">📝</view>
					<view class="info-content">
						<text class="info-label">姓名</text>
						<text class="info-value">{{ userInfo.name }}</text>
					</view>
				</view>
				<view class="info-item">
					<view class="info-icon">🎓</view>
					<view class="info-content">
						<text class="info-label">学号</text>
						<text class="info-value">{{ userInfo.studentId }}</text>
					</view>
				</view>
				<view class="info-item" @click="editPhone">
					<view class="info-icon">📱</view>
					<view class="info-content">
						<text class="info-label">手机号</text>
						<text class="info-value">{{ userInfo.phone || '未设置' }}</text>
					</view>
					<view class="info-action">
						<text class="edit-btn">编辑</text>
						<text class="arrow">></text>
					</view>
				</view>
				<view class="info-item" @click="editEmail">
					<view class="info-icon">📧</view>
					<view class="info-content">
						<text class="info-label">邮箱</text>
						<text class="info-value">{{ userInfo.email || '未设置' }}</text>
					</view>
					<view class="info-action">
						<text class="edit-btn">编辑</text>
						<text class="arrow">></text>
					</view>
				</view>
			</view>
		</view>

		<!-- 学籍信息 -->
		<view class="info-section">
			<view class="section-header">
				<view class="section-icon">🎓</view>
				<text class="section-title">学籍信息</text>
			</view>
			<view class="info-card">
				<view class="info-item">
					<view class="info-icon">📚</view>
					<view class="info-content">
						<text class="info-label">专业</text>
						<text class="info-value">{{ userInfo.major }}</text>
					</view>
				</view>
				<view class="info-item">
					<view class="info-icon">📅</view>
					<view class="info-content">
						<text class="info-label">年级</text>
						<text class="info-value">{{ userInfo.grade }}</text>
					</view>
				</view>
				<view class="info-item">
					<view class="info-icon">👥</view>
					<view class="info-content">
						<text class="info-label">班级</text>
						<text class="info-value">{{ userInfo.className }}</text>
					</view>
				</view>
				<view class="info-item">
					<view class="info-icon">🏫</view>
					<view class="info-content">
						<text class="info-label">学院</text>
						<text class="info-value">{{ userInfo.college }}</text>
					</view>
				</view>
				<view class="info-item">
					<view class="info-icon">✅</view>
					<view class="info-content">
						<text class="info-label">学籍状态</text>
						<text class="info-value status-active">{{ userInfo.status === 'active' ? '在读' : '其他' }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 学习统计 -->
		<view class="info-section">
			<view class="section-header">
				<view class="section-icon">📊</view>
				<text class="section-title">学习统计</text>
			</view>
			<view class="stats-container">
				<view class="stat-card">
					<view class="stat-icon">📖</view>
					<view class="stat-content">
						<text class="stat-value">{{ userInfo.totalCredits }}</text>
						<text class="stat-label">总学分</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon">⭐</view>
					<view class="stat-content">
						<text class="stat-value">{{ userInfo.gpa }}</text>
						<text class="stat-label">平均绩点</text>
					</view>
				</view>
				<view class="stat-card">
					<view class="stat-icon">🏆</view>
					<view class="stat-content">
						<text class="stat-value">{{ userInfo.rank }}</text>
						<text class="stat-label">专业排名</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 账户信息 -->
		<view class="info-section">
			<view class="section-header">
				<view class="section-icon">⏰</view>
				<text class="section-title">账户信息</text>
			</view>
			<view class="info-card">
				<view class="info-item">
					<view class="info-icon">📅</view>
					<view class="info-content">
						<text class="info-label">注册时间</text>
						<text class="info-value">{{ formatDate(userInfo.createdAt) }}</text>
					</view>
				</view>
				<view class="info-item">
					<view class="info-icon">🕐</view>
					<view class="info-content">
						<text class="info-label">最后登录</text>
						<text class="info-value">{{ formatDate(userInfo.lastLogin) }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-section">
			<button class="action-btn primary" @click="changePassword">修改密码</button>
			<button class="action-btn secondary" @click="exportInfo">导出信息</button>
		</view>
	</view>
</template>

<script>
import authService from '../../services/auth.js';

export default {
	data() {
		return {
			userInfo: {
				name: '未知用户',
				studentId: '',
				major: '未知专业',
				grade: '未知年级',
				className: '未知班级',
				college: '未知学院',
				phone: '',
				email: '',
				role: 'student',
				status: 'active',
				totalCredits: 0,
				gpa: '0.00',
				rank: '0/0',
				createdAt: '',
				lastLogin: ''
			}
		}
	},
	onLoad() {
		this.loadUserInfo();
	},
	methods: {
		loadUserInfo() {
			try {
				const currentUser = authService.getCurrentUser();
				if (currentUser) {
					this.userInfo = {
						...this.userInfo,
						name: currentUser.real_name || '未知用户',
						studentId: currentUser.student_id || currentUser.education_username || currentUser.username || '',
						major: currentUser.major || '未知专业',
						grade: currentUser.grade ? `${currentUser.grade}级` : '未知年级',
						className: currentUser.class_name || '未知班级',
						college: currentUser.college || '未知学院',
						phone: currentUser.phone || '',
						email: currentUser.email || '',
						role: currentUser.role || 'student',
						status: currentUser.status || 'active',
						totalCredits: currentUser.total_credits || currentUser.completed_credits || 0,
						gpa: currentUser.gpa || '0.00',
						rank: currentUser.rank || '0/0',
						createdAt: currentUser.created_at || '',
						lastLogin: currentUser.last_login || ''
					};
				}
			} catch (e) {
				console.error('加载用户信息失败:', e);
			}
		},

		formatDate(dateString) {
			if (!dateString) return '未知';
			try {
				const date = new Date(dateString);
				return date.toLocaleDateString('zh-CN', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit'
				});
			} catch (e) {
				return '未知';
			}
		},

		changeAvatar() {
			uni.showActionSheet({
				itemList: ['拍照', '从相册选择'],
				success: (res) => {
					if (res.tapIndex === 0) {
						this.takePhoto();
					} else if (res.tapIndex === 1) {
						this.chooseImage();
					}
				}
			});
		},

		takePhoto() {
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'],
				success: (res) => {
					console.log('拍照成功:', res);
					uni.showToast({
						title: '头像上传功能开发中',
						icon: 'none'
					});
				}
			});
		},

		chooseImage() {
			uni.chooseImage({
				count: 1,
				sourceType: ['album'],
				success: (res) => {
					console.log('选择图片成功:', res);
					uni.showToast({
						title: '头像上传功能开发中',
						icon: 'none'
					});
				}
			});
		},

		editPhone() {
			uni.navigateTo({
				url: '/pages/edit-profile/edit-profile?field=phone&value=' + encodeURIComponent(this.userInfo.phone || '')
			});
		},

		editEmail() {
			uni.navigateTo({
				url: '/pages/edit-profile/edit-profile?field=email&value=' + encodeURIComponent(this.userInfo.email || '')
			});
		},

		changePassword() {
			uni.navigateTo({
				url: '/pages/change-password/change-password'
			});
		},

		exportInfo() {
			const info = `个人信息导出
姓名：${this.userInfo.name}
学号：${this.userInfo.studentId}
专业：${this.userInfo.major}
年级：${this.userInfo.grade}
班级：${this.userInfo.className}
学院：${this.userInfo.college}
手机：${this.userInfo.phone || '未设置'}
邮箱：${this.userInfo.email || '未设置'}
总学分：${this.userInfo.totalCredits}
平均绩点：${this.userInfo.gpa}
专业排名：${this.userInfo.rank}
导出时间：${new Date().toLocaleString()}`;

			uni.setClipboardData({
				data: info,
				success: () => {
					uni.showToast({
						title: '信息已复制到剪贴板',
						icon: 'success'
					});
				}
			});
		}
	}
}
</script>

<style scoped>
.container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header-section {
	position: relative;
	margin-bottom: 60rpx;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 280rpx;
	background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
	border-radius: 0 0 40rpx 40rpx;
	z-index: 1;
}

.avatar-section {
	position: relative;
	z-index: 2;
	padding: 60rpx 40rpx 60rpx;
	display: flex;
	align-items: center;
}

.avatar-container {
	position: relative;
	margin-right: 30rpx;
}

.avatar {
	width: 140rpx;
	height: 140rpx;
	border-radius: 70rpx;
	background-color: rgba(255,255,255,0.2);
	border: 4rpx solid rgba(255,255,255,0.3);
}

.avatar-edit {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 44rpx;
	height: 44rpx;
	background-color: #FF9800;
	border-radius: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 3rpx solid white;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.edit-icon {
	font-size: 22rpx;
	color: white;
}

.name-section {
	flex: 1;
	color: white;
}

.user-name {
	font-size: 40rpx;
	font-weight: bold;
	color: white;
	display: block;
	margin-bottom: 12rpx;
}

.user-tags {
	display: flex;
	gap: 12rpx;
	margin-bottom: 8rpx;
}

.user-role {
	font-size: 22rpx;
	color: white;
	background-color: rgba(255,255,255,0.2);
	padding: 6rpx 16rpx;
	border-radius: 16rpx;
	border: 1rpx solid rgba(255,255,255,0.3);
}

.user-status {
	font-size: 22rpx;
	color: white;
	background-color: rgba(76,175,80,0.8);
	padding: 6rpx 16rpx;
	border-radius: 16rpx;
}

.user-id {
	font-size: 26rpx;
	color: rgba(255,255,255,0.9);
}

.info-section {
	margin: 0 20rpx 30rpx;
	position: relative;
	z-index: 3;
}

.section-header {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
	padding: 0 8rpx;
}

.section-icon {
	font-size: 32rpx;
	margin-right: 12rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.info-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 8rpx 0;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
	position: relative;
	z-index: 4;
}

.info-item {
	display: flex;
	align-items: center;
	padding: 24rpx 30rpx;
	border-bottom: 1rpx solid #f8f9fa;
	transition: background-color 0.3s ease;
}

.info-item:last-child {
	border-bottom: none;
}

.info-item:active {
	background-color: #f8f9fa;
}

.info-icon {
	font-size: 28rpx;
	margin-right: 20rpx;
	width: 40rpx;
	text-align: center;
}

.info-content {
	flex: 1;
}

.info-label {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 4rpx;
	display: block;
}

.info-value {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.info-action {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.edit-btn {
	font-size: 24rpx;
	color: #1976D2;
	padding: 6rpx 12rpx;
	background-color: #E3F2FD;
	border-radius: 12rpx;
}

.arrow {
	font-size: 24rpx;
	color: #ccc;
}

.status-active {
	color: #4CAF50;
	font-weight: 500;
}

.stats-container {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 20rpx;
	display: flex;
	gap: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
	position: relative;
	z-index: 4;
}

.stat-card {
	flex: 1;
	background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
	border-radius: 16rpx;
	padding: 24rpx 16rpx;
	text-align: center;
	position: relative;
	overflow: hidden;
}

.stat-card::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 4rpx;
	background: linear-gradient(90deg, #1976D2, #42A5F5);
}

.stat-icon {
	font-size: 32rpx;
	margin-bottom: 8rpx;
	display: block;
}

.stat-content {
	display: flex;
	flex-direction: column;
}

.stat-value {
	font-size: 32rpx;
	font-weight: bold;
	color: #1976D2;
	margin-bottom: 4rpx;
}

.stat-label {
	font-size: 22rpx;
	color: #666;
}

.action-section {
	padding: 40rpx 30rpx 60rpx;
	display: flex;
	gap: 20rpx;
	position: relative;
	z-index: 3;
}

.action-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 16rpx;
	font-size: 28rpx;
	border: none;
}

.action-btn.primary {
	background-color: #007AFF;
	color: white;
}

.action-btn.secondary {
	background-color: #f8f9fa;
	color: #333;
	border: 1rpx solid #e9ecef;
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
	.header-bg {
		height: 260rpx;
	}

	.avatar-section {
		padding: 50rpx 30rpx 50rpx;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
	}

	.user-name {
		font-size: 36rpx;
	}

	.info-section {
		margin: 0 15rpx 25rpx;
	}

	.section-title {
		font-size: 28rpx;
	}

	.stats-container {
		padding: 16rpx;
		gap: 12rpx;
	}

	.stat-card {
		padding: 20rpx 12rpx;
	}
}

@media screen and (max-width: 600rpx) {
	.header-section {
		margin-bottom: 40rpx;
	}

	.avatar-section {
		flex-direction: column;
		text-align: center;
		padding: 40rpx 20rpx;
	}

	.avatar-container {
		margin-right: 0;
		margin-bottom: 20rpx;
	}

	.user-tags {
		justify-content: center;
	}
}
</style>
