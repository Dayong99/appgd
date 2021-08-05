<template>
	<view class="page">
		<view class="head flex mauto cwhite sw f34r">
			<view class="boximgs mt8r" @click="BackGO">
				<image src="../../static/fanhui1.png" mode="" class="hw100v"></image>
			</view>
			<view class="safe fcenter">压力机</view>
		</view>
		<view class="page_cont">
			<view class="page_head">
				<picker class="page_head_title" :range="list" :range-key="'deviceName'" @change="bindPickerChange" :value="index">
					<text class="title">{{deviceName}}</text>
					<image class="page_head_icon"></image>
				</picker>
				<image class="page_head_img" :src="devicePic"></image>
			</view>
			
			<view class="data">试验数据信息</view>
			
			<view class="cont_item" @click="toList">
				<view class="info">
					<text class="title">已完成试验:</text>
					<text class="data">{{testRoomCount}}</text>
				</view>
				<image></image>
			</view>
			<view class="ech-img">
				<view class="ech-img-top">
					<view class="ech-bia">试件块数统计</view>
					<!-- <view>
						<text class="ech-te">2021/6/27 ~ 2021/7/7</text>
						<image class="img-fis" src="../../static/rilitime.png"></image>
					</view> -->
				</view>
				<view class="echart">
					<echarts-el :option="option" style="height: 200px;"></echarts-el>
				</view>
			</view>


			
		</view>
	</view>
</template>

