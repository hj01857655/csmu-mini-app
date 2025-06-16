<template>
	<view class="test-page">
		<view class="header">
			<text class="title">配置测试页面</text>
			<text class="subtitle">验证 process.env 兼容性修复</text>
		</view>
		
		<view class="content">
			<view class="section">
				<text class="section-title">环境配置</text>
				<view class="config-item">
					<text class="label">当前环境:</text>
					<text class="value">{{ currentEnv }}</text>
				</view>
				<view class="config-item">
					<text class="label">API地址:</text>
					<text class="value">{{ apiConfig.BASE_URL }}</text>
				</view>
				<view class="config-item">
					<text class="label">模拟数据:</text>
					<text class="value">{{ apiConfig.ENABLE_MOCK ? '启用' : '禁用' }}</text>
				</view>
				<view class="config-item">
					<text class="label">超时时间:</text>
					<text class="value">{{ apiConfig.TIMEOUT }}ms</text>
				</view>
			</view>
			
			<view class="section">
				<text class="section-title">测试结果</text>
				<view class="test-result" :class="{ success: testPassed, error: !testPassed }">
					<text>{{ testMessage }}</text>
				</view>
			</view>
			
			<view class="actions">
				<button @click="runConfigTest" class="test-btn">运行配置测试</button>
				<button @click="testApiCall" class="test-btn">测试API调用</button>
				<button @click="goBack" class="back-btn">返回</button>
			</view>
		</view>
	</view>
</template>

<script>
import config from '../../config/index.js';
import apiService from '../../services/api.js';

export default {
	data() {
		return {
			currentEnv: '',
			apiConfig: {},
			testPassed: false,
			testMessage: '点击按钮开始测试'
		};
	},
	
	onLoad() {
		this.loadConfig();
	},
	
	methods: {
		loadConfig() {
			try {
				this.currentEnv = config.CURRENT_ENV;
				this.apiConfig = config.getCurrentApiConfig();
				console.log('✅ 配置加载成功:', {
					环境: this.currentEnv,
					配置: this.apiConfig
				});
			} catch (error) {
				console.error('❌ 配置加载失败:', error);
				this.testMessage = '配置加载失败: ' + error.message;
				this.testPassed = false;
			}
		},
		
		runConfigTest() {
			try {
				// 测试配置是否正常加载
				if (!this.currentEnv) {
					throw new Error('环境配置未加载');
				}
				
				if (!this.apiConfig.BASE_URL) {
					throw new Error('API配置未加载');
				}
				
				// 测试配置函数
				const themeColor = config.getThemeColor('PRIMARY_COLOR');
				if (!themeColor) {
					throw new Error('主题配置获取失败');
				}
				
				// 测试功能开关
				const rememberPassword = config.isFeatureEnabled('ENABLE_REMEMBER_PASSWORD');
				
				this.testPassed = true;
				this.testMessage = `✅ 配置测试通过！
环境: ${this.currentEnv}
API: ${this.apiConfig.BASE_URL}
主题色: ${themeColor}
记住密码: ${rememberPassword ? '启用' : '禁用'}
时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}`;
				
				uni.showToast({
					title: '配置测试通过',
					icon: 'success'
				});
				
			} catch (error) {
				this.testPassed = false;
				this.testMessage = '❌ 配置测试失败: ' + error.message;
				
				uni.showToast({
					title: '配置测试失败',
					icon: 'error'
				});
				
				console.error('配置测试失败:', error);
			}
		},
		
		async testApiCall() {
			try {
				uni.showLoading({
					title: '测试API调用...'
				});
				
				// 测试API调用（使用模拟数据）
				const result = await apiService.get('/user/profile');
				
				uni.hideLoading();
				
				if (result.success) {
					this.testPassed = true;
					this.testMessage = `✅ API调用测试通过！
返回数据: ${JSON.stringify(result.data, null, 2)}
时间: ${new Date().toLocaleString('zh-CN', { hour12: false })}`;
					
					uni.showToast({
						title: 'API测试通过',
						icon: 'success'
					});
				} else {
					throw new Error(result.message || 'API调用失败');
				}
				
			} catch (error) {
				uni.hideLoading();
				
				this.testPassed = false;
				this.testMessage = '❌ API调用测试失败: ' + error.message;
				
				uni.showToast({
					title: 'API测试失败',
					icon: 'error'
				});
				
				console.error('API调用测试失败:', error);
			}
		},
		
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style scoped>
.test-page {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.header {
	text-align: center;
	margin-bottom: 40rpx;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
	color: #1976D2;
	display: block;
	margin-bottom: 10rpx;
}

.subtitle {
	font-size: 26rpx;
	color: #666;
	display: block;
}

.content {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
}

.section {
	margin-bottom: 40rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.config-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #eee;
}

.config-item:last-child {
	border-bottom: none;
}

.label {
	font-size: 28rpx;
	color: #666;
}

.value {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	max-width: 60%;
	text-align: right;
	word-break: break-all;
}

.test-result {
	padding: 30rpx;
	border-radius: 12rpx;
	margin: 20rpx 0;
	white-space: pre-line;
	font-size: 26rpx;
	line-height: 1.5;
}

.test-result.success {
	background-color: #e8f5e8;
	color: #2e7d32;
	border: 1rpx solid #4caf50;
}

.test-result.error {
	background-color: #ffeaea;
	color: #c62828;
	border: 1rpx solid #f44336;
}

.actions {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin-top: 40rpx;
}

.test-btn {
	background-color: #1976D2;
	color: white;
	border: none;
	border-radius: 12rpx;
	padding: 24rpx;
	font-size: 30rpx;
	font-weight: 500;
}

.test-btn:active {
	background-color: #1565C0;
}

.back-btn {
	background-color: #666;
	color: white;
	border: none;
	border-radius: 12rpx;
	padding: 20rpx;
	font-size: 28rpx;
}

.back-btn:active {
	background-color: #555;
}
</style>
