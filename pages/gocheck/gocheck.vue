<template>
  <view class="" style="position: relative;top:0;bottom: 0;background: #fff;z-index: 999;">
    <!-- 滚动内容区 -->
		<view class="head flex mauto cwhite sw f34r">
			<view class="boximgs mt8r" @tap="goback">
				<image src="../../static/fanhui1.png" mode="" class="hw100v"></image>
			</view>
			<view class="safe fcenter">去验收</view>
			<view>
				<text v-if="false">下一题</text>
			</view>
		</view>
		<view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>验收人</view>
				<!-- <view class="listrig">
					<input class="uni-input" v-model="updatepeoples" style="" type="text" placeholder="请选择整改人">
				</view> -->
				<view class="listrig">
					<picker @change="changePeople" :value="personPicker" :range="personList" :range-key="'personName'">
						<view class="uni-input" v-if="personPicker !==''">{{personList[personPicker].personName}}</view>
						<view class="uni-input" style="color: #E3E3E3;"v-else>请选择验收人</view>
					</picker>
				</view>
				<image src="../../static/jkpe.png" class="poarrow"></image>
			</view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>验收时间</view>
				<view class="listrig" @click="onShowDatePicker('datetime')">
					<view style="color: #E3E3E3;" v-if="datepent==1">请选择整改时间</view>
					<view v-if="datepent==2">{{datetime}}</view>
				</view>
				<mx-date-picker :show="showPicker" :type="type" :value="value" @confirm="onSelectedb" @cancel="onSelected" />
				<image src="../../static/rili.png" class="rili"></image>
			</view>
			<view class="processlist">
				<view class="listleft"><text class="start">*</text>验收状态</view>
				<view class="listrig" style="display: flex; justify-content: space-evenly;">
					<view v-for="(item,index) in array1" class="singlechose">
						<view class="square" @tap="choseSingle(index)" :class="{'singleconfim':singleconfim==index}">
							<text></text>
						</view>
						<text>{{item}}</text>
					</view>
				</view>
			</view>
			<view class="processlist" style="height: 213rpx;">
				<view class="listleft">验收说明</view>
				<view class="listrig textlist">
					<textarea placeholder="请输入详情描述" v-model="updatedetails">
						
					</textarea>
				</view>
			</view>
		</view>
		<view class="buttonyes" @tap="yesword">提交</view>
		<view class="buttoncancel" @tap="goback">取消</view>
	</view>
  </view>
