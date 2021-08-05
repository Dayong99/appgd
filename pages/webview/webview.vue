<template>
	<view>
		<view class="head flex mauto cwhite sw f34r">
			<view class="boximgs mt8r" @tap="goback">
				<image src="../../static/fanhui1.png" mode="" class="hw100v"></image>
			</view>
			<view class="safe fcenter">在线预览</view>
		</view>
		<web-view :webview-styles="webviewStyles" :src="filePath"></web-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				filePaths: '',
				filePath: '',
				fileType: '',
				webviewStyles: {
					progress: {
						color: "#208FE7"
					}
				}
			}
		},
		onLoad(val) {
			if (val.data) {
				this.filePaths = JSON.parse(decodeURIComponent(val.data)).filePath
				this.fileType = JSON.parse(decodeURIComponent(val.data)).fileType
			} else {
				this.filePaths = val.filePath
			}
			if (this.fileType == 'xls') {
				this.filePath = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.filePaths
			} else if (this.fileType == 'xlsx') {
				this.filePath = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.filePaths
			} else if (this.fileType == 'doc') {
				this.filePath = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.filePaths
			} else if (this.fileType == 'docx') {
				this.filePath = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.filePaths
			} else if (this.fileType == 'ppt') {
				this.filePath = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.filePaths
			} else if (this.fileType == 'pptx') {
				this.filePath = 'https://view.officeapps.live.com/op/view.aspx?src=' + this.filePaths
			} else if (this.fileType == 'pdf' && plus.os.name === 'Android') {
				uni.downloadFile({
					url: this.filePaths,
					success: res => {
						uni.openDocument({
							filePath: res.tempFilePath,
							success: (res) => {
								console.log(res, '文件打开成功');
							}
						})
					}
				})
			} else {
				this.filePath = this.filePaths
			}
		},

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

	.editpent .inputsq {
		border-bottom: 1px solid #E6E6E6;
		width: 573rpx;
		padding-bottom: 21rpx;
		font-size: 31rpx;
		font-family: 'PingFang SC';
		font-weight: 500;
		color: #B6C2CE;
	}

	.itemedit {
		height: 124rpx;
		line-height: 146rpx;
		width: 100%;
	}

	.itemedit .a1 {
		width: 177rpx;
		padding-left: 32rpx;
		font-size: 31rpx;
		font-family: 'PingFang SC';
		font-weight: 500;
		color: #181616;
	}

	.persons {
		margin-top: 10rpx;
		width: 83rpx;
		height: 83rpx;
		/* position: absolute;
		top:20rpx;
		left: 190rpx; */
	}

	.itemedit text {
		height: 1rpx;
		width: 573rpx;
		background: #D9E2E9;
		margin-top: 125rpx;
	}
</style>
