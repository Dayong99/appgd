<template>
  <view>
    <!-- 主页 -->
     <homelist ref="homse" v-if="current==0"></homelist>
    <!-- 消息 -->
    <shop v-if="current==1" :height="statusBarHeight"></shop>
    <!-- 我的 -->
    <my v-if="current==2" :height="statusBarHeight"></my>
    <bottom-nav :bubble="bubble" :current="current" :parameter="bottomNav" @current="fnCurrent"></bottom-nav>
  </view>
</template>

<script>
  // 底部导航栏组件
  import BottomNav from '@/components/bottom-nav/bottom-nav'
  // 底部导航栏组件-主页
  import homelist from '@/pages/homelist/homelist'
  // import homelist from '@/pages/home/home'
  // 底部导航栏组件-发现
  // 底部导航栏组件-我的
  import My from '@/pages/my/my'
  // 底部导航栏组件-商城
  import shop from '@/pages/shop/shop'
  import {
    getMessageListByType
  } from "@/api/MessageServer.js"
 import {
	subjectCont
  } from "@/api/CommonServer.js"
  import {
    getUserAtteUserList,
	getUserVideoList
  } from "@/api/UserServer.js"
  export default {
    components: {
      BottomNav,
      homelist,
      shop,
      My
    },
    data() {
      return {
        // 底部导航选中值
        current:0,
        // 底部导航栏参数
        bottomNav: {
          // 文字颜色
          "color": "#8E8E8E",
          // 选中文字颜色
          "selectedColor": "#4F82ED",
          // 背景颜色
          "backgroundColor": "#FFFFFF",
          // 底部上边线颜色
          borderColor: "#EEEEEE",
          // 导航项
          "list": [{
              "text": "主页",
              "icon": "/static/icon-bottom-nav/home_normal.png",
              "selectedIcon": "/static/icon-bottom-nav/home_select.png"
            },
            {
              "text": "消息中心",
              "icon": "/static/icon-bottom-nav/shop_normal.png",
              "selectedIcon": "/static/icon-bottom-nav/shop_select.png"
            },
            {
              "text": "我的",
              "icon": "/static/icon-bottom-nav/my_normal.png",
              "selectedIcon": "/static/icon-bottom-nav/my_select.png"
            }
          ]
        },
        // 激活底部导航关联页状态
        status: {
          home: true,
          //find: false,
          shop: false,
          my: false,
          //release: false,
          //start: true
        },
        // 双击刷新
        clickRefresh: false,
        // 刷新间隔
        timeOut: 0,
		statusBarHeight:0
      }
    },

    // 初始跳转
    onLoad(option) {
      if (option && option.current) {
		this.current = parseInt(option.current);
      }
	  this.statusBarHeight = this.$store.getters['common/getStatusBarHeight']
	  console.log(this.statusBarHeight)
    },

    onShow() {
		
    },

    computed: {
      // 消息气泡
      bubble() {
        return this.$store.getters['getNewsTotalData'];
      }
    },
	
    methods: {
      fnCurrent(index) {
        // 发布选择
        // if (index == 2) return this.status.release = true;
        // // 是否当前项点击
        // if (this.current == index) {
        //   this.timeOut += 1;
        //   // 是否为刷新值和连续触发
        //   if (!this.clickRefresh && this.timeOut >= 2) {
        //     // 刷新值开和定时器重置
        //     this.clickRefresh = true;
        //     this.timeOut = setTimeout(() => {
        //       // 清除定时器
        //       clearTimeout(this.timeOut)
        //       // 连续触发记录重置
        //       this.timeOut = 0;
        //       // 刷新值关
        //       this.clickRefresh = false;
        //     }, 5000);
        //   }
        //   return;
        // } else {
          let text = this.bottomNav.list[index].text;
          // 是否中间单图标点击 
          if (text) {
            this.current = index;
            // uni.setNavigationBarTitle({
            //   title: text
            // });
          }
        //   // 首次选中激活底部导航关联页状态
          if (!this.status.home && index == 0) this.status.home = true;
          if (!this.status.shop && index == 1) this.status.shop = true;
          if (!this.status.my && index == 2) this.status.my = true;
        //   // 清除定时器
        //   clearTimeout(this.timeOut)
        //   // 连续触发记录重置
        //   this.timeOut = 0;
        //   // 刷新值关
        //   this.clickRefresh = false;
        // }
      },
      //
    }
  }
</script>

<style>
	
</style>
