<template>
  <view style="position: absolute;background: #fff;width: 100%;">
	<view class="homeback">
		<image src="../../static/aaa.png"></image>
		<view><text :title="projectList.companyName">{{projectList.companyName |formatData}}</text></view>
	</view>
	<view class="content">
		<view class='home'>
			<swiper
			indicator-dots 	
			circular
			autoplay
			interval=3000
			>
				<swiper-item v-for="(item,index) in swipers" :key="index">
					<image :src="item"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="funcont">
			<view v-for="item in permissionInfos">
				<view class="funclist" @tap="fnOpenWin(item.appUrl)">
					<image v-if="item.appPic == null" src="../../static/juxing.png"></image>
					<image v-else :src="item.appPic"></image>
					<view class="functext">{{item.appPermissionName}}</view>
				</view>
			</view>
			<!-- <view class="funclist" @tap="fnOpenWin('wagon')">
				<image src="../../static/juxing.png"></image>
				<view class="functext">项目管理</view>
			</view> -->
		<!-- 	<view class="funclist" @tap="fnOpenWin('beamfield')">
				<image src="../../static/twos.png"></image>
				<view class="functext">智慧梁场</view>
			</view> -->
			<!-- <view class="funclist" @tap="fnOpenWin('equipment')">
				<image src="../../static/threes.png"></image>
				<view class="functext">设备维保</view>
			</view>
			<view class="funclist" @tap="fnOpenWin('qualityPolling')">
				<image src="../../static/fours.png"></image>
				<view class="functext">质量巡检</view>
			</view>
			<view class="funclist" @tap="fnOpenWin('polling')">
				<image src="../../static/fives.png"></image>
				<view class="functext">安全巡检</view>
			</view>
			<view class="funclist" @tap="fnOpenWin('punch')">
				<image src="../../static/ylj.png"></image>
				<view class="functext">压力机</view>
			</view>
			<view class="funclist" @tap="fnOpenWin('deviceList')">
				<image src="../../static/video.png"></image>
				<view class="functext">视频监控</view>
			</view>
			<view class="funclist" @tap="fnOpenWin('wagon')">
				<image src="../../static/sevens.png"></image>
				<view class="functext">物资管理</view>
			</view>
			<view class="funclist" @tap="fnOpenWin('document')">
				<image src="../../static/eights.png"></image>
				<view class="functext">资料管理</view>
			</view> -->
			<!-- <view class="funclist" @tap="fnOpenWin('home')">
				<image src="../../static/nines.png"></image>
				<view class="functext">更多</view>
			</view> -->
		</view>
		<view class="prjectbot">
			<view class="projectmsg">项目信息</view>
			<view class="projectinfo">
				<view class="flex scale">
					<image src="../../static/qiandai.png"></image>
					<view>
						<view class="bottop">{{projectList.investmentScale}}{{projectList.investmentScaleUnit_dictText}}</view>
						<view class="botbot">投资规模</view>
					</view>
				</view>
				<view class="flex scale">
					<image src="../../static/jianzhu.png"></image>
					<view>
						<view class="bottop">{{projectList.projectStatus}}</view>
						<view class="botbot">工程状态</view>
					</view>
				</view>
				<view class="flex scale">
					<image src="../../static/riliS.png"></image>
					<view>
						<view class="bottop">{{Tian}}天</view>
						<view class="botbot">合同工期</view>
					</view>
				</view>
				<view class="flex scale">
					<image src="../../static/anquanguanli.png"></image>
					<view>
						<view class="bottop">{{productTian}}天</view>
						<view class="botbot">安全生产</view>
					</view>
				</view>
			</view>
		</view>
	</view>
  </view>
