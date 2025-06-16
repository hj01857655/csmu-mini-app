<template>
	<view class="container">
		<!-- 选课状态栏 -->
		<view class="status-bar">
			<view class="status-item">
				<view class="status-number">{{ selectedCredits }}</view>
				<view class="status-label">已选学分</view>
			</view>
			<view class="status-divider">/</view>
			<view class="status-item">
				<view class="status-number">{{ maxCredits }}</view>
				<view class="status-label">最大学分</view>
			</view>
			<view class="status-progress">
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: progressWidth + '%' }"></view>
				</view>
			</view>
		</view>
		
		<!-- 课程类型筛选 -->
		<view class="filter-section">
			<scroll-view scroll-x class="filter-scroll">
				<view class="filter-item" 
					  v-for="category in courseCategories" 
					  :key="category.key"
					  :class="{ active: selectedCategory === category.key }"
					  @click="selectCategory(category.key)">
					{{ category.name }}
				</view>
			</scroll-view>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input class="search-input" 
					   placeholder="搜索课程名称或教师" 
					   v-model="searchKeyword"
					   @input="onSearch" />
			</view>
		</view>
		
		<!-- 课程列表 -->
		<scroll-view scroll-y class="course-list">
			<view class="course-item" v-for="course in filteredCourses" :key="course.id">
				<view class="course-header">
					<view class="course-info">
						<view class="course-name">{{ course.name }}</view>
						<view class="course-code">{{ course.code }}</view>
					</view>
					<view class="course-action">
						<button class="action-btn" 
								:class="{ 
									selected: course.isSelected, 
									disabled: course.isFull && !course.isSelected,
									conflict: course.hasConflict && !course.isSelected
								}"
								@click="toggleCourse(course)"
								:disabled="(course.isFull || course.hasConflict) && !course.isSelected">
							{{ course.isSelected ? '已选' : course.isFull ? '已满' : course.hasConflict ? '冲突' : '选课' }}
						</button>
					</view>
				</view>
				
				<view class="course-details">
					<view class="detail-row">
						<text class="detail-label">学分：</text>
						<text class="detail-value">{{ course.credit }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">教师：</text>
						<text class="detail-value">{{ course.teacher }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">时间：</text>
						<text class="detail-value">{{ course.schedule }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">地点：</text>
						<text class="detail-value">{{ course.location }}</text>
					</view>
					<view class="detail-row">
						<text class="detail-label">人数：</text>
						<text class="detail-value" :class="{ warning: course.currentCount >= course.maxCount * 0.9 }">
							{{ course.currentCount }}/{{ course.maxCount }}
						</text>
					</view>
				</view>
				
				<view class="course-tags">
					<text class="course-tag" :class="course.type">{{ course.type === 'required' ? '必修' : course.type === 'elective' ? '选修' : '公选' }}</text>
					<text class="course-tag quality" v-if="course.isQuality">精品课程</text>
					<text class="course-tag online" v-if="course.isOnline">线上课程</text>
				</view>
			</view>
		</scroll-view>
		
		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="selected-info">
				<text>已选 {{ selectedCourses.length }} 门课程</text>
			</view>
			<view class="action-buttons">
				<button class="btn-secondary" @click="showSelectedCourses">查看已选</button>
				<button class="btn-primary" @click="submitSelection" :disabled="selectedCourses.length === 0">提交选课</button>
			</view>
		</view>
		
		<!-- 已选课程弹窗 -->
		<view class="popup-mask" v-if="showSelectedPopup" @click="closeSelectedPopup">
			<view class="selected-popup" @click.stop>
				<view class="popup-header">
					<text class="popup-title">已选课程</text>
					<text class="close-btn" @click="closeSelectedPopup">×</text>
				</view>
				<scroll-view scroll-y class="selected-list">
					<view class="selected-item" v-for="course in selectedCourses" :key="course.id">
						<view class="selected-info">
							<view class="selected-name">{{ course.name }}</view>
							<view class="selected-details">{{ course.credit }}学分 · {{ course.teacher }}</view>
						</view>
						<button class="remove-btn" @click="removeCourse(course)">移除</button>
					</view>
				</scroll-view>
				<view class="popup-footer">
					<text>总学分：{{ selectedCredits }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			maxCredits: 25,
			searchKeyword: '',
			selectedCategory: 'all',
			showSelectedPopup: false,
			courseCategories: [
				{ key: 'all', name: '全部' },
				{ key: 'required', name: '必修课' },
				{ key: 'elective', name: '专业选修' },
				{ key: 'public', name: '公共选修' }
			],
			courses: [
				{
					id: 1,
					name: '数据结构与算法',
					code: 'CS201',
					credit: 4,
					teacher: '王教授',
					schedule: '周一3-4节，周三5-6节',
					location: '教学楼A201',
					currentCount: 45,
					maxCount: 50,
					type: 'required',
					isSelected: false,
					isFull: false,
					hasConflict: false,
					isQuality: true,
					isOnline: false
				},
				{
					id: 2,
					name: '操作系统原理',
					code: 'CS202',
					credit: 3,
					teacher: '李教授',
					schedule: '周二1-2节，周四3-4节',
					location: '教学楼B301',
					currentCount: 48,
					maxCount: 50,
					type: 'required',
					isSelected: false,
					isFull: false,
					hasConflict: false,
					isQuality: false,
					isOnline: false
				},
				{
					id: 3,
					name: '人工智能导论',
					code: 'CS301',
					credit: 3,
					teacher: '张教授',
					schedule: '周一1-2节，周五3-4节',
					location: '教学楼C101',
					currentCount: 50,
					maxCount: 50,
					type: 'elective',
					isSelected: false,
					isFull: true,
					hasConflict: false,
					isQuality: true,
					isOnline: false
				},
				{
					id: 4,
					name: 'Web前端开发',
					code: 'CS302',
					credit: 2,
					teacher: '陈老师',
					schedule: '周三1-2节',
					location: '机房D201',
					currentCount: 30,
					maxCount: 40,
					type: 'elective',
					isSelected: false,
					isFull: false,
					hasConflict: false,
					isQuality: false,
					isOnline: true
				},
				{
					id: 5,
					name: '大学英语口语',
					code: 'ENG201',
					credit: 2,
					teacher: '外教Smith',
					schedule: '周二5-6节',
					location: '语音室E101',
					currentCount: 25,
					maxCount: 30,
					type: 'public',
					isSelected: false,
					isFull: false,
					hasConflict: false,
					isQuality: false,
					isOnline: false
				}
			]
		}
	},
	computed: {
		selectedCourses() {
			return this.courses.filter(course => course.isSelected);
		},
		selectedCredits() {
			return this.selectedCourses.reduce((sum, course) => sum + course.credit, 0);
		},
		progressWidth() {
			return Math.min((this.selectedCredits / this.maxCredits) * 100, 100);
		},
		filteredCourses() {
			let filtered = this.courses;
			
			// 按类型筛选
			if (this.selectedCategory !== 'all') {
				filtered = filtered.filter(course => course.type === this.selectedCategory);
			}
			
			// 按关键词搜索
			if (this.searchKeyword) {
				const keyword = this.searchKeyword.toLowerCase();
				filtered = filtered.filter(course => 
					course.name.toLowerCase().includes(keyword) || 
					course.teacher.toLowerCase().includes(keyword) ||
					course.code.toLowerCase().includes(keyword)
				);
			}
			
			return filtered;
		}
	},
	methods: {
		selectCategory(category) {
			this.selectedCategory = category;
		},
		onSearch() {
			// 搜索逻辑已在computed中处理
		},
		toggleCourse(course) {
			if (course.isSelected) {
				// 取消选课
				course.isSelected = false;
				course.currentCount--;
			} else {
				// 检查学分限制
				if (this.selectedCredits + course.credit > this.maxCredits) {
					uni.showToast({
						title: '超出最大学分限制',
						icon: 'none'
					});
					return;
				}
				
				// 选课
				course.isSelected = true;
				course.currentCount++;
				
				// 检查是否满员
				if (course.currentCount >= course.maxCount) {
					course.isFull = true;
				}
			}
			
			// 重新检查时间冲突
			this.checkTimeConflicts();
		},
		checkTimeConflicts() {
			// 简化的时间冲突检测逻辑
			const selectedSchedules = this.selectedCourses.map(course => course.schedule);
			
			this.courses.forEach(course => {
				if (!course.isSelected) {
					course.hasConflict = selectedSchedules.some(schedule => 
						this.hasScheduleConflict(course.schedule, schedule)
					);
				}
			});
		},
		hasScheduleConflict(schedule1, schedule2) {
			// 简化的冲突检测，实际应该解析具体时间
			return schedule1.includes('周一') && schedule2.includes('周一');
		},
		removeCourse(course) {
			course.isSelected = false;
			course.currentCount--;
			course.isFull = false;
			this.checkTimeConflicts();
		},
		showSelectedCourses() {
			this.showSelectedPopup = true;
		},
		closeSelectedPopup() {
			this.showSelectedPopup = false;
		},
		submitSelection() {
			if (this.selectedCourses.length === 0) {
				uni.showToast({
					title: '请先选择课程',
					icon: 'none'
				});
				return;
			}
			
			uni.showModal({
				title: '确认选课',
				content: `确定要提交选课吗？共选择${this.selectedCourses.length}门课程，${this.selectedCredits}学分`,
				success: (res) => {
					if (res.confirm) {
						uni.showToast({
							title: '选课成功',
							icon: 'success'
						});
					}
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
	padding-bottom: 120rpx;
}

.status-bar {
	background-color: #fff;
	padding: 30rpx;
	display: flex;
	align-items: center;
	border-bottom: 1rpx solid #e5e5e5;
}

.status-item {
	text-align: center;
}

.status-number {
	font-size: 36rpx;
	font-weight: bold;
	color: #007AFF;
}

.status-label {
	font-size: 24rpx;
	color: #666;
	margin-top: 5rpx;
}

.status-divider {
	font-size: 32rpx;
	color: #999;
	margin: 0 20rpx;
}

.status-progress {
	flex: 1;
	margin-left: 30rpx;
}

.progress-bar {
	height: 8rpx;
	background-color: #f0f0f0;
	border-radius: 4rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background-color: #007AFF;
	transition: width 0.3s ease;
}

.filter-section {
	background-color: #fff;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #e5e5e5;
}

.filter-scroll {
	white-space: nowrap;
}

.filter-item {
	display: inline-block;
	padding: 15rpx 30rpx;
	margin: 0 10rpx;
	font-size: 28rpx;
	color: #666;
	background-color: #f5f5f5;
	border-radius: 25rpx;
}

.filter-item.active {
	color: #007AFF;
	background-color: #e3f2fd;
}

.search-section {
	padding: 20rpx;
}

.search-box {
	display: flex;
	align-items: center;
	background-color: #fff;
	border-radius: 25rpx;
	padding: 20rpx;
}

.search-icon {
	font-size: 32rpx;
	margin-right: 15rpx;
	color: #999;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
}

.course-list {
	height: calc(100vh - 400rpx);
	padding: 0 20rpx;
}

.course-item {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.course-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 20rpx;
}

.course-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
}

.course-code {
	font-size: 24rpx;
	color: #999;
}

.action-btn {
	padding: 12rpx 24rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	border: none;
	background-color: #007AFF;
	color: white;
}

.action-btn.selected {
	background-color: #4caf50;
}

.action-btn.disabled {
	background-color: #ccc;
}

.action-btn.conflict {
	background-color: #ff9800;
}

.course-details {
	margin-bottom: 20rpx;
}

.detail-row {
	display: flex;
	margin-bottom: 8rpx;
}

.detail-label {
	width: 100rpx;
	font-size: 26rpx;
	color: #666;
}

.detail-value {
	font-size: 26rpx;
	color: #333;
}

.detail-value.warning {
	color: #ff9800;
}

.course-tags {
	display: flex;
	gap: 10rpx;
}

.course-tag {
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
}

.course-tag.required {
	background-color: #ffebee;
	color: #f44336;
}

.course-tag.elective {
	background-color: #e3f2fd;
	color: #2196f3;
}

.course-tag.public {
	background-color: #e8f5e8;
	color: #4caf50;
}

.course-tag.quality {
	background-color: #fff3e0;
	color: #ff9800;
}

.course-tag.online {
	background-color: #f3e5f5;
	color: #9c27b0;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 20rpx;
	border-top: 1rpx solid #e5e5e5;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.selected-info {
	font-size: 28rpx;
	color: #666;
}

.action-buttons {
	display: flex;
	gap: 20rpx;
}

.btn-secondary, .btn-primary {
	padding: 15rpx 30rpx;
	border-radius: 25rpx;
	font-size: 28rpx;
	border: none;
}

.btn-secondary {
	background-color: #f5f5f5;
	color: #666;
}

.btn-primary {
	background-color: #007AFF;
	color: white;
}

.btn-primary:disabled {
	background-color: #ccc;
}

.popup-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.selected-popup {
	background-color: #fff;
	border-radius: 20rpx;
	width: 80%;
	max-height: 70vh;
	display: flex;
	flex-direction: column;
}

.popup-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
}

.close-btn {
	font-size: 48rpx;
	color: #999;
}

.selected-list {
	flex: 1;
	padding: 20rpx;
}

.selected-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.selected-name {
	font-size: 28rpx;
	font-weight: bold;
	margin-bottom: 5rpx;
}

.selected-details {
	font-size: 24rpx;
	color: #666;
}

.remove-btn {
	padding: 8rpx 16rpx;
	background-color: #ff4444;
	color: white;
	border-radius: 15rpx;
	font-size: 24rpx;
	border: none;
}

.popup-footer {
	padding: 20rpx 30rpx;
	border-top: 1rpx solid #e5e5e5;
	text-align: center;
	font-size: 28rpx;
	font-weight: bold;
	color: #007AFF;
}
</style>
