<template>
	<view class="login-container">
		<!-- 顶部背景 -->
		<view class="header-bg">
			<view class="header-content">
				<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
				<view class="system-title">强智教务系统</view>
				<view class="system-subtitle">Kingosoft Educational Administration System</view>
			</view>
		</view>

		<!-- 登录表单 -->
		<view class="login-form">
			<view class="form-title">{{ isTeacherMode ? '教师登录' : '学生登录' }}</view>

			<!-- 登录模式切换 -->
			<view class="mode-switch">
				<view class="switch-item" :class="{ active: !isTeacherMode }" @click="switchMode(false)">
					<text class="switch-text">学生</text>
				</view>
				<view class="switch-item" :class="{ active: isTeacherMode }" @click="switchMode(true)">
					<text class="switch-text">教师</text>
				</view>
			</view>

			<view class="input-group">
				<view class="input-item" :class="{ 'has-dropdown': showHistoryDropdown }">
					<view class="input-icon">👤</view>
					<input
						class="input-field"
						type="text"
						:placeholder="isTeacherMode ? '请输入工号' : '请输入学号'"
						v-model="loginForm.studentId"
						:maxlength="isTeacherMode ? 8 : 14"
						@focus="onStudentIdFocus"
						@blur="onStudentIdBlur"
					/>
					<view class="history-toggle" @click="toggleHistoryDropdown" v-if="hasHistory">
						<text class="history-icon">{{ showHistoryDropdown ? '🔼' : '🔽' }}</text>
					</view>
				</view>

				<!-- 历史账号下拉列表 -->
				<!-- 调试信息显示 -->
				<view class="debug-info" v-if="showDebugButtons && showHistoryDropdown">
					<text class="debug-text">调试: showHistoryDropdown={{showHistoryDropdown}}, hasHistory={{hasHistory}}, 记录数={{currentHistory.length}}</text>
				</view>

				<view class="history-dropdown" v-if="showHistoryDropdown" :key="forceRenderKey" :style="{ border: showDebugButtons ? '2px solid red' : '' }">
					<view class="history-header">
						<text class="history-title">最近登录 ({{currentHistory.length}}条)</text>
						<text class="clear-history" @click="clearAllHistory" v-if="hasHistory">清空</text>
					</view>

					<!-- 强制显示测试内容 -->
					<view class="test-content" v-if="showDebugButtons">
						<text class="test-text">测试内容：这里应该能看到</text>
					</view>

					<scroll-view class="history-list" scroll-y="true" v-if="hasHistory">
						<view
							class="history-item"
							v-for="(item, index) in currentHistory"
							:key="index"
							@click="selectHistoryAccount(item)"
							:style="{ border: showDebugButtons ? '1px solid blue' : '' }"
						>
							<view class="history-info">
								<text class="history-account">{{ item.displayName || item.studentId }}</text>
								<text class="history-time">{{ formatTime(item.lastLogin) }}</text>
							</view>
							<view class="history-actions">
								<text class="delete-history" @click.stop="deleteHistoryItem(item.studentId)">🗑️</text>
							</view>
						</view>
					</scroll-view>
					<view class="no-history" v-if="!hasHistory">
						<text class="no-history-text">暂无历史登录记录</text>
						<text class="no-history-hint">成功登录后会自动保存到这里</text>
					</view>
				</view>

				<view class="input-item">
					<view class="input-icon">🔒</view>
					<input
						class="input-field"
						:type="showPassword ? 'text' : 'password'"
						placeholder="请输入密码"
						v-model="loginForm.password"
						maxlength="20"
					/>
					<view class="password-toggle" @click="togglePassword">
						{{ showPassword ? '👁️' : '👁️‍🗨️' }}
					</view>
				</view>


			</view>

			<!-- 登录选项 -->
			<view class="login-options">
				<label class="checkbox-item">
					<checkbox :checked="rememberMe" @change="onRememberChange" />
					<text class="checkbox-text">记住密码</text>
				</label>
				<text class="forgot-password" @click="showForgotPassword">忘记密码？</text>
			</view>

			<!-- 登录说明 -->
			<view class="login-hint">
				<text class="hint-text">使用教务系统学号密码登录</text>
			</view>

			<!-- 登录按钮 -->
			<button class="login-btn" @click="handleLogin" :disabled="!canLogin">
				{{ isLoading ? '登录中...' : '登录' }}
			</button>

		</view>

		<!-- 调试按钮 -->
		<view class="debug-section" v-if="showDebugButtons">
			<button class="debug-btn" @click="debugHistoryFunction">🔍 调试历史功能</button>
			<button class="debug-btn" @click="addTestHistory">➕ 添加测试历史</button>
			<button class="debug-btn" @click="clearTestHistory">🗑️ 清空历史</button>
			<button class="debug-btn" @click="forceShowDropdown">🔧 强制显示下拉框</button>
			<button class="debug-btn" @click="forceHideDropdown">❌ 强制隐藏下拉框</button>
		</view>

		<!-- 底部信息 -->
		<view class="footer">
			<view class="footer-links">
				<text class="footer-link" @click="showHelp">使用帮助</text>
				<text class="footer-divider">|</text>
				<text class="footer-link" @click="showContact">联系我们</text>
			</view>
			<view class="copyright">
				<text>© 2024 强智科技 版权所有</text>
				<text>技术支持：强智科技有限公司</text>
			</view>
		</view>

		<!-- 加载遮罩 -->
		<view class="loading-mask" v-if="isLoading">
			<view class="loading-content">
				<view class="loading-spinner"></view>
				<text class="loading-text">正在登录...</text>
			</view>
		</view>
	</view>
