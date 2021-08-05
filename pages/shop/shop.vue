<template>
	<view class="posir pagehome">
		<view class="head flex mauto cwhite sw f34r" :style="{'padding-top':height+'px'}">
			<view class="boximgs mt8r">
			</view>
			<view class="safe fcenter">消息中心</view>
		</view>
		<view class="boxmesg" v-if="numtotal==0" :style="{'top':height+133+'rpx'}">
			<view class="message posia">
				<image src="../../static/messagecenter.png" class="hw100v"></image>
				<view class="fcenter nonemsg sw f32r c979">暂无消息</view>
			</view>
		</view>
		<view class="boxmesg" v-if="numtotal!=0" :style="{'top':height+133+'rpx'}">
			<view class="megList" v-for="(item,index) in msgLists" @tap="gomsg('remind',item.temCode)">
				<image src="../../static/tixing.png"></image>
				<view class="account">
					<view>{{item.temName}}</view>
					<view>{{item.barText}}</view>
				</view>
				<view class="inform" v-if="!device_checked">
					<view class="infromnum">{{total1}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		megremind
	} from '@/api/AlbumServer.js'
	export default {
		components: {

		},

		props: {
			height: {
			  type: Number,
			  default: 0
			}
		},

		data() {
			return {
				// 滚动区实例
				mescroll: null,
				msg: {},
				device_checked: '',
				device_maintained: '',
				device_repaired: '',
				quality_safe_rectified: '',
				quality_safe_accepted: '',
				quality_safe_accepted_yes: '',
				quality_safe_accepted_no: '',
				quality_safe_inspection: '',
				weigh_bridge_bill: '',
				msgLists: [],
				total1: '',
				total2: '',
				total3: '',
				total4: '',
				total5: '',
				total6: '',
				total7: '',
				total8: '',
				numtotal: 0
				// 
			}
		},

		watch: {
			// 监听底部导航双击触发
			// refresh(newVal) {
			//   if (newVal) this.fnRefreshData();
			// }
		},

		computed: {

		},
		mounted() {
			this.childMethod();
			console.log(this.height)
			// this.$forceUpdate()
		},
		methods: {
			childMethod() {
				megremind({
					username: this.$store.getters['user/getAccountInfoData'].username
				}).then(res => {
					this.msgLists = res.data.result.records;
					console.log('1111',this.msgLists)
					this.numtotal = this.msgLists.reduce((pre, rev) => {
						return pre + rev.total
					})
					console.log(this.numtotal)
					this.msgLists.forEach(a => {
						if (a.temCode == 'device_checked') {
							if (a.total == 0) {
								this.device_checked = true;
							} else {
								this.total1 = a.total
							}
						} else if (a.temCode == 'device_maintained') {
							if (a.total == 0) {
								this.device_maintained = true;
							} else {
								this.total2 = a.total
							}
						} else if (a.temCode == 'device_repaired') {
							if (a.total == 0) {
								this.device_repaired = true;
							} else {
								this.total3 = a.total
							}
						} else if (a.temCode == 'quality_safe_rectified') {
							if (a.total == 0) {
								this.quality_safe_rectified = true;
							} else {
								this.total4 = a.total
							}
						} else if (a.temCode == 'quality_safe_accepted') {
							if (a.total == 0) {
								this.quality_safe_accepted = true;
							} else {
								this.total5 = a.total
							}
						} else if (a.temCode == 'quality_safe_accepted_yes' || a.temCode ==
							'quality_safe_accepted_no') {
							if (a.total == 0) {
								this.quality_safe_accepted_yes = true;
							} else {
								this.total6 = a.total
							}
						} else if (a.temCode == 'quality_safe_inspection') {
							if (a.total == 0) {
								this.quality_safe_inspection = true;
							} else {
								this.total8 = a.total
							}
						}
					})
				})
			},
			goback() {
				uni.navigateBack()
			},
			gomsg(type, item) {
				uni.navigateTo({
					url: `/pages/shop/${type}?temCode=${item}`
				})
			}
		}
	}
</script>

<style scoped>
	.message {
		width: 321rpx;
		height: 339rpx;
		top: 305rpx;
		left: 211rpx;
	}

	.boxmesg {
		width: 100%;
		position: relative;
		bottom: 0rpx;
		background: #fff;
		left: 0;
		padding-bottom: 112rpx;
	}

	.head {
		width: 100%;
		height: 133rpx;
		padding-left: 28rpx;
		padding-right: 28rpx;
		line-height: 133rpx;
		background: linear-gradient(0deg, #235FED, #235FED);
		position: fixed;
		z-index: 999;
	}

	.boximgs {
		width: 21rpx;
		height: 38rpx;
	}

	.safe {
		width: 70%;
		margin-left: 80rpx;
	}

	.nonemsg {
		margin-top: 58rpx;

	}

	/* 列表样式 */
	.megList {
		display: flex;
		height: 158rpx;
		position: relative;
	}

	.megList image {
		width: 84rpx;
		height: 84rpx;
		margin: 34rpx 29rpx 40rpx 34rpx;
	}

	.megList .account {
		width: 80%;
		border-bottom: 1rpx solid #EEEEEE;
		font-family: 'PingFang';
	}

	.megList .account view:nth-child(1) {
		font-size: 33rpx;
		font-weight: 800;
		color: #181616;
		line-height: 130rpx;
	}

	.megList .account view:nth-child(2) {
		font-size: 25rpx;
		font-weight: 500;
		color: #979BA4;
		margin-top: -40rpx;
	}

	.megList .inform {
		position: absolute;
		top: 27rpx;
		left: 91rpx;
		width: 30rpx;
		height: 30rpx;
		background: red;
		border-radius: 50%;
		border: 1px solid #fff;
	}

	.megList .inform .infromnum {
		font-size: 21rpx;
		font-family: 'PingFang';
		font-weight: 800;
		color: #FFFFFF;
		text-align: center;
		line-height: 30rpx;
	}
</style>
