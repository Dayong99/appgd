<template>
	<view style="background-color: #E8E8E8;">
		<view class="head flex mauto cwhite sw f34r">
			<view class="boximgs mt8r" @tap="BackGO">
				<image src="../../static/fanhui1.png"  class="hw100v"></image>
			</view>
			
			
			
			<view class="safe fcenter">成乐高速TJ-2标拌合站</view>
		</view>
		<view class="concon">
			<view class="top-img all-app">
				<view class="font-top top-font">累计任务分析</view>
				<view class="bort-zhu">
					<view style="display: flex;justify-content: center;position: relative;height: 223rpx;overflow: hidden;">
					  <cmd-circle cid="circle19" type="circle" :percent="listS.rateTotal" :showInfo="false" width="110" stroke-width="8" stroke-shape="round" stroke-color="#2A61FF" stroke-background="#9e9e9e"></cmd-circle>
					  <view style="position: absolute;text-align: center;top: 25%;">
					    <view style="font-size: 40rpx; color: #333333;">{{listS.rateTotal}}%</view>
					    
					    <view style="font-size: 28rpx;">计划完成率</view>
					  </view>
					</view>
					<view class="bort-ri-te font-text">
						<view>计划方数（m³）：<text class="font-DIN-Bold">{{listS.planTotal}}</text></view>
						<view>完成方数（m³）：<text class="font-DIN-Bold">{{listS.endTotal}}</text></view>
						<view>计划完成率：<text class="font-DIN-Bold">{{listS.rateTotal?listS.rateTotal:0}}%</text></view>
					</view>
				</view>
			</view>
			<view class="all-app all-capacity">
				<view class="font-top top-font">累计产能</view>
				<view class="all-capacity-top">
					<view class="">
						<view class="font-text">{{listSFis.deviceName}}</view>
						<image class="all-capacity-img" src="../../static/left-car.png"></image>
					</view>
					<view>
						<view class="font-text">{{listSFis.deviceName}}</view>
						<image class="all-capacity-img" src="../../static/right-car.png"></image>
					</view>
				</view>
				<view class="font-text all-cent">
					{{listS.endTotal}}m³
				</view>
				<view style="width: 100%; text-align: center;">
					 <view style="display: flex; margin-bottom: 20rpx; align-items: center;">
						 <view :style="{ width:didiFamily+'%' }" class="left-show"></view>
						 <image class="slider-foot"  src="../../static/lightning.png"></image>
						 <view  class="right-show"></view>
					</view>
					<view class="TheCompletedProgress-jt">
						<text>{{listSFis.endSum}}m³</text>
						<text>{{listSFisTw}}m³</text>
					</view>
				</view>
				<view class="Mixing-station-display" v-for="(item,index) in listS.sumTotal" :key="index">
					<view class="Mixing-station-display-top">{{item.deviceName}}</view>
					<view class="Mixing-station-display-bor">
						<view style="text-align: center;">
							<view class="font-text" style="color: #235FED;">
								{{item.endSum}}
							</view>
							<view class="font-text-fis">完成方数（m³）</view>
						</view>
						<view style="text-align: center;">
							<view class="font-text" style="color: #235FED;">
								{{item.taskNum}}
							</view>
							<view class="font-text-fis">任务数量（个）</view>
						</view>
						<view style="text-align: center;">
							<view class="font-text" style="color: #235FED;">
								{{item.rateSum}}%
							</view>
							<view class="font-text-fis">计划完成率</view>
						</view>
					</view>
				</view>
			</view>
			<view class="all-app" style="margin-top: 14rpx;">
				<view class="font-top top-font">配合比记录</view>
				<view class="all-qpp-The-selector">
					<view class="uni-list-cell-db font-text-fis">
						<picker @change="bindPickerChange" :value="index" :range="array">
							<text class="uni-input">{{array[index]}}</text>
							<image class="uni-input-img" src="../../static/top1.png"></image>
						</picker>
					</view>
					<view class="uni-list-cell-db font-text-fis">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						    <text class="uni-input">{{date}}</text>
							<image class="uni-input-img" src="../../static/top1.png"></image>
						 </picker>
					 </view>
				</view>
				<view>
					<view class="Mix-ratio-record">
						<text >
							<view class="font-text" style="color: #FFFFFF;">任务名称</view>
						</text>
						<text class="font-text" style="color: #FFFFFF;">
							<view class="font-text" style="color: #FFFFFF;">配方编号</view>
						</text>
						<text class="font-text" style="color: #FFFFFF;">
							<view class="font-text" style="color: #FFFFFF;">计划方数</view>
						</text>
						<text class="font-text" style="color: #FFFFFF;">
							<view class="font-text" style="color: #FFFFFF;">完成方数</view>
						</text>
					</view>
					<view class="Mix-ratio-record-row" v-for="(item,index) in ADetailedList">
						<view class="Mix-con-all all-text">{{item.taskName}}</view>
						<view class="Mix-con-all all-text">{{item.recipeNo}}</view>
						<view class="Mix-con-all">{{item.planCount}}</view>
						<view class="Mix-con-all">{{item.endCout}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import cmdCircle from "@/components/cmd-circle/cmd-circle.vue"
	import {getGrand,getList} from '@/api/AlbumServer.js'
	export default {
		components: {
			// Echarts,
			cmdCircle
		},
		data() {
			const currentDate = this.getDate({
			            format: true
			})
			return {
				valueL:30,
				listS:{},
				listSFis:{},
				listSFisTw:'',
				ADetailedList:{},
				percent:0,
				TheCompletedProgress:50,   //完成进度
				array: [],
				index: 0,
				date: currentDate,
				time: '12:01',
				 arr: {
					pageNo:1,
					pageSize:10,
					deviceNumber:'',
					relTenantIds:this.$store.getters['user/getAccountInfoData'].relTenantIds,
				},
			}
		},
		onLoad() {
			
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			didiFamily(){
				 // this.TheCompletedProgress = this.listSFis.endSum/this.listS.endTotal*100
				 this.TheCompletedProgress = 120/200*100
				 return this.TheCompletedProgress = this.TheCompletedProgress.toFixed(0)
			}
		 },
		mounted() {
			this.getGrandLit();	
		},
		methods:{
			BackGO() {
				uni.navigateBack();
			},
			getDate(type) {
			            const date = new Date();
			            let year = date.getFullYear();
			            let month = date.getMonth() + 1;
			            let day = date.getDate();
			
			            if (type === 'start') {
			                year = year - 60;
			            } else if (type === 'end') {
			                year = year + 2;
			            }
			            month = month > 9 ? month : '0' + month;;
			            day = day > 9 ? day : '0' + day;
			            return `${year}-${month}-${day}`;
			},
			//查询拌合站具体详情
			postList(arr){
				let _that = this
				getList(arr).then(res =>{
					if(res.data.code === 200){
						_that.ADetailedList = res.data.result.records
					}
				})
			},
			//日期选择器
			 bindDateChange: function(e) {
			    this.date = e.target.value
				this.arr.deliveryDate = this.date,  //时间
				this.postList(this.arr)
			 },
			//搅拌站选择器
			 bindPickerChange: function(e) {
			            this.index = e.target.value
						this.arr.deviceNumber = this.listS.sumTotal[e.target.value].deviceNumber
						this.postList(this.arr)
			 },
			//查询拌合站、
			getGrandLit(){
				let _that = this
				
				getGrand({relTenantIds:this.$store.getters['user/getAccountInfoData'].relTenantIds}).then(res =>{
					if(res.data.code===200){
						_that.listS = res.data.result
						_that.listSFis = _that.listS.sumTotal[0]
						_that.listSFisTw =  _that.listS.sumTotal[1].endSum
						_that.percent = res.data.result.rateTotal
						_that.arr.deviceNumber = res.data.result.sumTotal[0].deviceNumber
						_that.listS.sumTotal.forEach((arr) =>{
						_that.array.push(arr.deviceName)
						})
						_that.postList(_that.arr)
					}
				})
			},
		}
	}
</script>

<style scoped>
	.head {
		height: 235rpx;
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
	
	.concon{
		padding: 0rpx 21rpx;
	}
	.all-app {
			padding: 32rpx 34rpx;
			background: #FFFFFF;
			border-radius: 7rpx;
	}
	.top-img {
		height: 433rpx;
		position: relative;
		top: -55rpx;
	}
	.bort-zhu  {
		display: flex;
		margin-top: 50rpx;
		justify-content: space-evenly;
		align-items: center;
	}
	.font-top {
		font-family: PingFang-SC-Heavy;
		font-weight: Bold;
		color: #181616;
		font-size: 33rpx;
		
	}
	.font-DIN-Bold {
		display: inline-block;
		font-family: DIN-Bold;
		font-weight: Bold;
		color: #333333;
		font-size: 35rpx;
	}
	.top-font {
		line-height: 80rpx;
		/* margin: 32rpx 0rpx 0rpx 30rpx; */
	}
	.font-text {
		font-family: PingFang-SC-Heavy;
		font-weight: Bold;
		color: #666666;
		font-size: 28rpx;
	}
	.font-text-fis {
		font-family: PingFang-SC-Heavy;
		font-weight: Medium;
		color: #666666;
		font-size: 25rpx;
	}
	.bort-img {
		width: 237rpx;
		height: 237rpx;
		/* border: 16rpx solid; */
		/* border-image: linear-gradient(0deg, #2A61FF, #36ACFF) 10 10;
		background: linear-gradient(90deg, #2A61FF 0%, #36ACFF 100%); */
	}
	.bort-ri-te {
		line-height: 49rpx;
	}
	.all-capacity {
		margin-top: -41rpx;
	}
	.all-capacity-top {
		display: flex;
		justify-content: space-between;
	}
	.all-cent {
		width: 100%;
		text-align: center;
		color: #235FED;
	}
	.all-capacity-img {
		width: 113rpx;
		height: 53rpx;
	}
	.Mixing-station-display {
		width: 639rpx;
		height: 170rpx;
		background: #F6FAFF;
		border-radius: 7rpx;
		margin-top: 32rpx;
	}
	.Mixing-station-display-bor {
		display: flex;
		justify-content: space-around;
	}
	.Mixing-station-display-top {
		width: 108rpx;
		height: 36rpx;
		line-height: 36rpx;
		background: #235FED;
		border-radius: 7rpx 0rpx 7rpx 0rpx;
		text-align: center;
		font-family: PingFang-SC-Medium;
		font-weight: Medium;
		font-size: 22rpx;
		color: #FFFFFF;
		margin-bottom: 44rpx;
	}
	.Mix-ratio-record {
		width: 639rpx;
		height: 69rpx;
		line-height: 69rpx;
		background: #4D96FF;
		border-radius: 14rpx 14rpx 0rpx 0rpx;
		display: flex;
		justify-content: space-around;
	}
	.Mix-ratio-record-row {
		width: 639rpx;
		display: flex;
	}
	.Mix-con-all {
		width: 25%;
		text-align: center;
		height: 53rpx;
		line-height: 53rpx;
		 /* padding-left: 5px; */
	}
	.all-text {
		margin-left: 20rpx;
		text-align: center;
		text-overflow:ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.Mix-ratio-record-row:nth-child(even){
		background: #F6FAFF;
	}
	.all-qpp-The-selector {
		display: flex;
		justify-content: space-between;
		padding: 0rpx 12rpx;
		line-height: 55rpx;
		margin-bottom: 14rpx;
	}
	.uni-input-img {
		width: 23rpx;
		height: 13rpx;
		margin-left: 15rpx;
		transform: rotateX(180deg);
	}
	.TheCompletedProgress-jt {
		display: flex;
		justify-content: space-between;
	    padding: 0px 24rpx;
		margin-top: -20rpx;
	}
/* //目前死浮动后期当有空默认50%改变，上面86.6%-50% = 76rpx 约等于13% = 76rpx */  
	.slider-foot {
		    width: 24rpx;
		    height: 33rpx;
			/* margin-top: -4rpx; */
		    /* background-color: rgb(255, 255, 254); */
	}
    .right-img-all {
		display: flex;
		justify-content: center;
		position: relative;
		width: 200rpx;
		z-index: 999;
	}
	.echartsp {
		z-index: 999;
		height: 237rpx;
		width: 237rpx;
	}
	/* /deep/.uni-slider-thumb{
		display: none;
	} */
	.left-show {
		height: 17rpx;
		background: #FFD62D;
		border-radius: 8rpx;
		margin-right: -10rpx;
	}
	.right-show {
		flex: 1;
		height: 17rpx;
		background: #3084FF;
		border-radius: 8rpx;
		margin-left:-10rpx ;
	}
</style>
