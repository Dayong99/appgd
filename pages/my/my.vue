<template>
  <view class="posir">
	 <view class="posia headmys f36r sw cwhite z100" :style="{'top':height+32+'px'}">我的</view>
	 <!-- 系统状态栏 -->
	 <view class="status_bar" :style="{height:height+'px'}">
	 </view>
	<view class="headmy">
		<image src="../../static/wode.png" class="hw100v"></image>
	</view>
	<view class="myent posia" :style="{'top':height+83+'px'}">
		<view class="flex" @tap="personmy">
			<view class="flex">
				<image src="../../static/touxiang.png" class="touxiangs"></image>
				<view>
					<view class="c555 sw f36r names">{{newsTotalData.personName?newsTotalData.personName:newsTotalData.realname}}</view>
					<view class="ca5 f24r sw">{{newsTotalData.workName?newsTotalData.workName:newsTotalData.post}}</view>
				</view>
			</view>
			<view class="arrows">
				<image src="../../static/myarr.png" class="hw100v"></image>
			</view>
		</view>
		<view class="horizontal"></view>
		<view class="flex hl104r sw f28r c181">
			<view>
				<image src="../../static/shouji.png" class="phone"></image>
				<text>{{newsTotalData.phone?newsTotalData.phone.substr(0,3):'0000'}}***{{newsTotalData.phone?newsTotalData.phone.substr(7,newsTotalData.phone.length):'0000'}}</text>
			</view>
			<view>
				<image src="../../static/shenfen.png" class="card"></image>
				<text>{{newsTotalData.idNumber?newsTotalData.idNumber.substr(0,3):'0000'}}****{{newsTotalData.idNumber?newsTotalData.idNumber.substr(7,newsTotalData.idNumber.length):"0000"}}</text>
			</view>
		</view>
	</view>
	<view class="botedit bgwhite mauto sw c181 f30r">
		<view class="flexr-jsb" @tap="changword()">
			<view class="flex">
				<image src="../../static/b1.png" class="mysuo"></image>
				<view class="characters">修改密码</view>
			</view>
			<view>
				<view class="arrows botnet">
					<image src="../../static/myarr.png" class="hw100v"></image>
				</view>
			</view>
		</view>
		<!-- <view class="flexr-jsb">
			<view class="flex">
				<image src="../../static/b2.png" class="mysuo"></image>
				<view class="characters">关于我们</view>
			</view>
			<view>
				<view class="arrows botnet">
					<image src="../../static/myarr.png" class="hw100v"></image>
				</view>
			</view>
		</view> -->
		<!-- <view class="flexr-jsb">
			<view class="flex">
				<image src="../../static/b3.png" class="mysuo"></image>
				<view class="characters">设置</view>
			</view>
			<view>
				<view class="arrows botnet">
					<image src="../../static/myarr.png" class="hw100v"></image>
				</view>
			</view>
		</view> -->
	</view>
	<view class="outlogin flexr-jsb bgwhite" @tap="logout">
		<view class="out sw f29r">退出登录</view>
		<view class="outlog">
			<image src="../../static/myarr.png" class="hw100v"></image>
		</view>
	</view>
  </view>
</template>

