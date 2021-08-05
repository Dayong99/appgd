<template>
	<view class="" style="position: relative;top:0;bottom: 0;background: #fff;z-index: 999;">
		<!-- 滚动内容区 -->
		<view class="head flex mauto cwhite sw f34r">
			<view class="boximgs mt8r" @tap="goback">
				<image src="../../static/fanhui1.png" mode="" class="hw100v"></image>
			</view>
			<view class="safe fcenter">隐私政策协议</view>
		</view>
		<view class="fcenter f34r mt28r mb28r">
			智慧工地云平台-埃欧哲隐私政策
		</view>
		<view style="margin-left: 40rpx;">开发者名称:杭州埃欧哲建设工程咨询有限公司</view>
		<view style="margin-left: 40rpx;margin-bottom: 20rpx;">应用名称:智慧工地云平台-埃欧哲</view>
		<view class="editpent">

			<view>
				为了给您提供更准确、更有个性化的服务，本软件会按照本隐私权政策的规定使用和披露您的个人信息。但本软件将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在未征得您事先许可的情况下，本软件不会将这些信息对外披露或向第三方提供。本软件会不时更新本隐私权政策。您在同意本软件服务使用协议之时，即视为您已经同意本隐私权政策全部内容。本隐私权政策属于本软件服务使用协议不可分割的一部分。
			</view>
			<view class="titls">
				1. 适用范围
			</view>
			<view>
				在您使用本软件网络服务，本软件不会收集您的信息。
			</view>
			<view class="titls">
				2. 信息披露
			</view>
			<view>
				a)本软件不会将您的信息披露给不受信任的第三方；
			</view>
			<view>
				b)根据法律的有关规定，或者行政或司法机构的要求，向第三方或者行政、司法机构披露；
			</view>
			<view>
				c)如您出现违反中国有关法律、法规或者相关规则的情况，需要向第三方披露。
			</view>
			<view class="titls">
				3. 信息存储和交换
			</view>
			<view>
				本软件收集的有关您的信息和资料将保存在本软件及（或）其关联公司的服务器上，这些信息和资料可能传送至您所在国家、地区或本软件收集信息和资料所在地的境外并在境外被访问、存储和展示。
			</view>
			<view class="titls">
				4.信息安全
			</view>
			<view style="padding-bottom:60rpx;">
				如果决定更改隐私政策，我们会在本政策中以及我们认为适当的位置发布这些更改，以便您了解我们如何收集项目信息。

				请您妥善保护自己的账号信息，如您发现自己的账号信息泄密，尤其是本应用用户名及密码发生泄露，请您立即联络本应用管理员，以便本应用采取相应措施。

				感谢您花时间了解我们的隐私政策！我们将尽全力保护您的个人信息和合法权益，再次感谢您的信任！</view>
		</view>
	</view>
</template>
<script>
	export default {
		computed: {},

		methods: {
			goback() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	page {
		background: #fff;
	}

	.head {
		width: 100%;
		height: 153rpx;
		line-height: 193rpx;
		background: linear-gradient(0deg, #235FED, #235FED);
	}

	.boximgs {
		width: 21rpx;
		height: 38rpx;
		padding-left: 30rpx;
	}

	.safe {
		width: 70%;
		padding-left: 80rpx;
	}

	/* 样式 */
	.editpent {
		background: #fff;
		width: 100%;
	}

	.editpent {
		width: 90%;
		margin: 0 auto
	}

	.editpent view {
		font-size: 30rpx;
	}

	.titls {
		font-size: 32rpx;
		margin: 15rpx auto;
	}
</style>
