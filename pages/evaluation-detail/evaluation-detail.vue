<template>
	<view class="detail-container">
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
			<view class="evaluation-meta">
				<text class="meta-text">评价时间：{{ evaluationData.submitTime }}</text>
				<text class="meta-text">总分：{{ evaluationData.totalScore }}/100</text>
			</view>
		</view>
		
		<!-- 评分详情 -->
		<view class="score-details">
			<!-- 教学态度 -->
			<view class="score-section">
				<view class="section-header">
					<text class="section-title">教学态度</text>
					<text class="section-score">{{ attitudeScore }}/30</text>
				</view>
				<view class="question-list">
					<view class="question-item" v-for="(question, index) in evaluationData.teachingAttitude" :key="index">
						<view class="question-content">
							<text class="question-text">{{ question.text }}</text>
							<view class="question-rating">
								<text class="rating-score">{{ question.score }}分</text>
								<text class="rating-label">({{ getRatingLabel(question.score) }})</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 教学内容 -->
			<view class="score-section">
				<view class="section-header">
					<text class="section-title">教学内容</text>
					<text class="section-score">{{ contentScore }}/40</text>
				</view>
				<view class="question-list">
					<view class="question-item" v-for="(question, index) in evaluationData.teachingContent" :key="index">
						<view class="question-content">
							<text class="question-text">{{ question.text }}</text>
							<view class="question-rating">
								<text class="rating-score">{{ question.score }}分</text>
								<text class="rating-label">({{ getRatingLabel(question.score) }})</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 教学方法 -->
			<view class="score-section">
				<view class="section-header">
					<text class="section-title">教学方法</text>
					<text class="section-score">{{ methodScore }}/30</text>
				</view>
				<view class="question-list">
					<view class="question-item" v-for="(question, index) in evaluationData.teachingMethod" :key="index">
						<view class="question-content">
							<text class="question-text">{{ question.text }}</text>
							<view class="question-rating">
								<text class="rating-score">{{ question.score }}分</text>
								<text class="rating-label">({{ getRatingLabel(question.score) }})</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 总体评价 -->
		<view class="overall-section">
			<view class="section-title">总体评价</view>
			<view class="overall-content">
				<text class="overall-label">总体满意度：</text>
				<text class="overall-value">{{ getOverallLabel(evaluationData.overallRating) }}</text>
			</view>
		</view>
		
		<!-- 建议和意见 -->
		<view class="suggestion-section" v-if="evaluationData.suggestion">
			<view class="section-title">建议和意见</view>
			<view class="suggestion-content">
				<text class="suggestion-text">{{ evaluationData.suggestion }}</text>
			</view>
		</view>
		
		<!-- 评分统计图表 -->
		<view class="chart-section">
			<view class="section-title">评分分布</view>
			<view class="chart-container">
				<view class="chart-item" v-for="category in chartData" :key="category.name">
					<view class="chart-label">{{ category.name }}</view>
					<view class="chart-bar">
						<view class="chart-fill" :style="{ width: category.percentage + '%' }"></view>
					</view>
					<view class="chart-value">{{ category.score }}/{{ category.total }}</view>
				</view>
			</view>
		</view>
		
		<!-- 操作按钮 -->
		<view class="action-section">
			<button class="action-btn back" @click="goBack">返回列表</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			courseId: '',
			mode: 'view',
			courseInfo: {
				courseName: '大学英语',
				teacher: '李老师',
				courseCode: 'ENG001',
				credit: 3,
				evaluationType: '期末评价'
			},
			evaluationData: {
				submitTime: '2024-01-15 14:30',
				totalScore: 92,
				teachingAttitude: [
					{ text: '教师备课充分，教学认真负责', score: 5 },
					{ text: '教师关心学生学习，耐心答疑', score: 5 },
					{ text: '教师按时上下课，无随意调课现象', score: 5 },
					{ text: '教师仪表端庄，语言规范', score: 4 },
					{ text: '教师能够公平对待每一位学生', score: 5 },
					{ text: '教师具有良好的师德师风', score: 5 }
				],
				teachingContent: [
					{ text: '教学内容充实，信息量适当', score: 5 },
					{ text: '重点难点突出，条理清晰', score: 4 },
					{ text: '理论联系实际，注重能力培养', score: 5 },
					{ text: '教学内容与时俱进，反映学科前沿', score: 4 },
					{ text: '课程安排合理，进度适中', score: 5 },
					{ text: '作业布置合理，批改及时', score: 4 },
					{ text: '考核方式科学，评价公正', score: 5 },
					{ text: '教学资源丰富，利用充分', score: 4 }
				],
				teachingMethod: [
					{ text: '教学方法灵活多样，启发性强', score: 4 },
					{ text: '善于调动学生学习积极性', score: 5 },
					{ text: '注重师生互动，课堂气氛活跃', score: 5 },
					{ text: '现代教学手段运用恰当', score: 4 },
					{ text: '因材施教，照顾不同层次学生', score: 4 },
					{ text: '注重培养学生创新思维能力', score: 4 }
				],
				overallRating: 'excellent',
				suggestion: '李老师的英语课非常生动有趣，能够很好地调动学生的学习积极性。建议可以增加一些实际应用的练习，让我们更好地将所学知识运用到实际生活中。总体来说，这是一门非常优秀的课程。'
			}
		}
	},
	computed: {
		attitudeScore() {
			return this.evaluationData.teachingAttitude.reduce((sum, item) => sum + item.score, 0);
		},
		contentScore() {
			return this.evaluationData.teachingContent.reduce((sum, item) => sum + item.score, 0);
		},
		methodScore() {
			return this.evaluationData.teachingMethod.reduce((sum, item) => sum + item.score, 0);
		},
		chartData() {
			return [
				{
					name: '教学态度',
					score: this.attitudeScore,
					total: 30,
					percentage: (this.attitudeScore / 30) * 100
				},
				{
					name: '教学内容',
					score: this.contentScore,
					total: 40,
					percentage: (this.contentScore / 40) * 100
				},
				{
					name: '教学方法',
					score: this.methodScore,
					total: 30,
					percentage: (this.methodScore / 30) * 100
				}
			];
		}
	},
	onLoad(options) {
		if (options.courseId) {
			this.courseId = options.courseId;
		}
		if (options.mode) {
			this.mode = options.mode;
		}
		this.loadEvaluationData();
	},
	methods: {
		loadEvaluationData() {
			// 这里可以根据courseId加载具体的评价数据
			console.log('加载评价数据:', this.courseId);
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
		getOverallLabel(rating) {
			const labels = {
				'excellent': '非常满意',
				'good': '满意',
				'average': '一般',
				'poor': '不满意'
			};
			return labels[rating] || rating;
		},
		goBack() {
			uni.navigateBack();
		}
	}
}
</script>