<script>
  import {
    fnUploadUpyunPic
  } from "@/utils/UniUtil.js"
  import {
    modifyUserMainBgPic,
    getUserInfo
  } from "@/api/UserServer.js"
  import {
    getSigninInfo,
  } from "@/api/HanbiServer.js"
  import {
    getMessageNoReadCount,logouts
  } from "@/api/MessageServer.js"

  export default {
    props: {
      // 连续触发刷新
      refresh: {
        type: Boolean,
        default: false
      },
	  height: {
		  type: Number,
		  default: 0
	  }
    },

    watch: {
      refresh(val) {
        if (val) this.fnRefreshUserInfo();
      }
    },
	data(){
		return{
			
		}
	},
    computed: {
		getimgSrc(snt){
			return this.$store.state.baseUrl+"/sys/common/static/"+snt
		},
      // 未读消息数量
      newsTotalData() {
        return this.$store.getters['user/getAccountInfoData']
      },
	  srcIMG(){
		  return this.$store.state.baseUrl+"/sys/common/static/"+this.$store.getters['user/getAccountInfoData'].headPic||'../../static/touxiang.png'
	  },
      // // 签到状态
      // signinStatusData() {
      //   return this.$store.getters['getSigninStatusData']
      // },
      // // 用户信息
      // userInfoData() {
      //   return this.$store.getters['user/getUserInfoData']
      // },
    },
	mounted(){
		console.log(this.height)
	},
    methods: {
		personmy(){
			console.log((new Date).getFullYear())
			uni.navigateTo({
				url:'/pages/my-news/my-news'
			})
		},
		async logout(){
			let res=await logouts();
			console.log(res)
			uni.showLoading({
			  title: '退出登录',
			  mask: true
			})
			setTimeout(() => {
			  uni.removeStorageSync('TOKEN');
			  uni.hideLoading()
			  // 跳转登录
			  uni.reLaunch({
			    url: '/pages/login/login'
			  })
			}, 1500); 
		},
      /// 跳转打开新窗口
      changword(type) {
        uni.navigateTo({
          url: '/pages/account-security/account-security'
        })
      },
      /// 跳转用户信息页
      fnUserInfo() {
        uni.navigateTo({
          url: `/pages/user-info/user-info?id=${this.userInfoData.ID}`
        })
      },

      /// 刷新用户信息消息
      fnRefreshUserInfo() {
        // 获得登录用户信息
        getUserInfo(this.userInfoData.ID).then(userinfoRes => {
          // 保存登录用户信息
          this.$store.commit('user/setUserInfoData', userinfoRes.data.Data);
          // 获取未读消息数
          return getMessageNoReadCount()
        }).then(mesRes => {
          // 保存未读消息数
          this.$store.commit('setNewsCountData', mesRes.data.Data)
          // 获取签到信息
          return getSigninInfo()
        }).then(signinRes => {
          // 保存签到信息
          this.$store.commit('setSigninInfoData', signinRes.data.Data)
        })
      }
      //
    }
  }
</script>

<style scoped>
  /* .my-cover {
    display: block;
    width: 100%;
    height: 260rpx;
  }

  .my-avatar {
    position: absolute;
    left: 0;
    top: -56rpx;
  }
	
  .my-nickname {
    color: #111111;
    font-size: 42rpx;
    margin-left: 150rpx;
  } */
  .status_bar{
  	background: linear-gradient(0deg, #235FED, #235FED);
  }
  page{
	  background: #e8e8e8;
  }
  .headmy{
	  height: 400rpx;
	  width: 750rpx;
  }
  .myent{
	  height: 306rpx;
	  width: 708rpx;	  
	  background: #FFFFFF;
	  box-shadow: 0px 3rpx 3rpx 0px rgba(174, 174, 174, 0.23);
	  border-radius: 10rpx;
	  left: 21rpx;
  }
  .touxiangs{
	width: 140rpx;
	height: 120rpx;
	margin-top:34rpx;
	margin-left: 47rpx;
	margin-bottom: 35rpx;
	margin-right: 33rpx;
  }
  .arrows{
	  width: 32rpx;
	  height: 31rpx;
	  position: absolute;
	  top: 91rpx;
	  right: 44rpx;
  }
  .phone{
	width: 15rpx;
	height: 19rpx;
	margin-left: 55rpx;
	 margin-right: 10rpx;
   }
   .card{
	   width: 23rpx;
	   height: 19rpx;
	   margin-left: 88rpx;
	   margin-right: 10rpx;
   }
   .horizontal{
	   width: 666rpx;
	   height: 1rpx;
	   background: #E6E6E6;
	   margin-left: 22rpx;
   }
   .headmys{
	   left: 50%;
	   margin-left: -34rpx;
   }
   .names{
	   margin-top:66rpx;
	   margin-bottom: 13rpx;
   }
   /* .arrows{
	   margin-left: 290rpx;
	   margin-top:91rpx;
   } */
   .mysuo{
		width: 63rpx;
		height: 62rpx;
		margin:40rpx 23rpx 0 46rpx;
	}
	/* 底部编辑 */
	.botedit{
		margin-top: 95rpx;
		width: 708rpx;		
		box-shadow: 0px 3rpx 3rpx 0px rgba(174, 174, 174, 0.23);
		border-radius: 10rpx;
		position: relative;
	}
	.botedit .characters{
		line-height: 140rpx;
	}
	.botnet{
		width: 32rpx;
		height: 31rpx;
		position: absolute;
		top:50rpx;
		right: 44rpx;
	}
	.outlogin{
		width: 708rpx;
		height: 97rpx;		
		box-shadow: 0px 3px 3px 0px rgba(174, 174, 174, 0.23);
		border-radius: 10rpx;
		margin:21rpx auto;
		line-height: 97rpx;
		position: relative;
	}
	.out{
		color: #E7541E;
		padding-left: 44rpx;
	}
	.outlog{
		width: 32rpx;
		height: 31rpx;
		position: absolute;
		top:9rpx;
		right: 44rpx;
	}
</style>