</template>
<script>
import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
import {hiddendangeredit,personList} from '@/api/AlbumServer.js'
  export default {
	 data(){
		return{
			datepent:1,
			updatedetails:'',
			index:5,
			array: ['中国', '美国', '巴西', '日本'],
			index1:5,
			array1: ['合格','不合格'],
			showPicker: false,
			date: '2019/01/01',
			time: '15:00:12',
			datetime: '',
			range: ['2019/01/01','2019/01/06'],
			rangetime: ['2019/01/08 14:00','2019/01/16 13:59'],
			value: '',
			type:'datetime',
			updatepeoples:'',
			updateresult:'',
			updatepeopleid:'',
			parentVal:'',
			serios:{},
			singleconfim:1,
			pollingType: '',
			personList: [],
			personPicker: ''
		} 
	 },
    computed: {

    },
	components:{
		MxDatePicker
	},
	onLoad(options){	
		
		this.pollingType = options.pollingType;
		console.log(options)
		if(options.valent){
			console.log(JSON.parse(options.valent))
			this.parentVal=(JSON.parse(options.valent)).id
		}
		this.getPersonList()
	},
	onShow(){

	},
    methods: {
		getPersonList() {
			let params = {
				relTenantIds: this.$store.getters['user/getAccountInfoData'].relTenantIds,
				pageSize: 50,
			};
		
			personList(params).then(res => {
				console.log(res.data.code)
				if (res.data.code == 200) {
					this.personList = res.data.result.records;
					console.log('人员', this.personList)
				}
		
			})
		},
		changePeople(e) {
			this.personPicker = e.target.value;
		},
		choseSingle(index){
			this.singleconfim=index;
		},
      /// 跳转打开新窗口
      fnOpenWin(type) {
        uni.navigateTo({
          url: `/pages/news/${type}/${type}`
        })
      },
	  goback(){
		  uni.navigateBack()
	  },
	  yesword(){
		  if(!this.datetime.replace(/\//g,'-')){
			  uni.showToast({
			  	title:'带*号的不能为空',
			  	icon: 'none'
			  })
			  return
			}
		  let data={
			  	checkPerson: this.personList[this.personPicker].phone,
			  	relTenantIds: this.$store.getters['user/getAccountInfoData'].relTenantIds,
			  	checkDescribe: this.updatedetails,
				id:this.parentVal,
				checkStatus:this.singleconfim,
				orderStatus:2,
			  	checkTime: this.datetime.replace(/\//g,'-')+':00',
				orderType: this.pollingType
		  }
		  console.log(data)
		hiddendangeredit(data).then(res=>{
			console.log(res)
			if(res.status==200){
				uni.showToast({
					title:'验收成功'
				})
				setTimeout(()=>{
					if(this.pollingType){
						uni.navigateBack({})
					}else {
						uni.navigateBack({
						    delta: 2
						});
					}
					
				},1000)
			}else{
				uni.showToast({
					title:'验收失败'
				})
			}
		})
	  },  
	  onShowDatePicker(type){//显示
			this.showPicker = true;
			this.value = this[type];
		},
		onSelected() {//选择
			this.showPicker = false;
			
		},
		onSelectedb(e){
			this.datepent=2
			this.showPicker = false;
			this.datetime=e.value;
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
	page{
		background: #fff;
	}
	.head{
		width: 100%;
		height: 153rpx;
		line-height: 193rpx;
		background: linear-gradient(0deg, #235FED, #235FED);
	}
	.boximgs{
		width: 21rpx;
		height: 38rpx;
		padding-left: 30rpx;
	}
	.safe{
		  width: 70%;
		  padding-left:80rpx;
	}
	.processlist{
		height: 80rpx;
		line-height: 80rpx;
		padding-top:13rpx;
		padding-bottom: 13rpx;
		border-bottom: 1rpx solid #EAE7E7;
		display: flex;
		position: relative;
	}
	.photolist .listleft{
		font-size: 30rpx;
		font-family: 'PingFang SC';
		font-weight: bold;
		height: 80rpx;
		line-height: 80rpx;
		padding-top:13rpx;
		padding-bottom: 13rpx;
		color: #555555;
		width: 180rpx;
		text-align: right;
		padding-right: 40rpx;
	}
	.processlist .listleft{
		font-size: 30rpx;
		font-family: 'PingFang SC';
		font-weight: bold;
		color: #555555;
		width: 180rpx;
		border-right: 1rpx solid #EAE7E7;
		text-align: right;
		padding-right: 40rpx;
	}
	.listrig{
		width: 543rpx;
		padding-left: 18rpx;
		font-size: 30rpx;
		font-family: 'PingFang SC';
		font-weight: 500;
		line-height: 56rpx;
		/* color: #E3E3E3; */
	}
	.textlist{
		overflow: hidden;
		height: auto;
		overflow-y: scroll;
		line-height: 52rpx;
		padding-top: 10rpx;
	}
	.poarrow{
		position: absolute;
		width: 13rpx;
		height: 23rpx;
		right: 41rpx;
		top:39rpx;
		z-index: -2;
	}
	/* 样式 */
	.start{
		color:red;
		margin-top:14rpx;
	}
	.buttonyes,.buttoncancel{
		width: 625rpx;
		height: 90rpx;
		border-radius: 45rpx;		
		font-size: 35rpx;
		font-family: 'PingFang SC';
		font-weight: bold;
		color: #FFFFFF;
		margin:0 auto;
		line-height: 90rpx;
		text-align: center;		
		color: #fff;
	}
	.buttonyes {
		background: #649AFF;
		position: fixed;
		bottom: 190rpx;
		left: 63rpx;
	}
	
	.buttoncancel {
		border: 1px solid #BFBFBF;
		margin-top: 40rpx;
		position: fixed;
		bottom: 60rpx;
		left: 63rpx;
		color: #9C9C9C;
	}
	textarea{
		margin-top:18rpx;
		width: 540rpx;
	}
	.model{
		width: 200rpx;
		height: 167rpx;
		background: #FBFBFB;
		border: 1rpx solid #EAE7E7;
		margin-left: 33rpx;
		float: left;
		position: relative;
	}
	.model .adds{
		width: 31rpx;
		height: 31rpx;
		margin-top:55rpx;
		margin-left: 85rpx;
	}
	.model view{
		font-size: 20rpx;
		font-family: 'PingFang SC';
		font-weight: 500;
		color: #808184;
		text-align: center;
	}
	.uni-textarea-placeholder{
		color: #E3E3E3;
	}
	.rili{
		width: 30rpx;
		height: 29rpx;
		top:39rpx;
		right: 35rpx;
		position: absolute;
		z-index: -2;
	}
	uni-input{
		padding-top:20rpx;
	}
	.uni-input-placeholder{
		color:#E3E3E3
	}
	.singlechose{
	   display:flex;
	   align-items: center;
	}
	.square{
		width: 40rpx;
		height: 40rpx;
		position: relative;
		border: 1px solid #E1E1E1;
		border-radius: 50%;
		display: inline-block;
		margin-right: 17rpx;
		vertical-align: middle;
	}
	.square text{
		width: 13rpx;
		height: 13rpx;
		border-radius: 50%;
		display: inline-block;
		position: absolute;
		top:34%;
		left:36%
	}
	.singleconfim text{
		background: #235FED;
	}
</style>