<style scoped>
.detail-container {
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
	margin-bottom: 20rpx;
}

.detail-text {
	font-size: 24rpx;
	color: #666;
}

.evaluation-meta {
	display: flex;
	justify-content: space-between;
	padding-top: 20rpx;
	border-top: 1rpx solid #e5e5e5;
}

.meta-text {
	font-size: 24rpx;
	color: #666;
}

.score-details {
	margin: 0 20rpx;
}

.score-section {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25rpx;
	padding-bottom: 15rpx;
	border-bottom: 2rpx solid #e5e5e5;
}

.section-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}

.section-score {
	font-size: 28rpx;
	font-weight: bold;
	color: #1976D2;
}

.question-item {
	margin-bottom: 20rpx;
}

.question-item:last-child {
	margin-bottom: 0;
}

.question-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.question-text {
	font-size: 26rpx;
	color: #333;
	flex: 1;
	line-height: 1.4;
}

.question-rating {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.rating-score {
	font-size: 26rpx;
	font-weight: bold;
	color: #1976D2;
}

.rating-label {
	font-size: 22rpx;
	color: #666;
}

.overall-section, .suggestion-section {
	background-color: white;
	margin: 0 20rpx 20rpx;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.overall-content {
	display: flex;
	align-items: center;
	gap: 15rpx;
}

.overall-label {
	font-size: 26rpx;
	color: #666;
}

.overall-value {
	font-size: 26rpx;
	font-weight: bold;
	color: #1976D2;
}

.suggestion-content {
	margin-top: 15rpx;
}

.suggestion-text {
	font-size: 26rpx;
	color: #333;
	line-height: 1.6;
}

.chart-section {
	background-color: white;
	margin: 0 20rpx 20rpx;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.chart-container {
	margin-top: 25rpx;
}

.chart-item {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
}

.chart-item:last-child {
	margin-bottom: 0;
}

.chart-label {
	width: 120rpx;
	font-size: 24rpx;
	color: #666;
}

.chart-bar {
	flex: 1;
	height: 20rpx;
	background-color: #f0f0f0;
	border-radius: 10rpx;
	margin: 0 20rpx;
	overflow: hidden;
}

.chart-fill {
	height: 100%;
	background: linear-gradient(90deg, #1976D2, #42A5F5);
	border-radius: 10rpx;
	transition: width 0.3s ease;
}

.chart-value {
	width: 80rpx;
	font-size: 24rpx;
	color: #1976D2;
	font-weight: bold;
	text-align: right;
}

.action-section {
	padding: 0 20rpx;
}

.action-btn {
	width: 100%;
	height: 80rpx;
	border: none;
	border-radius: 12rpx;
	font-size: 28rpx;
	font-weight: bold;
}

.action-btn.back {
	background-color: #1976D2;
	color: white;
}
</style>
