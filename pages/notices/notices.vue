<template>
	<view class="notices-container">
		<!-- 筛选栏 -->
		<view class="filter-section">
			<scroll-view scroll-x class="filter-scroll">
				<view class="filter-item" 
					  v-for="filter in filterOptions" 
					  :key="filter.key"
					  :class="{ active: selectedFilter === filter.key }"
					  @click="selectFilter(filter.key)">
					{{ filter.name }}
				</view>
			</scroll-view>
		</view>
		
		<!-- 搜索栏 -->
		<view class="search-section">
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input class="search-input" 
					   placeholder="搜索通知标题或内容" 
					   v-model="searchKeyword"
					   @input="onSearch" />
			</view>
		</view>
		
		<!-- 通知列表 -->
		<scroll-view scroll-y class="notices-list" @scrolltolower="loadMore">
			<view class="notice-item" v-for="notice in filteredNotices" :key="notice.id" @click="showNoticeDetail(notice)">
				<view class="notice-header">
					<view class="notice-title">{{ notice.title }}</view>
					<view class="notice-status" :class="notice.type">
						{{ notice.type === 'important' ? '重要' : notice.type === 'urgent' ? '紧急' : '通知' }}
					</view>
				</view>
				<view class="notice-summary">{{ notice.summary }}</view>
				<view class="notice-meta">
					<view class="meta-left">
						<text class="notice-department">{{ notice.department }}</text>
						<text class="notice-time">{{ notice.publishTime }}</text>
					</view>
					<view class="meta-right">
						<text class="read-status" :class="{ read: notice.isRead }">
							{{ notice.isRead ? '已读' : '未读' }}
						</text>
					</view>
				</view>
			</view>
			
			<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore">
				<text class="load-text">{{ isLoading ? '加载中...' : '上拉加载更多' }}</text>
			</view>
			
			<!-- 没有更多 -->
			<view class="no-more" v-else-if="filteredNotices.length > 0">
				<text class="no-more-text">没有更多通知了</text>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="filteredNotices.length === 0 && !isLoading">
				<text class="empty-icon">📢</text>
				<text class="empty-text">暂无相关通知</text>
			</view>
		</scroll-view>
		
		<!-- 通知详情弹窗 -->
		<view class="popup-mask" v-if="showDetailPopup" @click="closeNoticeDetail">
			<view class="notice-detail" v-if="selectedNotice" @click.stop>
				<view class="detail-header">
					<text class="notice-detail-title">{{ selectedNotice.title }}</text>
					<text class="close-btn" @click="closeNoticeDetail">×</text>
				</view>
				<view class="detail-content">
					<view class="detail-meta">
						<view class="meta-row">
							<text class="meta-label">发布部门：</text>
							<text class="meta-value">{{ selectedNotice.department }}</text>
						</view>
						<view class="meta-row">
							<text class="meta-label">发布时间：</text>
							<text class="meta-value">{{ selectedNotice.publishTime }}</text>
						</view>
						<view class="meta-row">
							<text class="meta-label">通知类型：</text>
							<text class="meta-value notice-type" :class="selectedNotice.type">
								{{ selectedNotice.type === 'important' ? '重要通知' : selectedNotice.type === 'urgent' ? '紧急通知' : '普通通知' }}
							</text>
						</view>
					</view>
					<view class="detail-text">{{ selectedNotice.content }}</view>
					<view class="detail-actions">
						<button class="action-btn" @click="markAsRead" v-if="!selectedNotice.isRead">标记为已读</button>
						<button class="action-btn secondary" @click="shareNotice">分享</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			selectedFilter: 'all',
			searchKeyword: '',
			showDetailPopup: false,
			selectedNotice: null,
			isLoading: false,
			hasMore: true,
			currentPage: 1,
			filterOptions: [
				{ key: 'all', name: '全部' },
				{ key: 'important', name: '重要' },
				{ key: 'urgent', name: '紧急' },
				{ key: 'normal', name: '普通' },
				{ key: 'unread', name: '未读' }
			],
			notices: [
				{
					id: 1,
					title: '关于2024年春季学期选课的通知',
					summary: '2024年春季学期选课将于1月15日开始，请同学们及时关注选课时间安排，合理规划课程。',
					content: '各位同学：\n\n2024年春季学期选课工作即将开始，现将有关事项通知如下：\n\n一、选课时间\n第一轮选课：2024年1月15日9:00 - 1月20日17:00\n第二轮选课：2024年1月25日9:00 - 1月30日17:00\n\n二、选课要求\n1. 请同学们认真阅读培养方案，合理安排课程\n2. 注意课程时间冲突，避免选择时间重叠的课程\n3. 选课期间如有问题，请及时联系教务处\n\n三、注意事项\n1. 选课系统开放时间为每日9:00-22:00\n2. 请使用校园网或VPN访问选课系统\n3. 选课结果以最终确认为准\n\n教务处\n2024年1月10日',
					department: '教务处',
					publishTime: '2024-01-10',
					type: 'important',
					isRead: false
				},
				{
					id: 2,
					title: '期末考试安排及注意事项',
					summary: '本学期期末考试将于1月20日开始，请同学们做好复习准备，注意考试时间和地点安排。',
					content: '各位同学：\n\n本学期期末考试即将开始，现将考试安排及注意事项通知如下：\n\n一、考试时间\n考试周：2024年1月20日 - 1月26日\n\n二、考试要求\n1. 考生须提前15分钟到达考场\n2. 携带学生证和身份证参加考试\n3. 严格遵守考试纪律，诚信考试\n\n三、注意事项\n1. 考试期间请保持手机静音\n2. 考试用品请自行准备\n3. 如有特殊情况请及时联系监考老师\n\n祝同学们考试顺利！\n\n教务处\n2024年1月12日',
					department: '教务处',
					publishTime: '2024-01-12',
					type: 'urgent',
					isRead: true
				},
				{
					id: 3,
					title: '图书馆寒假开放时间调整通知',
					summary: '寒假期间图书馆开放时间有所调整，请同学们注意开放时间变化，合理安排学习计划。',
					content: '各位读者：\n\n寒假期间图书馆开放时间调整如下：\n\n一、开放时间\n1月27日 - 2月20日：每日9:00-17:00\n周末正常开放\n\n二、服务调整\n1. 借还书服务正常\n2. 自习室开放时间同步调整\n3. 电子资源24小时可访问\n\n三、注意事项\n1. 请合理安排学习时间\n2. 遵守图书馆相关规定\n3. 如有问题请咨询服务台\n\n图书馆\n2024年1月15日',
					department: '图书馆',
					publishTime: '2024-01-15',
					type: 'normal',
					isRead: false
				},
				{
					id: 4,
					title: '关于开展2024年大学生创新创业项目申报的通知',
					summary: '为培养学生创新创业能力，现启动2024年大学生创新创业项目申报工作。',
					content: '各学院、各位同学：\n\n为进一步培养大学生创新创业能力，提高人才培养质量，现启动2024年大学生创新创业项目申报工作。\n\n一、申报时间\n申报时间：2024年2月1日 - 2月28日\n\n二、申报条件\n1. 在校全日制本科生\n2. 具有创新思维和实践能力\n3. 项目具有一定的创新性和可行性\n\n三、申报流程\n1. 填写申报表\n2. 提交项目计划书\n3. 学院初审\n4. 学校评审\n\n四、联系方式\n联系人：王老师\n电话：0571-12345678\n邮箱：innovation@university.edu.cn\n\n创新创业学院\n2024年1月18日',
					department: '创新创业学院',
					publishTime: '2024-01-18',
					type: 'normal',
					isRead: false
				},
				{
					id: 5,
					title: '校园网络维护通知',
					summary: '因网络设备升级，将于本周末进行校园网络维护，期间可能影响网络使用。',
					content: '各位师生：\n\n因校园网络设备升级需要，将进行网络维护工作，具体安排如下：\n\n一、维护时间\n2024年1月20日（周六）22:00 - 1月21日（周日）6:00\n\n二、影响范围\n1. 校园有线网络\n2. 校园无线网络\n3. VPN服务\n\n三、注意事项\n1. 维护期间网络可能间歇性中断\n2. 请提前下载所需资料\n3. 如有紧急情况请联系网络中心\n\n四、联系方式\n24小时服务热线：0571-87654321\n\n网络信息中心\n2024年1月19日',
					department: '网络信息中心',
					publishTime: '2024-01-19',
					type: 'urgent',
					isRead: true
				}
			]
		}
	},
	computed: {
		filteredNotices() {
			let filtered = this.notices;
			
			// 按类型筛选
			if (this.selectedFilter !== 'all') {
				if (this.selectedFilter === 'unread') {
					filtered = filtered.filter(notice => !notice.isRead);
				} else {
					filtered = filtered.filter(notice => notice.type === this.selectedFilter);
				}
			}
			
			// 按关键词搜索
			if (this.searchKeyword) {
				const keyword = this.searchKeyword.toLowerCase();
				filtered = filtered.filter(notice => 
					notice.title.toLowerCase().includes(keyword) || 
					notice.summary.toLowerCase().includes(keyword) ||
					notice.content.toLowerCase().includes(keyword)
				);
			}
			
			return filtered.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
		}
	},
	onLoad() {
		this.checkLoginStatus();
	},
	methods: {
		checkLoginStatus() {
			const isLoggedIn = uni.getStorageSync('isLoggedIn');
			if (!isLoggedIn) {
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		},
		selectFilter(filter) {
			this.selectedFilter = filter;
		},
		onSearch() {
			// 搜索逻辑已在computed中处理
		},
		showNoticeDetail(notice) {
			this.selectedNotice = notice;
			this.showDetailPopup = true;
		},
		closeNoticeDetail() {
			this.showDetailPopup = false;
		},
		markAsRead() {
			if (this.selectedNotice) {
				this.selectedNotice.isRead = true;
				uni.showToast({
					title: '已标记为已读',
					icon: 'success'
				});
			}
		},
		shareNotice() {
			uni.showActionSheet({
				itemList: ['复制链接', '分享到微信', '分享到QQ'],
				success: (res) => {
					uni.showToast({
						title: '分享功能开发中',
						icon: 'none'
					});
				}
			});
		},
		loadMore() {
			if (this.isLoading || !this.hasMore) return;
			
			this.isLoading = true;
			
			// 模拟加载更多数据
			setTimeout(() => {
				this.isLoading = false;
				// 这里可以加载更多通知数据
				// 暂时设置为没有更多数据
				this.hasMore = false;
			}, 1000);
		}
	}
}
</script>