</template>

<script>
import authService from '../../services/auth.js';
import simpleStorage from '../../utils/simple-storage.js';


export default {
	data() {
		return {
			loginForm: {
				studentId: '',
				password: ''
			},
			showPassword: false,
			rememberMe: false,
			isLoading: false,
			isTeacherMode: false,  // 是否为教师登录模式
			showHistoryDropdown: false,  // 是否显示历史记录下拉
			currentHistory: [],  // 当前模式的历史记录
			dropdownBlurTimer: null,  // 下拉框失焦定时器
			showDebugButtons: process.env.NODE_ENV === 'development',  // 开发环境显示调试按钮
			forceRenderKey: 0  // 强制重新渲染的key
		}
	},
	computed: {
		canLogin() {
			const minLength = this.isTeacherMode ? 6 : 8;  // 教师工号6位，学号至少8位
			return this.loginForm.studentId.length >= minLength &&
				   this.loginForm.password.length >= 6 &&
				   !this.isLoading;
		},
		hasHistory() {
			return this.currentHistory.length > 0;
		}
	},
	created() {
		// 确保响应式属性正确初始化
		this.isTeacherMode = false;
		// 简单存储初始化
		this.initializeSimpleStorage();
	},
	onLoad() {
		console.log('🔍 onLoad - 页面加载开始');
		this.checkLoginStatus();
		this.loadSavedCredentials();
		this.loadHistoryAccounts();
		console.log('🔍 onLoad - 页面加载完成');
	},
	methods: {
		togglePassword() {
			this.showPassword = !this.showPassword;
		},

		onRememberChange(e) {
			this.rememberMe = e.detail.value.length > 0;
		},



		loadSavedCredentials() {
			try {
				const saved = simpleStorage.getRememberedCredentials();
				if (saved && saved.userType === (this.isTeacherMode ? 'teacher' : 'student')) {
					this.loginForm.studentId = saved.studentId || '';
					this.loginForm.password = saved.password || '';
					this.rememberMe = true;
				}
			} catch (e) {
				console.log('加载保存的凭据失败:', e);
			}
		},

		saveCredentials() {
			const userType = this.isTeacherMode ? 'teacher' : 'student';

			if (this.rememberMe) {
				// 保存记住的凭据
				simpleStorage.saveRememberedCredentials({
					studentId: this.loginForm.studentId,
					password: this.loginForm.password
				}, userType);
			} else {
				// 清除记住的凭据
				simpleStorage.clearRememberedCredentials();
			}

			// 总是添加到历史记录
			simpleStorage.addToHistory({
				studentId: this.loginForm.studentId,
				password: this.loginForm.password
			}, userType);

			// 重新加载历史记录
			this.loadHistoryAccounts();
		},

		loadHistoryAccounts() {
			const userType = this.isTeacherMode ? 'teacher' : 'student';
			console.log('🔍 loadHistoryAccounts - 用户类型:', userType);

			this.currentHistory = simpleStorage.getDecryptedHistory(userType);

			console.log('🔍 loadHistoryAccounts - 历史记录数量:', this.currentHistory.length);
			console.log('🔍 loadHistoryAccounts - 历史记录数据:', this.currentHistory);
			console.log('🔍 loadHistoryAccounts - hasHistory计算结果:', this.hasHistory);
		},

		async handleLogin() {
			if (!this.canLogin) return;

			this.isLoading = true;

			try {
				const credentials = {
					username: this.loginForm.studentId,
					password: this.loginForm.password
				};

				// 使用教务系统登录
				const result = await authService.login(credentials);

				if (result.success) {

					// 保存凭据
					this.saveCredentials();

					uni.showToast({
						title: '登录成功',
						icon: 'success'
					});

					// 跳转到首页
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/home/home'
						});
					}, 1500);
				} else {
					throw new Error(result.message);
				}

			} catch (error) {
				console.error('登录失败:', error);
				uni.showToast({
					title: error.message || '登录失败',
					icon: 'none'
				});
			} finally {
				this.isLoading = false;
			}
		},

		checkLoginStatus() {
			// 检查是否已登录
			if (authService.isLoggedIn()) {
				console.log('用户已登录，跳转到首页');
				uni.switchTab({
					url: '/pages/home/home'
				});
			}
		},



		// 切换登录模式
		switchMode(isTeacher) {
			this.isTeacherMode = isTeacher;
			// 清空输入框
			this.loginForm.studentId = '';
			this.loginForm.password = '';
			this.rememberMe = false;
			this.showHistoryDropdown = false;

			// 重新加载对应模式的历史记录和保存的凭据
			this.loadHistoryAccounts();
			this.loadSavedCredentials();
		},

		// 历史账号相关方法
		toggleHistoryDropdown() {
			console.log('🔍 toggleHistoryDropdown - 点击前状态:', this.showHistoryDropdown);
			console.log('🔍 toggleHistoryDropdown - hasHistory:', this.hasHistory);
			console.log('🔍 toggleHistoryDropdown - currentHistory长度:', this.currentHistory.length);

			// 先加载历史记录，确保数据是最新的
			this.loadHistoryAccounts();

			// 强制重新渲染
			this.forceRenderKey++;

			// 使用nextTick确保数据更新后再切换显示状态
			this.$nextTick(() => {
				this.showHistoryDropdown = !this.showHistoryDropdown;
				console.log('🔍 toggleHistoryDropdown - 点击后状态:', this.showHistoryDropdown);
				console.log('🔍 toggleHistoryDropdown - forceRenderKey:', this.forceRenderKey);

				// 再次强制更新
				this.$forceUpdate();
			});
		},

		onStudentIdFocus() {
			// 清除失焦定时器
			if (this.dropdownBlurTimer) {
				clearTimeout(this.dropdownBlurTimer);
				this.dropdownBlurTimer = null;
			}
		},

		onStudentIdBlur() {
			// 延迟隐藏下拉框，给用户时间点击历史记录
			this.dropdownBlurTimer = setTimeout(() => {
				this.showHistoryDropdown = false;
			}, 200);
		},

		selectHistoryAccount(item) {
			this.loginForm.studentId = item.studentId;
			this.loginForm.password = item.password;
			this.showHistoryDropdown = false;

			uni.showToast({
				title: '已填充历史账号',
				icon: 'success',
				duration: 1500
			});
		},

		deleteHistoryItem(studentId) {
			const userType = this.isTeacherMode ? 'teacher' : 'student';
			simpleStorage.removeFromHistory(studentId, userType);
			this.loadHistoryAccounts();

			uni.showToast({
				title: '已删除',
				icon: 'success',
				duration: 1000
			});
		},

		clearAllHistory() {
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有历史登录记录吗？',
				success: (res) => {
					if (res.confirm) {
						const userType = this.isTeacherMode ? 'teacher' : 'student';
						simpleStorage.clearHistory(userType);
						this.loadHistoryAccounts();
						this.showHistoryDropdown = false;

						uni.showToast({
							title: '已清空历史记录',
							icon: 'success'
						});
					}
				}
			});
		},

		formatTime(timestamp) {
			const date = new Date(timestamp);
			const now = new Date();
			const diff = now - date;

			if (diff < 24 * 60 * 60 * 1000) {
				// 24小时内显示时间
				return date.toLocaleTimeString('zh-CN', {
					hour: '2-digit',
					minute: '2-digit'
				});
			} else if (diff < 7 * 24 * 60 * 60 * 1000) {
				// 7天内显示几天前
				const days = Math.floor(diff / (24 * 60 * 60 * 1000));
				return `${days}天前`;
			} else {
				// 超过7天显示日期
				return date.toLocaleDateString('zh-CN', {
					month: '2-digit',
					day: '2-digit'
				});
			}
		},

		// 初始化简单存储
		async initializeSimpleStorage() {
			try {
				// 清理过期数据
				const cleanSuccess = simpleStorage.migrateAndValidateData();
				if (cleanSuccess) {
					console.info('简单存储初始化成功');
				}

				// 验证存储完整性
				simpleStorage.validateStorageIntegrity();
			} catch (e) {
				console.error('简单存储初始化失败:', e);
				// 即使初始化失败，也不影响正常登录功能
			}
		},

			// 调试方法
			debugHistoryFunction() {
				console.group('🔍 历史功能调试信息');

				const userType = this.isTeacherMode ? 'teacher' : 'student';
				console.log('当前用户类型:', userType);
				console.log('showHistoryDropdown:', this.showHistoryDropdown);
				console.log('currentHistory:', this.currentHistory);
				console.log('hasHistory:', this.hasHistory);

				// 检查本地存储
				const storageKey = `csmu_login_history_${userType}`;
				const rawData = uni.getStorageSync(storageKey);
				console.log('本地存储键:', storageKey);
				console.log('本地存储原始数据:', rawData);

				// 重新加载历史记录
				this.loadHistoryAccounts();

				console.groupEnd();

				uni.showModal({
					title: '调试信息',
					content: `用户类型: ${userType}\n历史记录数量: ${this.currentHistory.length}\nhasHistory: ${this.hasHistory}\n\n详细信息请查看控制台`,
					showCancel: false
				});
			},

			addTestHistory() {
				const userType = this.isTeacherMode ? 'teacher' : 'student';
				const testAccount = {
					studentId: userType === 'teacher' ? 'T001' : '2021001001',
					password: 'test123456'
				};

				simpleStorage.addToHistory(testAccount, userType);
				this.loadHistoryAccounts();

				// 强制显示下拉框来测试
				this.showHistoryDropdown = true;
				this.forceRenderKey++;

				uni.showToast({
					title: '已添加测试历史记录并显示下拉框',
					icon: 'success'
				});
			},

			clearTestHistory() {
				const userType = this.isTeacherMode ? 'teacher' : 'student';
				simpleStorage.clearHistory(userType);
				this.loadHistoryAccounts();

				uni.showToast({
					title: '已清空历史记录',
					icon: 'success'
				});
			},

			forceShowDropdown() {
				console.log('🔧 强制显示下拉框');
				this.showHistoryDropdown = true;
				this.forceRenderKey++;
				this.$forceUpdate();

				uni.showToast({
					title: '强制显示下拉框',
					icon: 'none'
				});
			},

			forceHideDropdown() {
				console.log('❌ 强制隐藏下拉框');
				this.showHistoryDropdown = false;
				this.forceRenderKey++;
				this.$forceUpdate();

				uni.showToast({
					title: '强制隐藏下拉框',
					icon: 'none'
				});
			},







		showForgotPassword() {
			uni.showModal({
				title: '忘记密码',
				content: '请联系教务处或班主任重置密码\n电话：0571-12345678',
				showCancel: false
			});
		},

		showHelp() {
			uni.showModal({
				title: '使用帮助',
				content: '1. 学号为您的学籍号\n2. 初始密码通常为身份证后6位\n3. 如有问题请联系教务处',
				showCancel: false
			});
		},

		showContact() {
			uni.showModal({
				title: '联系我们',
				content: '教务处电话：0571-12345678\n技术支持：support@kingosoft.com',
				showCancel: false
			});
		},


	}
}
</script>

