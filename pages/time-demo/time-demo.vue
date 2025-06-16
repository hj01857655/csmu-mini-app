<template>
	<view class="container">
		<view class="header">
			<text class="title">时间格式修正演示</text>
			<text class="subtitle">对比修正前后的时间显示效果</text>
		</view>

		<view class="demo-section">
			<view class="section-title">❌ 修正前（有问题的格式）</view>
			<view class="demo-card problem">
				<view class="demo-item">
					<text class="label">凌晨时间：</text>
					<text class="value">{{ problemFormats.midnight }}</text>
					<text class="issue">← 容易混淆</text>
				</view>
				<view class="demo-item">
					<text class="label">中午时间：</text>
					<text class="value">{{ problemFormats.noon }}</text>
				</view>
				<view class="demo-item">
					<text class="label">深夜时间：</text>
					<text class="value">{{ problemFormats.night }}</text>
				</view>
			</view>
		</view>

		<view class="demo-section">
			<view class="section-title">✅ 修正后（24小时制格式）</view>
			<view class="demo-card fixed">
				<view class="demo-item">
					<text class="label">凌晨时间：</text>
					<text class="value">{{ fixedFormats.midnight }}</text>
					<text class="check">← 清晰明确</text>
				</view>
				<view class="demo-item">
					<text class="label">中午时间：</text>
					<text class="value">{{ fixedFormats.noon }}</text>
				</view>
				<view class="demo-item">
					<text class="label">深夜时间：</text>
					<text class="value">{{ fixedFormats.night }}</text>
				</view>
			</view>
		</view>

		<view class="demo-section">
			<view class="section-title">🎯 多种格式选择</view>
			<view class="demo-card formats">
				<view class="demo-item">
					<text class="label">标准格式：</text>
					<text class="value">{{ currentFormats.standard }}</text>
				</view>
				<view class="demo-item">
					<text class="label">中文格式：</text>
					<text class="value">{{ currentFormats.chinese }}</text>
				</view>
				<view class="demo-item">
					<text class="label">ISO格式：</text>
					<text class="value">{{ currentFormats.iso }}</text>
				</view>
				<view class="demo-item">
					<text class="label">仅时间：</text>
					<text class="value">{{ currentFormats.timeOnly }}</text>
				</view>
				<view class="demo-item">
					<text class="label">相对时间：</text>
					<text class="value">{{ currentFormats.relative }}</text>
				</view>
			</view>
		</view>

		<view class="demo-section">
			<view class="section-title">⏰ 实时时间显示</view>
			<view class="demo-card realtime">
				<view class="time-display">
					<text class="current-time">{{ realtimeDisplay }}</text>
					<text class="update-info">每秒更新</text>
				</view>
			</view>
		</view>

		<view class="action-section">
			<button class="refresh-btn" @click="refreshFormats">刷新格式</button>
			<button class="test-btn" @click="goToTest">周次测试</button>
		</view>
	</view>
</template>

<script>
import dateFormatter from '../../utils/date-formatter.js';

export default {
	data() {
		return {
			problemFormats: {},
			fixedFormats: {},
			currentFormats: {},
			realtimeDisplay: '',
			timer: null
		}
	},

	onLoad() {
		this.initFormats();
		this.startRealtimeUpdate();
	},

	onUnload() {
		this.stopRealtimeUpdate();
	},

	methods: {
		initFormats() {
			// 创建测试时间点
			const midnight = new Date(2025, 5, 16, 0, 54, 42); // 凌晨00:54:42
			const noon = new Date(2025, 5, 16, 12, 30, 15);    // 中午12:30:15
			const night = new Date(2025, 5, 16, 23, 45, 30);   // 深夜23:45:30
			const now = new Date();

			// 问题格式（12小时制）
			this.problemFormats = {
				midnight: midnight.toLocaleString('zh-CN'), // 会显示"上午12:54:42"
				noon: noon.toLocaleString('zh-CN'),
				night: night.toLocaleString('zh-CN')
			};

			// 修正格式（24小时制）
			this.fixedFormats = {
				midnight: dateFormatter.formatDateTime(midnight, 'chinese'),
				noon: dateFormatter.formatDateTime(noon, 'chinese'),
				night: dateFormatter.formatDateTime(night, 'chinese')
			};

			// 当前时间的多种格式
			this.currentFormats = {
				standard: dateFormatter.formatDateTime(now, 'standard'),
				chinese: dateFormatter.formatDateTime(now, 'chinese'),
				iso: dateFormatter.formatDateTime(now, 'iso'),
				timeOnly: dateFormatter.formatTime(now),
				relative: dateFormatter.formatRelativeTime(now)
			};
		},

		refreshFormats() {
			this.initFormats();
			uni.showToast({
				title: '格式已刷新',
				icon: 'success',
				duration: 1500
			});
		},

		startRealtimeUpdate() {
			this.updateRealtimeDisplay();
			this.timer = setInterval(() => {
				this.updateRealtimeDisplay();
			}, 1000);
		},

		stopRealtimeUpdate() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},

		updateRealtimeDisplay() {
			this.realtimeDisplay = dateFormatter.formatDateTime(new Date(), 'chinese');
		},

		goToTest() {
			uni.navigateTo({
				url: '/pages/test-week/test-week'
			});
		}
	}
}
</script>

<style scoped>
.container {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	text-align: center;
	margin-bottom: 30rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 10rpx;
}

.subtitle {
	font-size: 26rpx;
	color: #666;
}

.demo-section {
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: bold;
	margin-bottom: 16rpx;
	color: #333;
}

.demo-card {
	background-color: white;
	border-radius: 12rpx;
	padding: 24rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.demo-card.problem {
	border-left: 6rpx solid #F44336;
}

.demo-card.fixed {
	border-left: 6rpx solid #4CAF50;
}

.demo-card.formats {
	border-left: 6rpx solid #2196F3;
}

.demo-card.realtime {
	border-left: 6rpx solid #FF9800;
}

.demo-item {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.demo-item:last-child {
	margin-bottom: 0;
}

.label {
	width: 160rpx;
	font-size: 26rpx;
	color: #666;
	flex-shrink: 0;
}

.value {
	flex: 1;
	font-size: 26rpx;
	color: #333;
	font-family: 'Courier New', monospace;
	background-color: #f8f9fa;
	padding: 8rpx 12rpx;
	border-radius: 6rpx;
	margin-right: 10rpx;
}

.issue {
	font-size: 22rpx;
	color: #F44336;
	font-weight: bold;
}

.check {
	font-size: 22rpx;
	color: #4CAF50;
	font-weight: bold;
}

.time-display {
	text-align: center;
}

.current-time {
	font-size: 32rpx;
	font-weight: bold;
	color: #FF9800;
	display: block;
	margin-bottom: 10rpx;
	font-family: 'Courier New', monospace;
}

.update-info {
	font-size: 22rpx;
	color: #999;
}

.action-section {
	display: flex;
	gap: 20rpx;
}

.refresh-btn, .test-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	border: none;
}

.refresh-btn {
	background-color: #2196F3;
	color: white;
}

.test-btn {
	background-color: #4CAF50;
	color: white;
}
</style>