<style scoped>
.notices-container {
	background-color: #f5f7fa;
	min-height: 100vh;
}

.filter-section {
	background-color: white;
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
	color: #1976D2;
	background-color: #e3f2fd;
}

.search-section {
	background-color: white;
	padding: 20rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.search-box {
	display: flex;
	align-items: center;
	background-color: #f8f9fa;
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

.notices-list {
	height: calc(100vh - 200rpx);
	padding: 20rpx;
}

.notice-item {
	background-color: white;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.notice-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 15rpx;
}

.notice-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
	line-height: 1.4;
	margin-right: 20rpx;
}

.notice-status {
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	font-weight: bold;
	flex-shrink: 0;
}

.notice-status.important {
	background-color: #ffebee;
	color: #f44336;
}

.notice-status.urgent {
	background-color: #fff3e0;
	color: #ff9800;
}

.notice-status.normal {
	background-color: #e8f5e8;
	color: #4caf50;
}

.notice-summary {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
	margin-bottom: 15rpx;
}

.notice-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.meta-left {
	display: flex;
	gap: 20rpx;
}

.notice-department, .notice-time {
	font-size: 24rpx;
	color: #999;
}

.read-status {
	font-size: 22rpx;
	padding: 4rpx 8rpx;
	border-radius: 8rpx;
	background-color: #fff3e0;
	color: #ff9800;
}

.read-status.read {
	background-color: #e8f5e8;
	color: #4caf50;
}

.load-more, .no-more {
	text-align: center;
	padding: 30rpx;
}

.load-text, .no-more-text {
	font-size: 26rpx;
	color: #999;
}

.empty-state {
	text-align: center;
	padding: 100rpx 30rpx;
	color: #999;
}

.empty-icon {
	font-size: 80rpx;
	display: block;
	margin-bottom: 30rpx;
}

.empty-text {
	font-size: 28rpx;
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

.notice-detail {
	background-color: white;
	border-radius: 20rpx;
	width: 90%;
	max-height: 80vh;
	overflow-y: auto;
	padding: 40rpx;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.notice-detail-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
	line-height: 1.4;
}

.close-btn {
	font-size: 48rpx;
	color: #999;
	width: 60rpx;
	height: 60rpx;
	text-align: center;
	line-height: 60rpx;
	margin-left: 20rpx;
}

.detail-meta {
	margin-bottom: 30rpx;
	padding: 20rpx;
	background-color: #f8f9fa;
	border-radius: 12rpx;
}

.meta-row {
	display: flex;
	margin-bottom: 10rpx;
}

.meta-row:last-child {
	margin-bottom: 0;
}

.meta-label {
	font-size: 26rpx;
	color: #666;
	width: 160rpx;
}

.meta-value {
	font-size: 26rpx;
	color: #333;
}

.notice-type.important {
	color: #f44336;
}

.notice-type.urgent {
	color: #ff9800;
}

.notice-type.normal {
	color: #4caf50;
}

.detail-text {
	font-size: 28rpx;
	line-height: 1.6;
	color: #333;
	white-space: pre-line;
	margin-bottom: 30rpx;
}

.detail-actions {
	display: flex;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	height: 80rpx;
	border-radius: 12rpx;
	font-size: 28rpx;
	border: none;
	background-color: #1976D2;
	color: white;
}

.action-btn.secondary {
	background-color: #f5f5f5;
	color: #666;
}
</style>
