<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			this.checkLoginStatus();
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
		methods: {
			checkLoginStatus() {
				// 简化登录检查，在各个页面的onLoad中处理
				console.log('检查登录状态');
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
