<template>
  <view>
	  <view class="head flex mauto cwhite sw f34r" :style="{'padding-top':statusBarHeight+'px'}">
	  	<view class="boximgs mt8r" @tap="goback">
	  		<image src="../../static/fanhui1.png" mode="" class="hw100v"></image>
	  	</view>
	  	<view class="safe fcenter">视频详情</view>
	  	<view>
	  		<text v-if="chosenext">下一题</text>
	  	</view>
	  </view>
	  <view class="pl33r bbs2r">
	  	<view class="sw c181 f42r titel ellipsis">{{videoDetail.title}}</view>
	  	<view class="flexr-jsb c979 sw f25r mb19r">
	  		<view>上传时间：{{videoDetail.createTime}}</view>
	  		<view style="margin-right:56rpx;">上传人：{{videoDetail.createBy_dictText}}</view>
	  	</view>
	  </view>
	  <view class="bfff0 pl33r hl69r w100v mt19r mb28r">
		  <text v-if="noneread">还需观看 <text class="cee mlr20r">{{videoDetail.lookTime}}</text>，获取 <text class="cee">+{{videoDetail.score}} </text>分</text>
		  <text v-if="haveread" class="cee mlr20r">谢谢您的观看，您已获得 +{{videoDetail.score}} 分！</text>
		   <text v-if="moreread" class="cee mlr20r f28r">谢谢您的观看，今日观看已超过上限，此次观看未有积分！</text>
		  <!-- <text>还需观看 <text class="cee mlr20r">{{videoDetail.lookTime}}</text>，获取 <text class="cee">+{{videoDetail.score}}</text>分</text> -->
	  </view>
	  <view class="videoboxs mauto">
		 <!-- <video src="" controls class="hw100v"></video> -->
		 <video id="myVideo" @click="playVideo" class="hw100v" :src="tempFilePaths" @error="videoErrorCallback" muted enable-danmu danmu-btn autoplay controls></video>
	  </view>
  </view>
</template>

