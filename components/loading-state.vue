<template>
	<view class="loading-state-container">
		<!-- 加载中状态 -->
		<view v-if="state === 'loading'" class="loading-content">
			<view class="loading-spinner">
				<view class="spinner-ring"></view>
			</view>
			<text class="loading-text">{{ loadingText }}</text>
		</view>

		<!-- 错误状态 -->
		<view v-else-if="state === 'error'" class="error-content">
			<view class="error-icon">⚠️</view>
			<text class="error-title">{{ errorTitle }}</text>
			<text class="error-message">{{ errorMessage }}</text>
			<button class="retry-btn" @click="handleRetry">重试</button>
		</view>

		<!-- 空数据状态 -->
		<view v-else-if="state === 'empty'" class="empty-content">
			<view class="empty-icon">{{ emptyIcon }}</view>
			<text class="empty-title">{{ emptyTitle }}</text>
			<text class="empty-message">{{ emptyMessage }}</text>
			<button v-if="showRefreshButton" class="refresh-btn" @click="handleRefresh">刷新</button>
		</view>

		<!-- 成功状态 - 显示内容 -->
		<view v-else-if="state === 'success'" class="success-content">
			<slot></slot>
		</view>

		<!-- 网络错误状态 -->
		<view v-else-if="state === 'network-error'" class="network-error-content">
			<view class="network-error-icon">📡</view>
			<text class="network-error-title">网络连接失败</text>
			<text class="network-error-message">请检查网络设置后重试</text>
			<view class="network-error-actions">
				<button class="retry-btn" @click="handleRetry">重试</button>
				<button class="settings-btn" @click="openNetworkSettings">网络设置</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'LoadingState',
	props: {
		// 当前状态: loading, success, error, empty, network-error
		state: {
			type: String,
			default: 'loading',
			validator: value => ['loading', 'success', 'error', 'empty', 'network-error'].includes(value)
		},
		// 加载文本
		loadingText: {
			type: String,
			default: '加载中...'
		},
		// 错误标题
		errorTitle: {
			type: String,
			default: '加载失败'
		},
		// 错误消息
		errorMessage: {
			type: String,
			default: '数据加载失败，请重试'
		},
		// 空数据图标
		emptyIcon: {
			type: String,
			default: '📄'
		},
		// 空数据标题
		emptyTitle: {
			type: String,
			default: '暂无数据'
		},
		// 空数据消息
		emptyMessage: {
			type: String,
			default: '当前没有相关数据'
		},
		// 是否显示刷新按钮
		showRefreshButton: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		handleRetry() {
			this.$emit('retry');
		},
		handleRefresh() {
			this.$emit('refresh');
		},
		openNetworkSettings() {
			// 尝试打开网络设置
			// #ifdef APP-PLUS
			plus.runtime.openURL('app-settings:');
			// #endif
			
			// #ifdef H5
			uni.showModal({
				title: '网络设置',
				content: '请在浏览器设置中检查网络连接',
				showCancel: false
			});
			// #endif
			
			// #ifdef MP-WEIXIN
			uni.showModal({
				title: '网络设置',
				content: '请检查微信网络权限设置',
				showCancel: false
			});
			// #endif
		}
	}
}
</script>

<style scoped>
.loading-state-container {
	width: 100%;
	min-height: 400rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.loading-content,
.error-content,
.empty-content,
.network-error-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 60rpx 40rpx;
	text-align: center;
}

/* 加载状态样式 */
.loading-spinner {
	width: 80rpx;
	height: 80rpx;
	margin-bottom: 30rpx;
	position: relative;
}

.spinner-ring {
	width: 100%;
	height: 100%;
	border: 6rpx solid #f3f3f3;
	border-top: 6rpx solid #1976D2;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.loading-text {
	font-size: 28rpx;
	color: #666;
	margin-top: 20rpx;
}

/* 错误状态样式 */
.error-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
}

.error-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.error-message {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 40rpx;
	line-height: 1.5;
}

.retry-btn {
	background-color: #1976D2;
	color: white;
	border: none;
	border-radius: 25rpx;
	padding: 20rpx 40rpx;
	font-size: 28rpx;
	min-width: 160rpx;
}

.retry-btn:active {
	background-color: #1565C0;
}

/* 空数据状态样式 */
.empty-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
	opacity: 0.6;
}

.empty-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.empty-message {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 40rpx;
	line-height: 1.5;
}

.refresh-btn {
	background-color: #f5f5f5;
	color: #666;
	border: 1rpx solid #ddd;
	border-radius: 25rpx;
	padding: 20rpx 40rpx;
	font-size: 28rpx;
	min-width: 160rpx;
}

.refresh-btn:active {
	background-color: #e0e0e0;
}

/* 网络错误状态样式 */
.network-error-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
	opacity: 0.8;
}

.network-error-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.network-error-message {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 40rpx;
	line-height: 1.5;
}

.network-error-actions {
	display: flex;
	gap: 20rpx;
}

.settings-btn {
	background-color: #FF9800;
	color: white;
	border: none;
	border-radius: 25rpx;
	padding: 20rpx 40rpx;
	font-size: 28rpx;
	min-width: 160rpx;
}

.settings-btn:active {
	background-color: #F57C00;
}

/* 成功状态样式 */
.success-content {
	width: 100%;
}

/* 响应式适配 */
@media (max-width: 750rpx) {
	.loading-state-container {
		min-height: 300rpx;
	}
	
	.loading-content,
	.error-content,
	.empty-content,
	.network-error-content {
		padding: 40rpx 20rpx;
	}
	
	.loading-spinner {
		width: 60rpx;
		height: 60rpx;
	}
	
	.error-icon,
	.empty-icon,
	.network-error-icon {
		font-size: 100rpx;
	}
	
	.network-error-actions {
		flex-direction: column;
		width: 100%;
	}
	
	.retry-btn,
	.refresh-btn,
	.settings-btn {
		width: 100%;
		margin-bottom: 10rpx;
	}
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
	.loading-text,
	.error-message,
	.empty-message,
	.network-error-message {
		color: #ccc;
	}
	
	.error-title,
	.empty-title,
	.network-error-title {
		color: #fff;
	}
	
	.refresh-btn {
		background-color: #333;
		color: #ccc;
		border-color: #555;
	}
	
	.refresh-btn:active {
		background-color: #444;
	}
}
</style>