<style scoped>
.login-container {
	min-height: 100vh;
	background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
	position: relative;
}

.header-bg {
	padding: 80rpx 40rpx 60rpx;
	text-align: center;
}

.logo {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 30rpx;
}

.system-title {
	font-size: 48rpx;
	font-weight: bold;
	color: white;
	margin-bottom: 10rpx;
}

.system-subtitle {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	letter-spacing: 1rpx;
}

.login-form {
	background-color: white;
	margin: 0 40rpx 120rpx;
	border-radius: 20rpx;
	padding: 50rpx 40rpx;
	box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.form-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	text-align: center;
	margin-bottom: 30rpx;
}

.mode-switch {
	display: flex;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	padding: 6rpx;
	margin-bottom: 40rpx;
}

.switch-item {
	flex: 1;
	text-align: center;
	padding: 16rpx 20rpx;
	border-radius: 8rpx;
	transition: all 0.3s ease;
}

.switch-item.active {
	background-color: #1976D2;
	color: white;
}

.switch-text {
	font-size: 26rpx;
	font-weight: 500;
}

.input-group {
	margin-bottom: 40rpx;
}

.input-item {
	display: flex;
	align-items: center;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	border: 2rpx solid transparent;
	position: relative;
}

.input-item:focus-within {
	border-color: #1976D2;
	background-color: #FFF;
}

