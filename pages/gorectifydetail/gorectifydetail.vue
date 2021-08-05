<template>
	<view class="" style="position: relative;top:0;bottom: 0;background: #fff;z-index: 999;">
		<!-- 滚动内容区 -->
		<view class="head flex mauto cwhite sw f34r">
			<view class="boximgs mt8r" @tap="goback">
				<image src="../../static/fanhui1.png" mode="" class="hw100v"></image>
			</view>
			<view class="safe fcenter">待整改详情</view>
		</view>
		<view style="padding-top:147rpx;padding-left: 20rpx; margin-bottom: 20rpx;">
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>巡检时间</view>
				<view class="listrig">
					{{parentVal.inspectTime}}
				</view>
			</view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>巡检人</view>
				<view class="listrig">
					{{parentVal.inspector_dictText}}
				</view>
			</view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>责任人</view>
				<view class="listrig">
					{{parentVal.inspectDutyPerson_dictText}}
				</view>
			</view>
			<view class="processlist">
				<view class="listleft">问题部位</view>
				<view class="listrig">
					{{parentVal.inspectProblemArea}}
				</view>
			</view>
			<block v-if="pollingType ==='0'">
				<view class="processlist">
					<view class="listleft"><text class="start">*</text>问题分类</view>
					<view class="listrig">
						
						{{parentVal.inspectProblemClassify_dictText}}
					</view>
				</view>
			</block>
			<block v-if="pollingType === '1'">
				<view class="processlist">
					<view class="listleft"><text class="start">*</text>隐患类型</view>
					<view class="listrig">
						{{parentVal.hazardTypeId_dictText}}
					</view>
				</view>
				<view class="processlist">
					<view class="listleft"><text class="start">*</text>隐患事件</view>
					<view class="listrig">
						{{parentVal.hazardContentId_dictText}}
					</view>
				</view>
			</block>
			<view class="processlist" style="height: 213rpx;">
				<view class="listleft"><text class="start">*</text>整改内容</view>
				<view class="listrig textlist">
					{{parentVal.inspectContent}}
				</view>
			</view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>整改期限</view>
				<view class="listrig">
					{{parentVal.inspectValidityTime}}
				</view>
			</view>
			<view class="photolist">
				<view class="listleft">图片附件</view>
				<view>
					<view style="height: 200rpx;border-bottom: 1rpx solid #e7e7e7;">
						<view v-for="item in parentVal.inspectPath">
							<view class="model"  @click="previewImg(item)">
								<image :src=item style="width: 100%;height: 100%;"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="padding-top:5rpx;" v-if="parentVal.orderStatus==1 || parentVal.checkStatus !=null">
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>整改时间</view>
				<view class="listrig">
					{{parentVal.repairTime}}
				</view>
			</view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>整改人</view>
				<view class="listrig">
					{{parentVal.repairer}}
				</view>
			</view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>是否超时</view>
				<view class="listrig">
					{{parentVal.repairIsOutTime_dictText}}
				</view>
			</view>
			<view class="processlist" style="height: 213rpx;">
				<view class="listleft"><text class="start">*</text>整改描述</view>
				<view class="listrig">
					{{parentVal.repairDescribe}}
				</view>
			</view>
			<view class="photolist">
				<view class="listleft">图片附件</view>
				<view>
					<view style="height: 200rpx;border-bottom: 1rpx solid #e7e7e7;">
						<view v-for="item in parentVal.repairPath">
							<view class="model">
								<image :src=item style="width: 100%;height: 100%;"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="padding-top:5rpx;padding-left: 20rpx;" v-if="parentVal.orderStatus==2 || parentVal.checkStatus !=null">
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>验收时间</view>
				<view class="listrig">
					{{parentVal.checkTime}}
				</view>
			</view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>验收人</view>
				<view class="listrig">
					{{parentVal.checkPerson}}
				</view>
			</view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>验收状态</view>
				<view class="listrig">
					{{parentVal.checkStatus_dictText}}
				</view>
			</view>
			<view class="processlist" style="height: 213rpx;">
				<view class="listleft"><text class="start">*</text>验收说明</view>
				<view class="listrig">
					{{parentVal.checkDescribe}}
				</view>
			</view>
		</view>
		<view class="buttonyes" v-if="parentVal.orderStatus==0" @tap="yesword(0)">去整改</view>
		<view class="buttonyes" v-if="parentVal.orderStatus==1" @tap="yesword(1)">去验收</view>
		<!-- <view class="buttoncancel" @tap="goback">取消</view> -->
	</view>
	</view>
