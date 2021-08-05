/**
 * ===========
 * 统一请求发送
 * ===========
 */
import store from '@/store'
export default function request(route, method = 'get', data = {}) {
	
  return new Promise((resolve, reject) => {
    uni.request({
      // url: 'http://api5.laosha.net' + route,
      url: store.state.baseUrl + route,
      method,
      data,
      header: {
        'hanfuhui_version': 3,
        'X-Access-Token': uni.getStorageSync('TOKEN') || '',
        'hanfuhui_fromclient': 'android',
         //'content-type': 'application/x-www-form-urlencoded',
		 // 'content-type': 'application/json,',
      },
      success: res => {
        // token失效
        if (res.statusCode == 401 || res.data.ErrorMessage == '登录过期') {
          reject({
            data: 401,
            status: res.statusCode
          })
          uni.redirectTo({
            url: '/pages/login/login'
          })
          return;
        }
        // 服务器错误
        if (res.statusCode == 500) {
          reject({
            data:res.data.message,
            status: res.statusCode
          })
          uni.showToast({
            title: '服务器错误',
            icon: 'none'
          })
          uni.redirectTo({
            url: '/pages/login/login'
          })
          return;
        }
		if ((res.statusCode == 200&&!res.data.success)) {
		  reject({
		    data:res.data.message,
		    status: res.statusCode
		  })
		  /*uni.showToast({
		    title: res.data.message,
		    title: '访问超时',
		    icon: 'none'
		  })*/
		  return;
		}
        // 含有错误
        if (!res.data.success) {
          reject({
            data: res.data,
            status: res.statusCode
          })
          uni.showToast({
            title: res.data.message,
            icon: 'none'
          })
          return;
        }
        // 正常
        resolve({
          data: res.data,
          status: res.statusCode||res.status
        })
      },
      fail: err => {
        // console.log(err)
        reject(err)
        uni.showToast({
          title: '网络连接异常',
          icon: 'none'
        })
      }
    })
  })
}
