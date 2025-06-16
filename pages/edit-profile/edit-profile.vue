<template>
	<view class="container">
		<!-- 头部区域 -->
		<view class="header-section">
			<view class="header-bg"></view>
			<view class="header-content">
				<view class="header-icon">{{ getFieldIcon() }}</view>
				<view class="header-title">编辑{{ fieldName }}</view>
				<view class="header-desc">请输入准确的{{ fieldName }}信息</view>
			</view>
		</view>

		<!-- 编辑表单 -->
		<view class="form-section">
			<view class="form-card">
				<view class="form-item">
					<view class="form-label">
						<view class="label-icon">{{ getFieldIcon() }}</view>
						<text class="label-text">{{ fieldName }}</text>
						<view class="char-count" v-if="showCharCount">{{ inputValue.length }}/{{ maxLength }}</view>
					</view>
					<view class="input-container">
						<input
							class="form-input"
							:type="inputType"
							v-model="inputValue"
							:placeholder="placeholder"
							:maxlength="maxLength"
							@input="onInput"
							@focus="onFocus"
							@blur="onBlur"
						/>
						<view class="input-status" v-if="inputValue">
							<text class="status-icon">{{ isValid ? '✅' : '❌' }}</text>
						</view>
					</view>
					<view class="validation-message" v-if="inputValue && !isValid">
						<text class="error-text">{{ getValidationMessage() }}</text>
					</view>
				</view>

				<view class="tip-section" v-if="tipText">
					<view class="tip-icon">💡</view>
					<view class="tip-content">
						<text class="tip-text">{{ tipText }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-section">
			<button class="action-btn cancel" @click="goBack">取消</button>
			<button class="action-btn confirm" @click="saveChanges" :disabled="!canSave">保存</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			field: '',
			originalValue: '',
			inputValue: '',
			fieldConfigs: {
				phone: {
					name: '手机号',
					type: 'number',
					placeholder: '请输入手机号',
					maxLength: 11,
					tip: '手机号用于接收重要通知和找回密码',
					pattern: /^1[3-9]\d{9}$/
				},
				email: {
					name: '邮箱',
					type: 'text',
					placeholder: '请输入邮箱地址',
					maxLength: 50,
					tip: '邮箱用于接收学习通知和重要信息',
					pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
				}
			}
		}
	},
	computed: {
		currentConfig() {
			return this.fieldConfigs[this.field] || {};
		},
		fieldName() {
			return this.currentConfig.name || '';
		},
		inputType() {
			return this.currentConfig.type || 'text';
		},
		placeholder() {
			return this.currentConfig.placeholder || '';
		},
		maxLength() {
			return this.currentConfig.maxLength || 100;
		},
		tipText() {
			return this.currentConfig.tip || '';
		},
		showCharCount() {
			return this.maxLength <= 100;
		},
		canSave() {
			if (!this.inputValue.trim()) return false;
			if (this.inputValue === this.originalValue) return false;
			if (this.currentConfig.pattern) {
				return this.currentConfig.pattern.test(this.inputValue);
			}
			return true;
		},
		isValid() {
			if (!this.inputValue.trim()) return true;
			if (this.currentConfig.pattern) {
				return this.currentConfig.pattern.test(this.inputValue);
			}
			return true;
		}
	},
	onLoad(options) {
		this.field = options.field || '';
		this.originalValue = decodeURIComponent(options.value || '');
		this.inputValue = this.originalValue;
	},
	methods: {
		async saveChanges() {
			if (!this.canSave) {
				uni.showToast({
					title: '请输入有效的' + this.fieldName,
					icon: 'none'
				});
				return;
			}

			// 验证格式
			if (this.currentConfig.pattern && !this.currentConfig.pattern.test(this.inputValue)) {
				uni.showToast({
					title: this.fieldName + '格式不正确',
					icon: 'none'
				});
				return;
			}

			uni.showLoading({
				title: '保存中...'
			});

			try {
				// 这里应该调用后端API保存数据
				// 目前先模拟成功
				await new Promise(resolve => setTimeout(resolve, 1500));

				uni.hideLoading();
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				});

				// 返回上一页并传递更新的数据
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			} catch (error) {
				uni.hideLoading();
				uni.showToast({
					title: error.message || '保存失败',
					icon: 'none'
				});
			}
		},

		getFieldIcon() {
			const icons = {
				phone: '📱',
				email: '📧'
			};
			return icons[this.field] || '📝';
		},

		getValidationMessage() {
			if (this.field === 'phone') {
				return '请输入正确的手机号格式';
			} else if (this.field === 'email') {
				return '请输入正确的邮箱格式';
			}
			return '输入格式不正确';
		},

		onInput() {
			// 可以在这里添加实时验证逻辑
		},

		onFocus() {
			// 输入框获得焦点时的处理
		},

		onBlur() {
			// 输入框失去焦点时的处理
		},

		goBack() {
			if (this.inputValue !== this.originalValue) {
				uni.showModal({
					title: '确认离开',
					content: '您有未保存的更改，确定要离开吗？',
					success: (res) => {
						if (res.confirm) {
							uni.navigateBack();
						}
					}
				});
			} else {
				uni.navigateBack();
			}
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
	margin-bottom: 30rpx;
}

.form-label {
	display: flex;
	align-items: center;
	justify-content: space-between;
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
	flex: 1;
}

.char-count {
	font-size: 22rpx;
	color: #999;
	background-color: #f8f9fa;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
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

.input-status {
	position: absolute;
	right: 20rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.status-icon {
	font-size: 24rpx;
}

.validation-message {
	margin-top: 12rpx;
	padding: 12rpx 16rpx;
	background-color: #FFEBEE;
	border-radius: 12rpx;
	border-left: 4rpx solid #F44336;
}

.error-text {
	font-size: 24rpx;
	color: #F44336;
}

.tip-section {
	background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
	margin-top: 30rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: flex-start;
	border-left: 4rpx solid #1976D2;
}

.tip-icon {
	font-size: 32rpx;
	margin-right: 16rpx;
	margin-top: 2rpx;
}

.tip-content {
	flex: 1;
}

.tip-text {
	font-size: 26rpx;
	color: #1976D2;
	line-height: 1.5;
	font-weight: 500;
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
