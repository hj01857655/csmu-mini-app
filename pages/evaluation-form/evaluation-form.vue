<template>
	<view class="form-container">
		<!-- 课程信息 -->
		<view class="course-info">
			<view class="info-header">
				<text class="course-name">{{ courseInfo.courseName }}</text>
				<text class="course-teacher">{{ courseInfo.teacher }}</text>
			</view>
			<view class="info-details">
				<text class="detail-text">课程代码：{{ courseInfo.courseCode }}</text>
				<text class="detail-text">学分：{{ courseInfo.credit }}学分</text>
				<text class="detail-text">评价类型：{{ courseInfo.evaluationType }}</text>
			</view>
		</view>
		
		<!-- 评价表单 -->
		<view class="evaluation-form">
			<!-- 教学态度评价 -->
			<view class="section">
				<view class="section-title">教学态度 (30分)</view>
				<view class="question-group">
					<view class="question-item" v-for="(question, index) in teachingAttitude" :key="index">
						<view class="question-text">{{ question.text }}</view>
						<view class="rating-group">
							<view class="rating-item" 
								  v-for="score in [5,4,3,2,1]" 
								  :key="score"
								  :class="{ active: question.score === score }"
								  @click="setScore('teachingAttitude', index, score)">
								<text class="rating-score">{{ score }}</text>
								<text class="rating-label">{{ getRatingLabel(score) }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 教学内容评价 -->
			<view class="section">
				<view class="section-title">教学内容 (40分)</view>
				<view class="question-group">
					<view class="question-item" v-for="(question, index) in teachingContent" :key="index">
						<view class="question-text">{{ question.text }}</view>
						<view class="rating-group">
							<view class="rating-item" 
								  v-for="score in [5,4,3,2,1]" 
								  :key="score"
								  :class="{ active: question.score === score }"
								  @click="setScore('teachingContent', index, score)">
								<text class="rating-score">{{ score }}</text>
								<text class="rating-label">{{ getRatingLabel(score) }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 教学方法评价 -->
			<view class="section">
				<view class="section-title">教学方法 (30分)</view>
				<view class="question-group">
					<view class="question-item" v-for="(question, index) in teachingMethod" :key="index">
						<view class="question-text">{{ question.text }}</view>
						<view class="rating-group">
							<view class="rating-item" 
								  v-for="score in [5,4,3,2,1]" 
								  :key="score"
								  :class="{ active: question.score === score }"
								  @click="setScore('teachingMethod', index, score)">
								<text class="rating-score">{{ score }}</text>
								<text class="rating-label">{{ getRatingLabel(score) }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 总体评价 -->
			<view class="section">
				<view class="section-title">总体评价</view>
				<view class="overall-rating">
					<view class="overall-question">您对这门课程的总体满意度：</view>
					<view class="overall-options">
						<view class="overall-item" 
							  v-for="option in overallOptions" 
							  :key="option.value"
							  :class="{ active: overallRating === option.value }"
							  @click="setOverallRating(option.value)">
							<text class="overall-text">{{ option.label }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 建议和意见 -->
			<view class="section">
				<view class="section-title">建议和意见 (选填)</view>
				<textarea class="suggestion-input" 
						  v-model="suggestion"
						  placeholder="请写下您对课程或教师的建议和意见，帮助我们改进教学质量..."
						  maxlength="500"></textarea>
				<view class="char-count">{{ suggestion.length }}/500</view>
			</view>
		</view>
		
		<!-- 评分统计 -->
		<view class="score-summary">
			<view class="summary-title">评分统计</view>
			<view class="summary-grid">
				<view class="summary-item">
					<text class="summary-label">教学态度</text>
					<text class="summary-score">{{ attitudeScore }}/30</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">教学内容</text>
					<text class="summary-score">{{ contentScore }}/40</text>
				</view>
				<view class="summary-item">
					<text class="summary-label">教学方法</text>
					<text class="summary-score">{{ methodScore }}/30</text>
				</view>
				<view class="summary-item total">
					<text class="summary-label">总分</text>
					<text class="summary-score">{{ totalScore }}/100</text>
				</view>
			</view>
		</view>
		
		<!-- 提交按钮 -->
		<view class="submit-section">
			<button class="submit-btn" 
					:disabled="!canSubmit" 
					:class="{ disabled: !canSubmit }"
					@click="submitEvaluation">
				提交评价
			</button>
			<view class="submit-tip">评价提交后不可修改，请仔细检查后提交</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			courseId: '',
			courseInfo: {
				courseName: '高等数学A',
				teacher: '张教授',
				courseCode: 'MATH001',
				credit: 4,
				evaluationType: '期末评价'
			},
			teachingAttitude: [
				{ text: '教师备课充分，教学认真负责', score: 0 },
				{ text: '教师关心学生学习，耐心答疑', score: 0 },
				{ text: '教师按时上下课，无随意调课现象', score: 0 },
				{ text: '教师仪表端庄，语言规范', score: 0 },
				{ text: '教师能够公平对待每一位学生', score: 0 },
				{ text: '教师具有良好的师德师风', score: 0 }
			],
			teachingContent: [
				{ text: '教学内容充实，信息量适当', score: 0 },
				{ text: '重点难点突出，条理清晰', score: 0 },
				{ text: '理论联系实际，注重能力培养', score: 0 },
				{ text: '教学内容与时俱进，反映学科前沿', score: 0 },
				{ text: '课程安排合理，进度适中', score: 0 },
				{ text: '作业布置合理，批改及时', score: 0 },
				{ text: '考核方式科学，评价公正', score: 0 },
				{ text: '教学资源丰富，利用充分', score: 0 }
			],
			teachingMethod: [
				{ text: '教学方法灵活多样，启发性强', score: 0 },
				{ text: '善于调动学生学习积极性', score: 0 },
				{ text: '注重师生互动，课堂气氛活跃', score: 0 },
				{ text: '现代教学手段运用恰当', score: 0 },
				{ text: '因材施教，照顾不同层次学生', score: 0 },
				{ text: '注重培养学生创新思维能力', score: 0 }
			],
			overallRating: '',
			overallOptions: [
				{ value: 'excellent', label: '非常满意' },
				{ value: 'good', label: '满意' },
				{ value: 'average', label: '一般' },
				{ value: 'poor', label: '不满意' }
			],
			suggestion: ''
		}
	},
	computed: {
		attitudeScore() {
			return this.teachingAttitude.reduce((sum, item) => sum + item.score, 0);
		},
		contentScore() {
			return this.teachingContent.reduce((sum, item) => sum + item.score, 0);
		},
		methodScore() {
			return this.teachingMethod.reduce((sum, item) => sum + item.score, 0);
		},
		totalScore() {
			return this.attitudeScore + this.contentScore + this.methodScore;
		},
		canSubmit() {
			// 检查是否所有必填项都已完成
			const attitudeComplete = this.teachingAttitude.every(item => item.score > 0);
			const contentComplete = this.teachingContent.every(item => item.score > 0);
			const methodComplete = this.teachingMethod.every(item => item.score > 0);
			const overallComplete = this.overallRating !== '';
			
			return attitudeComplete && contentComplete && methodComplete && overallComplete;
		}
	},
	onLoad(options) {
		if (options.courseId) {
			this.courseId = options.courseId;
			this.loadCourseInfo();
		}
	},
	methods: {
		loadCourseInfo() {
			// 这里可以根据courseId加载具体的课程信息
			console.log('加载课程信息:', this.courseId);
		},
		setScore(category, index, score) {
			this[category][index].score = score;
		},
		setOverallRating(value) {
			this.overallRating = value;
		},
		getRatingLabel(score) {
			const labels = {
				5: '优秀',
				4: '良好', 
				3: '中等',
				2: '及格',
				1: '不及格'
			};
			return labels[score] || '';
		},
		submitEvaluation() {
			if (!this.canSubmit) {
				uni.showToast({
					title: '请完成所有必填项',
					icon: 'none'
				});
				return;
			}
			
			uni.showModal({
				title: '确认提交',
				content: '评价提交后不可修改，确定要提交吗？',
				success: (res) => {
					if (res.confirm) {
						this.doSubmit();
					}
				}
			});
		},
		async doSubmit() {
			uni.showLoading({
				title: '提交中...'
			});
			
			try {
				// 构造提交数据
				const evaluationData = {
					courseId: this.courseId,
					teachingAttitude: this.teachingAttitude,
					teachingContent: this.teachingContent,
					teachingMethod: this.teachingMethod,
					overallRating: this.overallRating,
					suggestion: this.suggestion,
					totalScore: this.totalScore,
					submitTime: new Date().toISOString()
				};
				
				// 模拟提交请求
				await new Promise(resolve => setTimeout(resolve, 2000));
				
				uni.hideLoading();
				
				uni.showToast({
					title: '提交成功',
					icon: 'success',
					duration: 2000
				});
				
				// 返回评价列表页面
				setTimeout(() => {
					uni.navigateBack();
				}, 2000);
				
			} catch (error) {
				uni.hideLoading();
				uni.showToast({
					title: '提交失败，请重试',
					icon: 'none'
				});
			}
		}
	}
}
</script>

<style scoped>
.form-container {
	background-color: #f5f7fa;
	min-height: 100vh;
	padding-bottom: 20rpx;
}

.course-info {
	background-color: white;
	margin: 20rpx;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.info-header {
	margin-bottom: 20rpx;
}

.course-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 8rpx;
}

.course-teacher {
	font-size: 28rpx;
	color: #1976D2;
}

.info-details {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.detail-text {
	font-size: 24rpx;
	color: #666;
}

.evaluation-form {
	margin: 0 20rpx;
}

.section {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 25rpx;
	padding-bottom: 15rpx;
	border-bottom: 2rpx solid #e5e5e5;
}

.question-item {
	margin-bottom: 30rpx;
}

.question-item:last-child {
	margin-bottom: 0;
}

.question-text {
	font-size: 26rpx;
	color: #333;
	margin-bottom: 15rpx;
	line-height: 1.4;
}

.rating-group {
	display: flex;
	gap: 10rpx;
}

.rating-item {
	flex: 1;
	text-align: center;
	padding: 15rpx 8rpx;
	border: 1rpx solid #e5e5e5;
	border-radius: 8rpx;
	background-color: #f8f9fa;
}

.rating-item.active {
	border-color: #1976D2;
	background-color: #E3F2FD;
}

.rating-score {
	font-size: 28rpx;
	font-weight: bold;
	color: #1976D2;
	display: block;
	margin-bottom: 4rpx;
}

.rating-label {
	font-size: 20rpx;
	color: #666;
}

.overall-question {
	font-size: 26rpx;
	color: #333;
	margin-bottom: 20rpx;
}

.overall-options {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15rpx;
}

.overall-item {
	padding: 20rpx;
	text-align: center;
	border: 1rpx solid #e5e5e5;
	border-radius: 8rpx;
	background-color: #f8f9fa;
}

.overall-item.active {
	border-color: #1976D2;
	background-color: #E3F2FD;
}

.overall-text {
	font-size: 26rpx;
	color: #333;
}

.suggestion-input {
	width: 100%;
	min-height: 200rpx;
	padding: 20rpx;
	border: 1rpx solid #e5e5e5;
	border-radius: 8rpx;
	font-size: 26rpx;
	line-height: 1.5;
	background-color: #f8f9fa;
}

.char-count {
	text-align: right;
	font-size: 22rpx;
	color: #999;
	margin-top: 10rpx;
}

.score-summary {
	background-color: white;
	margin: 0 20rpx 20rpx;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.summary-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
}

.summary-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
}

.summary-item {
	text-align: center;
	padding: 20rpx;
	background-color: #f8f9fa;
	border-radius: 8rpx;
}

.summary-item.total {
	grid-column: span 2;
	background-color: #E3F2FD;
}

.summary-label {
	font-size: 24rpx;
	color: #666;
	display: block;
	margin-bottom: 8rpx;
}

.summary-score {
	font-size: 32rpx;
	font-weight: bold;
	color: #1976D2;
}

.submit-section {
	padding: 0 20rpx;
	text-align: center;
}

.submit-btn {
	width: 100%;
	height: 90rpx;
	background-color: #1976D2;
	color: white;
	border: none;
	border-radius: 12rpx;
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 15rpx;
}

.submit-btn.disabled {
	background-color: #CCCCCC;
	color: #999;
}

.submit-tip {
	font-size: 24rpx;
	color: #999;
	line-height: 1.4;
}
</style>
