<template>
	<view class="container">
		<!-- 头部区域 -->
		<view class="header-section">
			<view class="header-bg"></view>
			<view class="header-content">
				<view class="header-icon">🔒</view>
				<view class="header-title">修改密码</view>
				<view class="header-desc">为了您的账户安全，请定期更换密码</view>
			</view>
		</view>

		<!-- 密码表单 -->
		<view class="form-section">
			<view class="form-card">
				<view class="form-item">
					<view class="form-label">
						<view class="label-icon">🔑</view>
						<text class="label-text">当前密码</text>
					</view>
					<view class="input-container">
						<input
							class="form-input"
							type="password"
							v-model="passwordForm.currentPassword"
							placeholder="请输入当前密码"
							:password="!showCurrentPassword"
						/>
						<view class="password-toggle" @click="toggleCurrentPassword">
							<text class="toggle-icon">{{ showCurrentPassword ? '👁️' : '👁️‍🗨️' }}</text>
						</view>
					</view>
				</view>

				<view class="form-item">
					<view class="form-label">
						<view class="label-icon">🆕</view>
						<text class="label-text">新密码</text>
					</view>
					<view class="input-container">
						<input
							class="form-input"
							type="password"
							v-model="passwordForm.newPassword"
							placeholder="请输入新密码"
							:password="!showNewPassword"
						/>
						<view class="password-toggle" @click="toggleNewPassword">
							<text class="toggle-icon">{{ showNewPassword ? '👁️' : '👁️‍🗨️' }}</text>
						</view>
					</view>
				</view>

				<view class="form-item">
					<view class="form-label">
						<view class="label-icon">✅</view>
						<text class="label-text">确认新密码</text>
					</view>
					<view class="input-container">
						<input
							class="form-input"
							type="password"
							v-model="passwordForm.confirmPassword"
							placeholder="请再次输入新密码"
							:password="!showConfirmPassword"
						/>
						<view class="password-toggle" @click="toggleConfirmPassword">
							<text class="toggle-icon">{{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 密码强度提示 -->
		<view class="strength-section">
			<view class="strength-card">
				<view class="strength-header">
					<view class="strength-icon">💪</view>
					<view class="strength-title">密码强度</view>
					<view class="strength-badge" :class="'strength-' + passwordStrength">{{ strengthText }}</view>
				</view>
				<view class="strength-bar">
					<view class="strength-item" :class="{ active: passwordStrength >= 1, 'strength-1': passwordStrength >= 1 }"></view>
					<view class="strength-item" :class="{ active: passwordStrength >= 2, 'strength-2': passwordStrength >= 2 }"></view>
					<view class="strength-item" :class="{ active: passwordStrength >= 3, 'strength-3': passwordStrength >= 3 }"></view>
					<view class="strength-item" :class="{ active: passwordStrength >= 4, 'strength-4': passwordStrength >= 4 }"></view>
				</view>
			</view>
		</view>

		<!-- 密码要求 -->
		<view class="requirements-section">
			<view class="requirements-card">
				<view class="requirements-header">
					<view class="requirements-icon">📋</view>
					<text class="requirements-title">密码要求</text>
				</view>
				<view class="requirements-list">
					<view class="requirement-item" :class="{ valid: hasMinLength }">
						<view class="requirement-check">
							<text class="check-icon">{{ hasMinLength ? '✅' : '⭕' }}</text>
						</view>
						<text class="requirement-text">至少8个字符</text>
					</view>
					<view class="requirement-item" :class="{ valid: hasUpperCase }">
						<view class="requirement-check">
							<text class="check-icon">{{ hasUpperCase ? '✅' : '⭕' }}</text>
						</view>
						<text class="requirement-text">包含大写字母</text>
					</view>
					<view class="requirement-item" :class="{ valid: hasLowerCase }">
						<view class="requirement-check">
							<text class="check-icon">{{ hasLowerCase ? '✅' : '⭕' }}</text>
						</view>
						<text class="requirement-text">包含小写字母</text>
					</view>
					<view class="requirement-item" :class="{ valid: hasNumber }">
						<view class="requirement-check">
							<text class="check-icon">{{ hasNumber ? '✅' : '⭕' }}</text>
						</view>
						<text class="requirement-text">包含数字</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-section">
			<button class="action-btn cancel" @click="goBack">取消</button>
			<button class="action-btn confirm" @click="changePassword" :disabled="!canSubmit">确认修改</button>
		</view>
	</view>
</template>

<script>
import authService from '../../services/auth.js';

export default {
	data() {
		return {
			passwordForm: {
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
			},
			showCurrentPassword: false,
			showNewPassword: false,
			showConfirmPassword: false
		}
	},
	computed: {
		// 密码强度计算
		passwordStrength() {
			const password = this.passwordForm.newPassword;
			let strength = 0;

			if (password.length >= 8) strength++;
			if (/[A-Z]/.test(password)) strength++;
			if (/[a-z]/.test(password)) strength++;
			if (/[0-9]/.test(password)) strength++;
			if (/[^A-Za-z0-9]/.test(password)) strength++;

			return Math.min(strength, 4);
		},

		strengthText() {
			const texts = ['很弱', '较弱', '一般', '较强', '很强'];
			return texts[this.passwordStrength] || '很弱';
		},

		// 密码要求检查
		hasMinLength() {
			return this.passwordForm.newPassword.length >= 8;
		},

		hasUpperCase() {
			return /[A-Z]/.test(this.passwordForm.newPassword);
		},

		hasLowerCase() {
			return /[a-z]/.test(this.passwordForm.newPassword);
		},

		hasNumber() {
			return /[0-9]/.test(this.passwordForm.newPassword);
		},

		// 是否可以提交
		canSubmit() {
			return this.passwordForm.currentPassword &&
				   this.passwordForm.newPassword &&
				   this.passwordForm.confirmPassword &&
				   this.passwordForm.newPassword === this.passwordForm.confirmPassword &&
				   this.hasMinLength &&
				   this.passwordStrength >= 2;
		}
	},
	methods: {
		toggleCurrentPassword() {
			this.showCurrentPassword = !this.showCurrentPassword;
		},

		toggleNewPassword() {
			this.showNewPassword = !this.showNewPassword;
		},

		toggleConfirmPassword() {
			this.showConfirmPassword = !this.showConfirmPassword;
		},

		async changePassword() {
			if (!this.canSubmit) {
				uni.showToast({
					title: '请检查密码要求',
					icon: 'none'
				});
				return;
			}

			if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
				uni.showToast({
					title: '两次输入的密码不一致',
					icon: 'none'
				});
				return;
			}

			uni.showLoading({
				title: '修改中...'
			});

			try {
				// 这里应该调用后端API修改密码
				// 目前先模拟成功
				await new Promise(resolve => setTimeout(resolve, 2000));

				uni.hideLoading();
				uni.showModal({
					title: '修改成功',
					content: '密码修改成功，请重新登录',
					showCancel: false,
					success: () => {
						// 修改密码成功后，清除登录状态，跳转到登录页
						authService.logout();
					}
				});
			} catch (error) {
				uni.hideLoading();
				uni.showToast({
					title: error.message || '修改失败',
					icon: 'none'
				});
			}
		},

		goBack() {
			uni.navigateBack();
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
	margin-bottom: 30rpx;
}

.header-bg {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 280rpx;
	background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
	border-radius: 0 0 40rpx 40rpx;
}

.header-content {
	position: relative;
	z-index: 2;
	padding: 60rpx 40rpx 40rpx;
	text-align: center;
	color: white;
}

.header-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
	display: block;
}

.header-title {
	font-size: 40rpx;
	font-weight: bold;
	margin-bottom: 12rpx;
}

.header-desc {
	font-size: 26rpx;
	opacity: 0.9;
	line-height: 1.4;
}

.form-section {
	margin: 0 20rpx 30rpx;
}

.form-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}

.form-item {
	margin-bottom: 32rpx;
}

.form-item:last-child {
	margin-bottom: 0;
}

.form-label {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.label-icon {
	font-size: 24rpx;
	margin-right: 8rpx;
}

.label-text {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.input-container {
	position: relative;
}

.form-input {
	width: 100%;
	height: 96rpx;
	border: 2rpx solid #e9ecef;
	border-radius: 16rpx;
	padding: 0 80rpx 0 24rpx;
	font-size: 28rpx;
	background-color: #f8f9fa;
	transition: all 0.3s ease;
}

.form-input:focus {
	border-color: #1976D2;
	background-color: #fff;
	box-shadow: 0 0 0 4rpx rgba(25,118,210,0.1);
}

.password-toggle {
	position: absolute;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 30rpx;
	background-color: rgba(25,118,210,0.1);
	transition: background-color 0.3s ease;
}

.password-toggle:active {
	background-color: rgba(25,118,210,0.2);
}

.toggle-icon {
	font-size: 28rpx;
}

.strength-section {
	margin: 0 20rpx 30rpx;
}

.strength-card {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.05);
}

.strength-header {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.strength-icon {
	font-size: 28rpx;
	margin-right: 12rpx;
}

.strength-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	flex: 1;
}

.strength-badge {
	padding: 6rpx 16rpx;
	border-radius: 16rpx;
	font-size: 22rpx;
	font-weight: 500;
}

.strength-0 { background-color: #FFEBEE; color: #F44336; }
.strength-1 { background-color: #FFF3E0; color: #FF9800; }
.strength-2 { background-color: #FFF8E1; color: #FFC107; }
.strength-3 { background-color: #E8F5E8; color: #4CAF50; }
.strength-4 { background-color: #E3F2FD; color: #2196F3; }

.strength-bar {
	display: flex;
	gap: 8rpx;
}

.strength-item {
	flex: 1;
	height: 12rpx;
	background-color: #e9ecef;
	border-radius: 6rpx;
	transition: all 0.3s ease;
}

.strength-item.active {
	transform: scaleY(1.2);
}

.strength-item.strength-1.active { background-color: #F44336; }
.strength-item.strength-2.active { background-color: #FF9800; }
.strength-item.strength-3.active { background-color: #4CAF50; }
.strength-item.strength-4.active { background-color: #2196F3; }

.requirements-section {
	background-color: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding: 30rpx;
}

.requirements-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 20rpx;
	font-weight: 500;
}

.requirement-item {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.requirement-item:last-child {
	margin-bottom: 0;
}

.requirement-icon {
	margin-right: 12rpx;
	font-size: 24rpx;
}

.requirement-text {
	font-size: 26rpx;
	color: #666;
}

.requirement-item.valid .requirement-text {
	color: #4CAF50;
}

.action-section {
	padding: 40rpx 30rpx;
	display: flex;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 16rpx;
	font-size: 28rpx;
	border: none;
}

.action-btn.cancel {
	background-color: #f8f9fa;
	color: #333;
	border: 1rpx solid #e9ecef;
}

.action-btn.confirm {
	background-color: #007AFF;
	color: white;
}

.action-btn.confirm:disabled {
	background-color: #ccc;
	color: #999;
}
</style>
