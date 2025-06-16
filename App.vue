<script>
	export default {
		onLaunch: function() {
			this.checkLoginStatus();
		},
		onShow: function() {
			// App显示时的处理
		},
		onHide: function() {
			// App隐藏时的处理
		},
		methods: {
			checkLoginStatus() {
				// 简化登录检查，在各个页面的onLoad中处理
			}
		}
	}
</script>

<style>
	/* 导入统一设计系统 */
	@import url("./styles/design-system.css");

	/* 全局公共样式 */
	page {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		background-color: var(--background-tertiary);
		color: var(--text-primary);
	}

	/* 全局容器样式 */
	.page-container {
		min-height: 100vh;
		background: var(--background-color);
	}

	/* 全局加载状态 */
	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--spacing-xl);
	}

	/* 全局错误状态 */
	.error-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: var(--spacing-xl);
		color: var(--text-secondary);
	}
</style>