</template>
<script>
	import {
	  projectList,menuList
	} from "@/api/AlbumServer.js"
  export default {
	data(){
		return{
			punishListData:[],
			title: 'Hello',
			projectList:{},
			swipers:[],
			Tian:'',
			productTian:'',
			permissionInfos:[]
		}
	},
	props:{
		
	},
    computed: {
		
    },
	mounted(){
		this.init();
		this.menulist();
	},
	filters:{
		formatData(data){
					if( data && data.length>10){
						let arr1 = data.slice(0,3)
						let arr2 = data.slice(-3)
						return  arr1.concat('...',arr2)
					}
					return data
					}
	},
    methods: {
		//点击显示全部
		showName(){
			console.log(this.projectList.companyName)
		},
		menulist(){
			menuList({relTenantIds:this.$store.getters['user/getAccountInfoData'].relTenantIds}).then(res=>{
				 const type = res.data.result[0].appUrl
				if (res.data.result.length === 1){
					uni.redirectTo({
						  url: `/pages/${type}/${type}`
						})
				}else {
					this.permissionInfos=res.data.result;
				}
				
				
				console.log(res.data.result)
			})
		},
      /// 跳转打开新窗口
      fnOpenWin(type) {
        uni.navigateTo({
          url: `/pages/${type}/${type}`
        })
      },
	  goback(){
		  uni.navigateBack()
	  },
	  init(){
		  projectList({relTenantIds: this.$store.getters['user/getAccountInfoData'].relTenantIds,}).then(res=>{
			 this.projectList=res.data.result.records[0];
			  this.swipers=res.data.result.records[0].projectImageUrl.split(',')
			  let end= this.projectList.projectEndDate
			  let start=this.projectList.projectStartDate 
			  this.Tian=(new Date(end).getTime()-new Date(start).getTime())/24/60/60/1000
			  this.productTian=((new Date().getTime()-new Date(start).getTime())/24/60/60/1000).toFixed(0)
		  })
	  }
    }
  }
</script>

<style scoped>
	.homeback{
		width: 100%;
		position: relative;
	}
	.homeback image{
		width: 100%;
		height: 410rpx;
	}
	.homeback view{
		position: absolute;
		top:85rpx;
		z-index: 999;
		color: #fff;
		width: 100%;
		text-align: center;
	}
	.content{
		position: relative;
		top:-230rpx;
		width: 694rpx;
		height: 382rpx;
		margin:0 auto;
		border-radius: 10rpx;
	}
	.home{
		border-radius: 10rpx;
	}
	.home swiper{
		width: 694rpx;
		height: 382rpx;
		border-radius: 10rpx;
	}
	.home swiper image{
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}
	/* 功能 */
	.funcont{
		background: #FFFFFF;
		box-shadow: 0px 0px 11rpx 0px rgba(0, 0, 0, 0.17);
		border-radius: 10rpx;
		margin:0 auto;
		display: flex;
		flex-wrap: wrap;
		margin-top:56rpx;
		overflow: hidden;
		padding-bottom: 40rpx;
	}
	.funcbox{
	/* 	display: flex;
		justify-content: space-around; */
		
	}
	.funcont .funclist{
		flex: 25%;
		/* float: left; */
		margin:2rpx 35rpx;
	}
	.funcont image{
		width: 54rpx;
		height: 54rpx;
		margin:37rpx 21rpx 33rpx 24rpx;
	}
	.funcont .functext{
		font-size: 25rpx;
		font-family: 'PingFang';
		font-weight: 500;
		color: #4A4A4A;
		text-align: center;
	}
	.projectmsg{
		font-size: 35rpx;
		font-family: 'PingFang';
		font-weight: 800;
		color: #222222;
		margin-top:51rpx;
		margin-bottom: 34rpx;
	}
	.projectinfo image{
		width: 62rpx;
		height: 73rpx;
		margin:48rpx 43rpx 44rpx 49rpx;
	}
	.projectinfo .scale{
		width: 336rpx;
		height: 164rpx;
		background: #FBFBFB;
		border-radius: 7rpx;
		float: left;
	}
	.projectinfo .scale:nth-of-type(odd){
		margin-right: 22rpx;
	}
	.projectinfo .scale:nth-child(3),.projectinfo .scale:nth-child(4){
		margin-top:21rpx;
	}
	.projectinfo .bottop{
		font-size: 33rpx;
		font-family: 'PingFang';
		font-weight: 800;
		color: #5B5B5B;
		line-height: 140rpx;
	}
	.projectinfo .botbot{
		font-size: 25rpx;
		font-family: 'PingFang';
		font-weight: 500;
		color: #999999;
		margin-top:-50rpx;
	}
	/* 轮播 */
</style>