.input-item.has-dropdown {
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
}

.input-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
	width: 40rpx;
	text-align: center;
}

.input-field {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.password-toggle {
	font-size: 28rpx;
	padding: 10rpx;
	color: #666;
}

.history-toggle {
	padding: 10rpx;
	color: #666;
	cursor: pointer;
	transition: color 0.3s ease;
}

.history-toggle:active {
	color: #1976D2;
}

.history-icon {
	font-size: 24rpx;
}

.history-dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background-color: white;
	border: 2rpx solid #1976D2;
	border-top: none;
	border-radius: 0 0 12rpx 12rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
	z-index: 1000;
	max-height: 300rpx;
	overflow: hidden;
}

.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	background-color: #f8f9fa;
}

.history-title {
	font-size: 24rpx;
	color: #666;
	font-weight: 500;
}

.clear-history {
	font-size: 22rpx;
	color: #1976D2;
	padding: 6rpx 12rpx;
	border-radius: 6rpx;
	background-color: rgba(25,118,210,0.1);
}

.history-list {
	max-height: 240rpx;
}

.history-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	transition: background-color 0.3s ease;
}

.history-item:last-child {
	border-bottom: none;
}

.history-item:active {
	background-color: #f8f9fa;
}

.history-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.history-account {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 4rpx;
}

