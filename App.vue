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
	/*每个页面公共css */
</style>
