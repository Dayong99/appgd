<template>
	<view>
		<view class="head flex mauto cwhite sw f34r">
			<view class="boximgs mt8r" @tap="goback">
				<image src="../../static/fanhui1.png" mode="" class="hw100v"></image>
			</view>
			<view class="safe fcenter">资料列表</view>
		</view>
		<!-- 滚动内容区 -->
		<mescroll-uni @down="downCallback" @up="upCallback" :top="155">
			<view v-for="(item,index) in resource" :key="index" class="flex bgwhite entctron">
				<view class="detailfient" @tap="godetails(item)">
					<image src="../../static/add.png" class="pdfval"></image>
					<view>
						<view class="namepng">{{item.fileName}}{{'.'}}{{item.fileType}}</view>
						<view style="display: flex;" class="timesize">
							<view>{{item.createTime}}</view>
							<view>{{'&nbsp;'}}{{item.fileSize}}</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		doucmentLists
	} from '@/api/AlbumServer.js'
	export default {
		data() {
			return {
				archivesTreeId: '',
				confirmText: ''
			}
		},
		computed: {
			// 资料列表
			resource() {
				return this.$store.getters['common/resource']
			},
		},
		onLoad(val) {
			// if (val & val.id) {
			this.archivesTreeId = val.id
			// } else {
			this.confirmText = val.confirmText
			console.log(this.confirmText, 'this.confirmText')
			console.log(val, 'val')
			// }
		},
		methods: {
			godetails(item) {
				console.log('pdf',item)
				uni.navigateTo({
					url: `../webview/webview?data=${encodeURIComponent(JSON.stringify(item))}`
				})
			},
			goback() {
				uni.navigateBack()
			},
			// 下拉刷新的回调
			downCallback(mescroll) {
				console.log('chuuih')
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 mescroll.num=1, 再触发upCallback方法 )
				mescroll.resetUpScroll()
			},
			// 上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10
			// 在页面加载之初及下拉时，将获取到的数据放入vuex，再在本页面的computed实时计算新的数据
			upCallback(mescroll) {
				if (this.archivesTreeId) {
					doucmentLists({
						pageNo: mescroll.num,
						pageSize: mescroll.size + 1,
						archivesTreeId: this.archivesTreeId,
					}).then(violaRes => {
						console.log(violaRes, 'violaRes')
						if (mescroll.num == 1) {
							this.$store.commit('common/resourceList', violaRes.data.result.records)
						} else {
							this.$store.commit('common/resourceList', this.resource.concat(violaRes.data.result
								.records))
						}
						mescroll.endSuccess(violaRes.data.result.records.length, violaRes.data.result.records
							.length >=
							mescroll.size);
					}).catch(() => {
						mescroll.endErr();
					})
				} else {
					doucmentLists({
						pageNo: mescroll.num,
						pageSize: mescroll.size,
						fileName: '*' + this.confirmText + '*',
						relTenantIds: this.$store.getters['user/getAccountInfoData'].relTenantIds
					}).then(violaRes => {
						console.log(violaRes, 'violaRes')
						if (mescroll.num == 1) {
							this.$store.commit('common/resourceList', violaRes.data.result.records)
						} else {
							this.$store.commit('common/resourceList', this.resource.concat(violaRes.data.result
								.records))
						}
						mescroll.endSuccess(violaRes.data.result.records.length, violaRes.data.result.records
							.length >=
							mescroll.size);
					}).catch(() => {
						mescroll.endErr();
					})
				}
			}
		}
	}
</script>

<style>
	.head {
		width: 694rpx;
		height: 153rpx;
		padding-left: 28rpx;
		padding-right: 28rpx;
		line-height: 193rpx;
		background: linear-gradient(0deg, #235FED, #235FED);
	}

	.boximgs {
		width: 21rpx;
		height: 38rpx;
	}

	.safe {
		width: 70%;
		margin-left: 80rpx;
	}

	.detailfient {
		display: flex;
		height: 120rpx;
		line-height: 50rpx;
		border-bottom: 1rpx solid #EAE7E7;
		width: 100%;
	}

	.pdfval {
		width: 49rpx;
		height: 49rpx;
		margin-left: 38rpx;
		margin-right: 34rpx;
		margin-top: 36rpx;
	}

	.namepng {
		font-size: 32rpx;
		font-family: 'PingFang SC';
		font-weight: bold;
		color: #444444;
		margin-top: 18rpx;
		margin-bottom: -13rpx;
		overflow: hidden;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}

	.timesize {
		font-size: 24rpx;
		font-family: 'PingFang SC';
		font-weight: bold;
		color: #C5C5C5;
	}
</style>