</template>
<script>
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import {
		updaterecords,
		beamfieldstatus
	} from '@/api/AlbumServer.js'
	export default {
		data() {
			return {
				datepent: 1,
				updatedetails: '',
				index: 5,
				array: ['中国', '美国', '巴西', '日本'],
				index1: 5,
				array1: ['是', '否'],
				showPicker: false,
				date: '2019/01/01',
				time: '15:00:12',
				datetime: '',
				range: ['2019/01/01', '2019/01/06'],
				rangetime: ['2019/01/08 14:00', '2019/01/16 13:59'],
				value: '',
				type: 'datetime',
				updatepeoples: '',
				updateresult: '',
				updatepeopleid: '',
				updateimg: '',
				parentVal: {},
				baseUrl:'',
				serios: {},
				pollingType: ''
			}
		},
		computed: {

		},
		components: {
			MxDatePicker
		},
		onLoad(options) {
			if (options.valent) {
				this.parentVal = JSON.parse(options.valent)
				console.log('待整改详情页面this.parentVal',this.parentVal)
			}
			this.pollingType = this.options.pollingType?this.options.pollingType:'';
			this.baseUrl = this.$store.state.baseUrl.toString()
		},
		onShow() {},
		methods: {
			cI() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						var imgFiles = res.tempFilePaths[0]
						console.log(imgFiles)
						// 上传图片
						// 做成一个上传对象
						var uper = uni.uploadFile({
							// 需要上传的地址
							url: that.baseUrl + '/sys/common/upload',
							// filePath  需要上传的文件
							filePath: imgFiles,
							name: 'file',
							header: {
								'X-Access-Token': uni.getStorageSync('TOKEN') || '',
							},
							success: (res) => {
								console.log(res.data)
								if (res.statusCode == 200) {
									that.updateimg = (JSON.parse(res.data)).message
									console.log((JSON.parse(res.data)).message)
								}
							}
						});
					}
				})
			},
			bindPickerChange: function(e) {
				this.index = e.target.value
			},
			bindPickerChange1: function(e) {
				console.log(e.target.value)
				this.index1 = e.target.value
			},
			/// 跳转打开新窗口
			fnOpenWin(type) {
				uni.navigateTo({
					url: `/pages/news/${type}/${type}`
				})
			},
			goback() {
				uni.navigateBack()
			},
			yesword() {
				let va = JSON.stringify(this.parentVal)
				if (this.parentVal.orderStatus == 0) {
					uni.navigateTo({
						url: '../gorectify/gorectify?valent=' + va
					})
				} else if (this.parentVal.orderStatus == 1) {
					uni.navigateTo({
						url: '../gocheck/gocheck?valent=' + va
					})
				}

				//   let data={
				// 	  	filePath: this.updateimg,
				// 	  	operator: this.updatepeopleid,
				// 	  	relTenantIds: this.$store.getters['user/getAccountInfoData'].relTenantIds,
				// 	  	remarks: this.updatedetails,
				// 	  	structLedgerId: this.parentVal.id,
				// 	  	structStatusSort: this.array1[this.index1].sort,
				// 	  	sysOrgCode: this.parentVal.sysOrgCode,
				// 	  	updateTime: this.datetime.replace(/\//g,'-')+':00'
				//   }
				//   console.log(data)
				// updaterecords(data).then(res=>{
				// 	console.log(res)
				// 	if(res.status==200){
				// 		uni.showToast({
				// 			title:'更新成功'
				// 		})
				// 		setTimeout(()=>{
				// 			uni.navigateBack({})
				// 		})
				// 	}else{
				// 		uni.showToast({
				// 			title:'更新失败'
				// 		})
				// 	}
				// })
			},
			onShowDatePicker(type) { //显示
				this.showPicker = true;
				this.value = this[type];
			},
			onSelected() { //选择
				this.showPicker = false;

			},
			onSelectedb(e) {
				this.datepent = 2
				this.showPicker = false;
				this.datetime = e.value;
			},
			previewImg(logourl) {
				let _this = this;
				let imgsArray = [];
				imgsArray[0] = logourl
				uni.previewImage({
					current: 0,
					urls: imgsArray
				});
			},
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
		position: fixed;
		z-index: 999;
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

	.processlist {
		height: 80rpx;
		line-height: 80rpx;
		padding-bottom: 13rpx;
		border-bottom: 1rpx solid #EAE7E7;
		display: flex;
		position: relative;
	}

	.photolist .listleft {
		font-size: 30rpx;
		font-family: 'PingFang SC';
		font-weight: bold;
		height: 80rpx;
		line-height: 80rpx;
		padding-top: 13rpx;
		padding-bottom: 13rpx;
		color: #555555;
		width: 180rpx;
		text-align: right;
		padding-right: 40rpx;
	}

	.processlist .listleft {
		font-size: 30rpx;
		font-family: 'PingFang SC';
		font-weight: bold;
		color: #555555;
		border-right: 1rpx solid #EAE7E7;
		width: 180rpx;
		text-align: right;
		padding-right: 40rpx;
	}

	.listrig {
		width: 543rpx;
		padding-left: 18rpx;
		font-size: 30rpx;
		font-family: 'PingFang SC';
		font-weight: 500;
	}
	.textlist{
		overflow: hidden;
		height: auto;
		overflow-y: scroll;
		line-height: 52rpx;
		padding-top: 12rpx;
	}
	.poarrow {
		position: absolute;
		width: 13rpx;
		height: 23rpx;
		right: 41rpx;
		top: 39rpx;
		z-index: -2;
	}

	/* 样式 */
	.start {
		color: red;
		margin-top: 14rpx;
	}

	.buttonyes,
	.buttoncancel {
		width: 625rpx;
		height: 90rpx;
		border-radius: 45rpx;
		font-size: 35rpx;
		font-family: 'PingFang SC';
		font-weight: bold;
		color: #FFFFFF;
		margin: 0 auto;
		line-height: 90rpx;
		text-align: center;
		color: #fff;
	}

	.buttonyes {
		background: #649AFF;
	}

	.buttoncancel {
		border: 1px solid #BFBFBF;
		margin-top: 40rpx;
		position: fixed;
		bottom: 69rpx;
		left: 63rpx;
		color: #9C9C9C;
	}

	textarea {
		margin-top: 18rpx;
		width: 540rpx;
	}

	.model {
		width: 200rpx;
		height: 167rpx;
		background: #FBFBFB;
		border: 1rpx solid #EAE7E7;
		margin-left: 33rpx;
		float: left;
	}

	.model .adds {
		width: 31rpx;
		height: 31rpx;
		margin-top: 55rpx;
		margin-left: 85rpx;
	}

	.model view {
		font-size: 20rpx;
		font-family: 'PingFang SC';
		font-weight: 500;
		color: #808184;
		text-align: center;
	}

	.uni-textarea-placeholder {
		color: #E3E3E3;
	}

	.rili {
		width: 30rpx;
		height: 29rpx;
		top: 39rpx;
		right: 35rpx;
		position: absolute;
		z-index: -2;
	}

	uni-input {
		padding-top: 20rpx;
	}

	.uni-input-placeholder {
		color: #E3E3E3
	}
</style>