<script>
  import {
    fnFormatDate
  } from "@/utils/CommonUtil.js"
  import {
    previewImage
  } from "@/utils/UniUtil.js"
  import {
    getAlbumInfo
  } from "@/api/AlbumServer.js"
  import {
    getTopList,
    addTop,
    delTop,
    getCommentList,
    addComment,
    delComment,
    addCommentTop,
    delCommentTop,
    addSave,
    delSave
  } from "@/api/InteractServer.js"
  import {
    addUserAtte,
    delUserAtte,
	AddScore
  } from "@/api/UserServer.js"

  // 分享弹出层组件
  import SharePopup from '@/components/share-popup/share-popup'
  // 评论列表单元组件
  // 评论输入弹出层组件
  import CommInput from '@/components/comm-input/comm-input'

  export default {
    components: {
      SharePopup,
      CommInput
    },

    data() {
      return {
		  haveread:false,
		  noneread:true,
		  moreread:false,
        // 摄影项ID
		chosenext:false,
        albumID: -1,
        // 跳转来源页
        fromPage: '',
        // 来源页标签数据下标
        current: -1,
        // 回复添加父ID
        replyParentID: -1,
        // mescroll组件实例
        mescroll: null,
		videoDetail:{},
		timemy1:'',
		videoContext:'',
		tempFilePaths:'',
		articelId:'',
		statusBarHeight:0
      }
    },

    onLoad(options) {
      if (options && options.videLook) {
        console.log(JSON.parse(options.videLook));
		this.videoDetail=JSON.parse(options.videLook)
		this.articelId=JSON.parse(options.videLook).id
		// ideoDetail.videoFile
		uni.downloadFile({
			 url: this.videoDetail.videoFile,
			 success: (res) => {
			 if (res.statusCode === 200) {
				 this.tempFilePaths=res.tempFilePath
			 }
			}
		})
		if(this.videoDetail.operaStatus==1){
			this.moreread=true;
			this.noneread=false;
		}else{ 
			this.setTimeCount()
			this.moreread=false;
			this.noneread=true;
			// if(this.$store.getters['album/getAlbumInfoData'].videoSubject==this.$store.getters['album/getAlbumInfoData'].numVideo){
			// 	this.moreread=true;
			// 	this.noneread=false;
			// 	this.haveread=false;
			// }else{
			// 	this.setTimeCount()
			// }
		}
		
        // uni.showLoading({
        //   title: "加载中",
        //   mask: true
        // })
        // this.albumID = parseInt(options.id);
        // setTimeout(() => {
        //   uni.hideLoading()
        //   if (typeof options.fromPage == 'string') this.fromPage = options.fromPage
        //   if (typeof options.current == 'string') this.current = parseInt(options.current)
        //   if (typeof options.comm == 'string') {
        //     setTimeout(() => {
        //       this.fnCommOpen()
        //     }, 1000)
        //   }
        // }, 1500)
      }
	  this.statusBarHeight = this.$store.getters['common/getStatusBarHeight']
    },

    computed: {
      // 摄影信息
      albumInfoData() {
        return this.$store.getters['album/getAlbumInfoData']
      },
      // 动态点赞列表数据
      topListData() {
        return this.$store.getters['interact/getTopListData']
      },
      // 动态评论列表数据
      commentListData() {
        return this.$store.getters['interact/getCommentListData']
      },
      // 计算是否得到用户信息
      calUser() {
        return this.albumInfoData.User || false
      },
      /// 计算显示用户头像
      calUserAvater() {
        return !!this.calUser ? this.calUser.HeadUrl + '_200x200.jpg' : '/static/default_avatar.png'
      },
      /// 计算摄影背景封面
      calAlbumFacePic() {
        let faceSrc = this.albumInfoData.FaceSrc;
        return !!faceSrc ? faceSrc + '_500x200.blur.jpg/format/webp' : '/static/default_image.png'
      },
      /// 计算格式友好时间 几天前
      calDatetime() {
        let timestamp = new Date(this.albumInfoData.Datetime).getTime();
        return fnFormatDate(timestamp);
      },
      /// 计算显示图片集
      calImageSrcs() {
        let imgArray = this.albumInfoData.Images;
        if (imgArray) {
          imgArray = imgArray.map(item => item.ImgSrc + '_700x.jpg/format/webp')
        }
        return imgArray
      },
      /// 计算摄影信息
      calAlbumStaff() {
        let albumStaff = []
        let data = this.albumInfoData.StaffData
        if (data == null) return false
        // 出镜
        if (data.hasOwnProperty('model')) {
          albumStaff.push({
            title: '出镜',
            list: data.model
          })
        }
        // 摄影
        if (data.hasOwnProperty('photoer')) {
          albumStaff.push({
            title: '摄影',
            list: data.photoer
          })
        }
        // 服装
        if (data.hasOwnProperty('store')) {
          albumStaff.push({
            title: '服装',
            list: data.store
          })
        }
        return albumStaff
      }
      //
    },
	onReady: function (res) {
	        
	    },
	onUnload(){
		if(this.timemy1) {  
			clearTimeout(this.timemy1);  
			this.timemy1 = null;  
		}  
	},
    methods: {
		videoErrorCallback: function (e) {
		            console.log('视频错误信息:')
		            console.log(e.target.errMsg)
		 },
		 playVideo(){
			
			this.videoContext = uni.createVideoContext('myVideo', this);
			this.videoContext.requestFullScreen({direction: 0});
			this.videoContext.play()
		 	// this.videoContext.showStatusBar();
		 	// this.videoContext.requestFullScreen();
		 },
		   
		// 倒计时
		async Addscoreg(){
			let params={
				detail:'',
				originId:this.videoDetail.id,
				originType:1,
				personId:this.$store.getters['user/getAccountInfoData'].id,
				score:this.videoDetail.score,
				relTenantIds:this.videoDetail.relTenantIds,
				type:0
			}
			let resScore=await AddScore(params)
			let Atrcet=this.$store.getters['user/getUserAtteUserListData']
			Atrcet.forEach(a=>{
				if(a.id==this.articelId){
					a.operaStatus=1
				}
			})
		},
		// fullscreenchange (e){
		//     if(!e.detail.fullScreen){  
		//         this.videoContext.pause()
		//         this.showvideo = false
		//     }
		// },
		// @fullscreenchange="fullscreenchange"
		setTimeCount(){
			let time = this.videoDetail.lookTime
			// console.log(time)
			// var miao = this.miao
			// var second = Math.floor(time % 60);      
			// var minite = Math.floor((time / 60) % 60); //计算分
			// this.fen=minite
			// this.miao=second
			time--;
			if (time <= 0) {
			  time = 0;
			  this.videoDetail.lookTime=0
			  this.haveread=true;
			  this.noneread=false;
			  console.log(this.firsttime)
			  this.Addscoreg();
			  return false;
			}
			this.videoDetail.lookTime=time;
			this.timemy1=setTimeout(this.setTimeCount, 1000);
		},
		goback(){
			uni.navigateBack()
		},
      /// mescroll组件初始化完成的回调
      mescrollInit(mescroll) {
        this.mescroll = mescroll;
      },
	  
      /// 上拉加载的回调: mescroll携带page的参数, 其中num:当前页 从1开始, size:每页数据条数,默认10
      upCallback(mescroll) {
        let params = {
          objectid: this.albumID,
          objecttype: 'album',
          page: mescroll.num,
          count: mescroll.size
        }
        if (mescroll.num == 1) {
          // 获取详情信息
          getAlbumInfo(this.albumID).then(albumRes => {
            this.$store.commit('album/setAlbumInfoData', albumRes.data.Data)
            // 导航标题
            uni.setNavigationBarTitle({
              title: albumRes.data.Data.Name
            });
            params.count = 8
            // 获取点赞列表8项
            return getTopList(params)
          }).then(topRes => {
            this.$store.commit('interact/setTopListData', topRes.data.Data)
            params.count = mescroll.size
            // 获取评论列表
            return getCommentList(params)
          }).then(commRes => {
            this.$store.commit('interact/setCommentListData', commRes.data.Data)
            mescroll.endSuccess(commRes.data.Data.length, commRes.data.Data.length >= mescroll.size);
          }).catch(() => {
            mescroll.endSuccess(0, false);
          })
          return
        } else {
          // 继续上拉获取评论
          getCommentList(params).then(commRes => {
            this.$store.commit('interact/setCommentListData', this.commentListData.concat(commRes.data.Data))
            mescroll.endSuccess(commRes.data.Data.length, commRes.data.Data.length >= mescroll.size);
          }).catch(() => {
            mescroll.endErr();
          })
        }
      },

      /// 跳转用户信息页
      fnUserInfo(e) {
        uni.navigateTo({
          url: `/pages/user-info/user-info?id=${e.ID}`
        })
      },
      /// 跳转荟吧
      fnHuiba(id) {
        uni.navigateTo({
          url: `/pages/huiba-details/huiba-details?id=${id}`
        })
      },
      /// 跳转点赞列表
      fnTopList() {
        uni.navigateTo({
          url: `/pages/top-list/top-list?id=${this.albumID}&type=album`
        })
      },
      /// 跳转评论列表
      fnMoreComm(id) {
        uni.navigateTo({
          url: `/pages/comm-list/comm-list?id=${id}`
        })
      },
      /// 分享图标
      fnShare() {
        this.albumInfoData.ObjectID = this.albumID;
        this.albumInfoData.ObjectType = 'album';
        this.$refs.share.open(this.albumInfoData);
      },

      /// 详情点赞
      fnTop() {
        let filItem = {};
        let params = {
          objectid: this.albumID,
          objecttype: 'album',
        }
        // 来自主要跳转
        if (this.fromPage == 'home') {
          // 推荐
          if (this.current == 0) filItem = this.$store.getters['trend/getMainData'].filter(item => item.ObjectID ==
            this.albumID)[0];
          // 关注
          if (this.current == 1) filItem = this.$store.getters['trend/getAtteData'].filter(item => item.ObjectID ==
            this.albumID)[0];
          // 广场
          if (this.current == 2) filItem = this.$store.getters['trend/getSquareData'].filter(item => item.ObjectID ==
            this.albumID)[0];
        }
        // 来自用户详情
        if (this.fromPage == 'userinfo') {
          // 发布
          if (this.current == 0) filItem = this.$store.getters['user/getUserPublishListData'].filter(item => item.ObjectID ==
            this.albumID)[0];
          // 赞过
          if (this.current == 1) filItem = this.$store.getters['user/getUserTopListData'].filter(item => item.ObjectID ==
            this.albumID)[0];
        }
        // 来自发现-摄影跳转
        if (this.fromPage == 'find') {
          filItem = this.$store.getters['album/getAlbumListData'].filter(item => item.ID == this.albumID)[0];
        }
        // 用户是否已经点过赞
        if (filItem.UserTop) {
          delTop(params).then(delRes => {
            if (delRes.data.Data == false) return
            filItem.TopCount--;
            filItem.UserTop = false
            this.albumInfoData.TopCount--;
            this.albumInfoData.UserTop = false;
            // 点赞列表减头像
            let filTopList = this.topListData.filter(item => item.User.ID != this.$store.getters[
              'user/getUserInfoData'].ID)
            this.$store.commit('interact/setTopListData', filTopList)
          })
        } else {
          addTop(params).then(addRes => {
            if (addRes.data.Data == false) return
            filItem.TopCount++;
            filItem.UserTop = true;
            this.albumInfoData.TopCount++;
            this.albumInfoData.UserTop = true;
            // 点赞列表加头像
            this.topListData.unshift({
              User: this.$store.getters['user/getUserInfoData']
            })
          })
        }
      },
      /// 评论点赞
      fnTopComm(e) {
        let filItem = this.commentListData.filter(item => item.ID == e.ID)[0];
        if (filItem.UserTop) {
          delCommentTop(filItem.ID).then(delRes => {
            if (delRes.data.Data == false) return
            filItem.TopCount--;
            filItem.UserTop = false
          })
        } else {
          addCommentTop(filItem.ID).then(addRes => {
            if (addRes.data.Data == false) return
            filItem.TopCount++;
            filItem.UserTop = true
          })
        }
      },
      /// 关注详情发布用户
      fnAtte(e) {
        // 用户是否已经关注 
        if (e.UserAtte) {
          delUserAtte(e.ID).then(delRes => {
            if (delRes.data.Data == false) return
            this.albumInfoData.User.UserAtte = false
            // 来自主要跳转
            if (this.fromPage == 'home') {
              this.$store.getters['trend/getMainData'].filter(item => item.User.ID == e.ID).map(item => item.User.UserAtte =
                false)
              this.$store.getters['trend/getAtteData'].filter(item => item.User.ID == e.ID).map(item => item.User.UserAtte =
                false)
              this.$store.getters['trend/getSquareData'].filter(item => item.User.ID == e.ID).map(item => item.User
                .UserAtte = false)
            }
            // 来自用户详情
            if (this.fromPage == 'userinfo') {
              this.$store.getters['user/getUserPublishListData'].filter(item => item.User.ID == e.ID).map(item =>
                item.User.UserAtte = false)
              this.$store.getters['user/getUserTopListData'].filter(item => item.User.ID == e.ID).map(item => item.User
                .UserAtte = false)
            }
            // 来自发现-摄影跳转
            if (this.fromPage == 'find') {
              this.$store.getters['album/getAlbumListData'].filter(item => item.User.ID == e.ID).map(item => item.User
                .UserAtte = false)
            }
            // 登录用户关注数减
            let tempUser = this.$store.getters['user/getUserInfoData']
            tempUser.AtteCount--
            this.$store.commit('user/setUserInfoData', tempUser)
          })
        } else {
          addUserAtte(e.ID).then(addRes => {
            if (addRes.data.Data == false) return
            this.albumInfoData.User.UserAtte = true
            // 来自主要跳转
            if (this.fromPage == 'home') {
              this.$store.getters['trend/getMainData'].filter(item => item.User.ID == e.ID).map(item => item.User.UserAtte =
                true)
              this.$store.getters['trend/getAtteData'].filter(item => item.User.ID == e.ID).map(item => item.User.UserAtte =
                true)
              this.$store.getters['trend/getSquareData'].filter(item => item.User.ID == e.ID).map(item => item.User
                .UserAtte = true)
            }
            // 来自用户详情
            if (this.fromPage == 'userinfo') {
              this.$store.getters['user/getUserPublishListData'].filter(item => item.User.ID == e.ID).map(item =>
                item.User.UserAtte = true)
              this.$store.getters['user/getUserTopListData'].filter(item => item.User.ID == e.ID).map(item => item.User
                .UserAtte = true)
            }
            // 来自发现-摄影跳转
            if (this.fromPage == 'find') {
              this.$store.getters['album/getAlbumListData'].filter(item => item.User.ID == e.ID).map(item => item.User
                .UserAtte = true)
            }
            // 登录用户关注数加
            let tempUser = this.$store.getters['user/getUserInfoData']
            tempUser.AtteCount++
            this.$store.commit('user/setUserInfoData', tempUser)
          })
        }
      },
      /// 详情收藏
      fnSave() {
        let filItem = {};
        let params = {
          objectid: this.albumID,
          objecttype: 'album',
        }
        // 来自主要跳转
        if (this.fromPage == 'home') {
          // 推荐
          if (this.current == 0) filItem = this.$store.getters['trend/getMainData'].filter(item => item.ObjectID ==
            this.albumID)[0];
          // 关注
          if (this.current == 1) filItem = this.$store.getters['trend/getAtteData'].filter(item => item.ObjectID ==
            this.albumID)[0];
          // 广场
          if (this.current == 2) filItem = this.$store.getters['trend/getSquareData'].filter(item => item.ObjectID ==
            this.albumID)[0];
        }
        // 来自用户详情
        if (this.fromPage == 'userinfo') {
          // 发布
          if (this.current == 0) filItem = this.$store.getters['user/getUserPublishListData'].filter(item => item.ObjectID ==
            this.albumID)[0];
          // 赞过
          if (this.current == 1) filItem = this.$store.getters['user/getUserTopListData'].filter(item => item.ObjectID ==
            this.albumID)[0];
        }
        // 来自发现-摄影跳转
        if (this.fromPage == 'find') {
          filItem = this.$store.getters['album/getAlbumListData'].filter(item => item.ID == this.albumID)[0];
        }
        // 用户是否已经收藏
        if (filItem.UserSave) {
          delSave(params).then(delRes => {
            if (delRes.data.Data == false) return
            filItem.SaveCount--
            filItem.UserSave = false
            this.albumInfoData.SaveCount--
            this.albumInfoData.UserSave = false
          })
        } else {
          addSave(params).then(addRes => {
            if (addRes.data.Data == false) return
            filItem.SaveCount++
            filItem.UserSave = true
            this.albumInfoData.SaveCount++
            this.albumInfoData.UserSave = true
          })
        }
      },

      /// 显示评论输入框 
      fnCommOpen() {
        this.$refs.comm.open({
          type: 'comment',
          content: this.$store.getters['getCommContentData'],
          objectid: this.albumID,
          objecttype: 'album',
        });
      },
      /// 评论发送
      fnCommSend(e) {
        // 不为发送时保存输入值
        if (e.type == 'comment') this.$store.commit('setCommContentData', e.content)
        if (e.state == false) return
        // 无内容信息反馈
        if (e.content == '') {
          uni.showToast({
            title: "评论内容不能为空",
            icon: 'none'
          })
          return
        }
        // 提交评论
        uni.showLoading({
          title: '提交中'
        })
        delete e.state
        delete e.type
        e.fromclient = 'android'
        addComment(e).then(addRes => {
          if (addRes.status != 200) return
          if (this.replyParentID == 0) {
            // 无回复项
            let filCommentList = this.commentListData.filter(item => item.ID == e.parentid)[0]
            if (filCommentList.ChildCount == 0) {
              filCommentList.ChildCount = 1
              filCommentList.CommentChilds = []
              filCommentList.CommentChilds.unshift(addRes.data.Data)
            } else {
              filCommentList.ChildCount++
              filCommentList.CommentChilds = filCommentList.CommentChilds.concat([addRes.data.Data])
            }
          } else if (this.replyParentID > 0) {
            // 有回复项追加
            let filCommentList = this.commentListData.filter(item => item.ID == this.replyParentID)[0]
            filCommentList.ChildCount++
            filCommentList.CommentChilds = filCommentList.CommentChilds.concat([addRes.data.Data])
          } else {
            // 评论发布 
            this.commentListData.unshift(addRes.data.Data)
            this.$store.commit('setCommContentData', '')
          }
          // 评论数量添加
          if (this.albumInfoData.CommCount == 0) this.mescroll.removeEmpty()
          this.albumInfoData.CommCount++
          this.$refs.comm.visible = false;
          this.replyParentID == -1
          uni.hideLoading()
          uni.showToast({
            title: '评论成功'
          })
          // 改变上一窗口的数据
          let filItem = []
          // 来自主要跳转
          if (this.fromPage == 'home') {
            // 推荐
            if (this.current == 0) filItem = this.$store.getters['trend/getMainData'].filter(item => item.ObjectID ==
              this.albumID)[0];
            // 关注
            if (this.current == 1) filItem = this.$store.getters['trend/getAtteData'].filter(item => item.ObjectID ==
              this.albumID)[0];
            // 广场
            if (this.current == 2) filItem = this.$store.getters['trend/getSquareData'].filter(item => item.ObjectID ==
              this.albumID)[0];
          }
          // 来自用户详情
          if (this.fromPage == 'userinfo') {
            // 发布
            if (this.current == 0) filItem = this.$store.getters['user/getUserPublishListData'].filter(item => item
              .ObjectID == this.albumID)[0];
            // 赞过
            if (this.current == 1) filItem = this.$store.getters['user/getUserTopListData'].filter(item => item.ObjectID ==
              this.albumID)[0];
          }
          // 来自发现-摄影跳转
          if (this.fromPage == 'find') {
            filItem = this.$store.getters['album/getAlbumListData'].filter(item => item.ID == this.albumID)[0];
          }
          filItem.CommCount++
        })
      },
      /// 评论项操作
      fnComm(e) {
        let itemList = ['回复', '复制', '举报'];
        if (e.User.ID == this.$store.getters['user/getUserInfoData'].ID) itemList.push('删除')
        uni.showActionSheet({
          itemList,
          success: res => {
            switch (res.tapIndex) {
              case 0:
                this.$refs.comm.open({
                  type: 'reply',
                  user: e.User.NickName,
                  objecttype: e.ObjectType,
                  objectid: e.ObjectID,
                  parentid: e.ID
                });
                this.replyParentID = e.TopParentID
                break;
              case 1:
                uni.setClipboardData({
                  data: e.Content
                });
                break;
              case 2:
                uni.navigateTo({
                  url: `/pages/report/report?id=${e.ObjectID}&type=${e.ObjectType}`
                })
                break;
              case 3:
                delComment(e.ID).then(delRes => {
                  if (delRes.data.Data == false) return
                  if (e.TopParentID > 0) {
                    // 有回复项删减
                    let filCommentList = this.commentListData.filter(item => item.ID == e.TopParentID)[0]
                    let filCommentChilds = filCommentList.CommentChilds.filter(item => item.ID != e.ID)
                    filCommentList.ChildCount--
                    filCommentList.CommentChilds = filCommentChilds
                  } else {
                    // 评论发布项删除
                    let filCommentList = this.commentListData.filter(item => item.ID != e.ID)
                    this.$store.commit('interact/setCommentListData', filCommentList)
                  }
                  // 评论数量减少
                  this.albumInfoData.CommCount--
                  if (this.albumInfoData.CommCount == 0) this.mescroll.showEmpty()
                  // 改变上一窗口的数据
                  let filItem = []
                  // 来自主要跳转
                  if (this.fromPage == 'home') {
                    // 推荐
                    if (this.current == 0) filItem = this.$store.getters['trend/getMainData'].filter(item =>
                      item.ObjectID == this.albumID)[0];
                    // 关注
                    if (this.current == 1) filItem = this.$store.getters['trend/getAtteData'].filter(item =>
                      item.ObjectID == this.albumID)[0];
                    // 广场
                    if (this.current == 2) filItem = this.$store.getters['trend/getSquareData'].filter(item =>
                      item.ObjectID == this.albumID)[0];
                  }
                  // 来自用户详情
                  if (this.fromPage == 'userinfo') {
                    // 发布
                    if (this.current == 0) filItem = this.$store.getters['user/getUserPublishListData'].filter(
                      item => item.ObjectID == this.albumID)[0];
                    // 赞过
                    if (this.current == 1) filItem = this.$store.getters['user/getUserTopListData'].filter(
                      item => item.ObjectID == this.albumID)[0];
                  }
                  // 来自发现-摄影跳转
                  if (this.fromPage == 'find') {
                    filItem = this.$store.getters['album/getAlbumListData'].filter(item => item.ID == this.albumID)[
                      0];
                  }
                  filItem.CommCount--
                })
                break;
              default:
                break;
            }
          }
        })
      },
      /// 预览图片组
      fnPreviewImage(current) {
        let urls = this.albumInfoData.Images.map(item => item.ImgSrc + '_0.jpg/format/webp')
        previewImage(current, urls)
      },
      //
    },

    beforeDestroy() {
      // 清空预评论内容
      this.$store.commit('setCommContentData', '')
    }
  }
</script>

<style>
	page{
		background: #fff;
	}
	.titel{
		margin-top:33rpx;
		margin-bottom: 34rpx;
	}
	.videoboxs{
		width: 708rpx;
		height: 443rpx;
	}
	.head{
		width: 100%;
		height: 133rpx;
		padding-left: 28rpx;
		padding-right:28rpx;
		line-height: 133rpx;
		background: linear-gradient(0deg, #235FED, #235FED);
	}
	.boximgs{
		width: 21rpx;
		height: 38rpx;
	}
	.safe{
		  width: 70%;
		  margin-left:80rpx;
	}
</style>