<script>
	import { countEndFlag,appList,appTestCount } from '@/api/AlbumServer.js'
	import EchartsEl from '@/components/echarts/echarts-el.vue'
	export default {
		components: {
			EchartsEl
		},
		data() {
			return {
				option: {
					 title: {
					        left: 'center',
					        text: '',
					    },
					
					xAxis:[
						{
						    type: 'category',
						    data: []
						}
						
					],
					yAxis: {
						data:[],
					    type: 'value'
					},
					series: [{
					    data: [],
					    type: 'line',
						areaStyle: {
							normal: {
								color: '#ff9a52' //改变区域颜色
							}
						},
						itemStyle: {
							normal: {
								color: '#ff9a52', //改变折线点的颜色
								lineStyle: {
									color: '#ff9a52' //改变折线颜色
								}
							}
						},
					}]
				},
				index:0,
				classID:0,
				list: [],
				devicePic:'',
				title: "压力机",
				deviceName:'',
				testRoomCount: null
			}
		},
	
		onLoad(option) {
			this.getCountEndFlag();
			
		},
		mounted() {
			this.QueryEquipment();
		},
		methods: {
			// APP-统计压力机万能机设备试验块数
			getTestCount(arr){
				let _that = this
				_that.option.xAxis[0].data
				appTestCount(arr).then(res =>{
					if(res.data.code = 200){
						_that.option.xAxis[0].data = []
						_that.option.series[0].data = []
						res.data.result.forEach((item) =>{
							_that.option.xAxis[0].data.push(item.dateTime)
							_that.option.series[0].data.push(item.total)
						})
					}
					console.log(res.data.result)
				})
			},
			//点击切换设备
			bindPickerChange(e){
				console.log(e)
				this.index = e.detail.value;
				this.deviceName = this.list[this.index].deviceName
				this.devicePic = this.list[this.index].devicePic
				this.testRoomCount = this.list[this.index].testRoomCount
				let att = {
					relTenantIds: this.$store.getters['user/getAccountInfoData'].relTenantIds,
					deviceNumber: this.list[this.index].deviceNumber,
					deviceCatagory: this.list[this.index].deviceCatagory,
				}
				this.getTestCount(att)
				
			},
			//查询设备
			QueryEquipment(){
				let arr = {
					deviceCatagory:'universal,puress',
					pageNo:1,
					pageSize:10,
					relTenantIds:this.$store.getters['user/getAccountInfoData'].relTenantIds
				}
				appList(arr).then(res => {
					if(res.data.code===200){
						this.list = res.data.result.records
						this.deviceName = res.data.result.records[0].deviceName
						this.devicePic = res.data.result.records[0].devicePic
						this.testRoomCount = res.data.result.records[0].testRoomCount
						console.log(this.list)
						let att = {
							relTenantIds: this.$store.getters['user/getAccountInfoData'].relTenantIds,
							deviceNumber: res.data.result.records[0].deviceNumber,
							deviceCatagory: res.data.result.records[0].deviceCatagory,
						}
						this.getTestCount(att)
					}
				
				})
			},
			// deviceList
			BackGO() {
				uni.navigateBack()
			},
			getCountEndFlag() {
				countEndFlag({
					relTenantIds: this.$store.getters['user/getAccountInfoData'].relTenantIds
				}).then(res => {
					if(res.data.code == 200 && res.data.result.yes != null) {
						this.doneAmount = res.data.result.yes;
					}
					
				})
			},
			toList() {
				let lists = {
					deviceCatagory:this.list[this.index].deviceCatagory,   //"puress"压力机   "universal"万能机
					deviceNumber:this.list[this.index].deviceNumber,    //设备唯一编号
					deviceTypeId:this.list[this.index].deviceTypeId,    //设备类型ID
				}
				console.log(lists)
				let item = encodeURIComponent(JSON.stringify(lists))
				uni.navigateTo({
				  url: '/pages/experimentList/experimentList?lists='+item
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.head{
		width: 100%;
		height: 170rpx;
		line-height: 170rpx;
		background: linear-gradient(0deg, #235FED, #235FED);
	}
	.boximgs{
		width: 21rpx;
		height: 38rpx;
		margin-left: 30rpx;
	}
	.safe{
		  width: 100%;
	}
	.page{
		position: absolute;
		top: 0; bottom: 0; left: 0; right: 0;
		background: #E8E8E8;
		overflow: hidden;
		.blue{
			height: 40upx;
			background: #235FED;
		}
		.page_cont{
			height: 100%;
			background: #fff;
			margin: 0 16upx;
			margin-top: -40upx;
			border-top-left-radius: 16upx;
			border-top-right-radius: 16upx;
			padding: 0 24upx;
		}
		.page_head{
		
			padding-top: 34upx;
			.page_head_title{
				.title{
					color: #181616;
					font-size: 33upx;
					font-weight: 800;
				}
				.page_head_icon{
					width: 23upx;
					height: 14upx;
					background: url('../../static/punch/dropdown.png') no-repeat;
					background-size: 100% 100%;
					margin-left: 17upx;
					margin-bottom: 6upx;
				}
			}
			.page_head_img{
				margin-top: 34upx;
				margin-bottom: 62upx;
				height: 316upx;
				// background: url(../../static/punch/punchBanner.png) no-repeat;
				background-size: cover;
				width: 100%;
			}
		}
		.data{
			font-weight: 800;
			font-size: 33upx;
			margin-bottom: 42upx;
		}
		.cont_item{
			color: #fff;
			height: 175upx;
			background: url(../../static/TocompleteBackground.png) no-repeat;
			border-radius: 14upx;
			background-size: cover;
			margin-bottom: 20upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 32upx;
			image{
				width: 40upx; 
				height: 40upx; 
				background: url('../../static/punch/enter.png') no-repeat;
				background-size: cover;
			}

			.info{
				 line-height: 87upx;
				.title{font-size: 33upx; margin-right: 34upx; line-height: 87upx;}
				.data{font-size: 56upx; line-height: 87upx;}
			}
		}
		
	}
	.ech-img {
		margin-top: 43rpx;
		.ech-img-top {
			display: flex;
			justify-content: space-between;
			font-family: PingFang-SC-Medium;
			color: #181616;
			font-weight: Heavy;		
			font-size: 33rpx;
			.ech-te {
				font-weight: Medium;
				color: #57585A;
				font-size: 28rpx;
			}
			.img-fis {
				width: 30rpx;
				height: 29rpx;
				margin-left: 14rpx;
			}
		}
	}
	.echart{
		// width: 708rpx;
		// height: 330rpx;
		// maring:0rpx auto;
		border-radius: 7px;
		background: #fff;
		margin-top:-40rpx;
	}
</style>