.history-time {
	font-size: 22rpx;
	color: #999;
}

.history-actions {
	display: flex;
	align-items: center;
}

.delete-history {
	font-size: 24rpx;
	padding: 8rpx;
	color: #999;
	transition: color 0.3s ease;
}

.delete-history:active {
	color: #f44336;
}

.no-history {
	padding: 40rpx 20rpx;
	text-align: center;
}

.no-history-text {
	font-size: 26rpx;
	color: #666;
	display: block;
	margin-bottom: 10rpx;
}

.no-history-hint {
	font-size: 22rpx;
	color: #999;
	display: block;
}

/* 调试样式 */
.debug-info {
	background-color: yellow;
	padding: 10rpx;
	margin: 10rpx 0;
	border: 1rpx solid red;
}

.debug-text {
	font-size: 20rpx;
	color: red;
}

.test-content {
	background-color: lightgreen;
	padding: 20rpx;
	text-align: center;
}

.test-text {
	font-size: 24rpx;
	color: darkgreen;
	font-weight: bold;
}

/* 调试按钮样式 */
.debug-section {
	margin: 20rpx 40rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}

.debug-btn {
	background-color: #FF9800;
	color: white;
	border: none;
	border-radius: 8rpx;
	padding: 12rpx 24rpx;
	font-size: 24rpx;
	opacity: 0.8;
	margin-bottom: 10rpx;
}

/* 开发环境测试按钮 */
.dev-test-section {
	margin: 20rpx 40rpx;
	text-align: center;
}

.test-btn {
	background-color: #FF9800;
	color: white;
	border: none;
	border-radius: 8rpx;
	padding: 12rpx 24rpx;
	font-size: 24rpx;
	opacity: 0.8;
}

.login-hint {
	text-align: center;
	margin-bottom: 30rpx;
}

.hint-text {
	font-size: 24rpx;
	color: #666;
	line-height: 1.4;
}



.login-options {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
}

.checkbox-item {
	display: flex;
	align-items: center;
}

.checkbox-text {
	font-size: 26rpx;
	color: #666;
	margin-left: 10rpx;
}

.forgot-password {
	font-size: 26rpx;
	color: #1976D2;
}

.login-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #1976D2, #42A5F5);
	color: white;
	border: none;
	border-radius: 12rpx;
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 0;
}

.login-btn:disabled {
	background: #CCCCCC;
}



.footer {
	position: absolute;
	bottom: 40rpx;
	left: 0;
	right: 0;
	text-align: center;
}

.footer-links {
	margin-bottom: 20rpx;
}

.footer-link {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.footer-divider {
	margin: 0 20rpx;
	color: rgba(255, 255, 255, 0.6);
}

.copyright {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.6);
	line-height: 1.5;
}

.loading-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
}

.loading-content {
	background-color: white;
	padding: 60rpx;
	border-radius: 20rpx;
	text-align: center;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid #f3f3f3;
	border-top: 4rpx solid #1976D2;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin: 0 auto 20rpx;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.loading-text {
	font-size: 28rpx;
	color: #666;
}
</style>
