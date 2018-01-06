import axios from 'axios'
import localEvent from 'store'
import router from './routers/'
import { MessageToast } from '@/plugins/messageToast'
import { plusMessageFirst } from './filters'
/**
 * 添加请求拦截器
 *     @author jsonleex <jsonlseex@163.com>
 */
let TOKEN
axios.interceptors.request.use(config => {
  TOKEN = (localEvent.get('CURRENTUSER') || {}).token

  // if(config.method === 'post') {
  //     // JSON 转换为 FormData
  //     const formData = new FormData()
  //     Object.keys(config.data).forEach(key => formData.append(key, config.data[key]))
  //     config.data = formData
  // }

  if (TOKEN) {
    config.headers.Authorization = `Bearer ${TOKEN}`
  }
  return config
}, error => {
  console.error('错误的传参', 'fail')
  return Promise.reject(error)
})

/**
 * 添加响应拦截器
 *     @author jsonleex <jsonlseex@163.com>
 */
axios.interceptors.response.use(res => res,
  /* 错误处理 */
  error => {
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 401:
          localEvent.remove('CURRENTUSER')
          setTimeout(() => {
            router.push({ path: '/signin', query: { redirect: router.currentRoute.fullPath } })
          }, 500)
          const message401 = TOKEN
          ? '登录失效, 请重新登录'
          : '您还没有登录'
          MessageToast.error(message401)
          break
        default:
          const message = plusMessageFirst(data)
          if (message) {
            MessageToast.error(message)
          }
          break
      }
    } else if (error.request) {
      console.log(error.request)
    } else {
      console.log('Error', error.message)
    }
    return false
  }
)

/* 获取配置的 api */
const basename = document.head.querySelector('meta[name="api-basename"]')
if (!basename) {
  console.error('未配置api接口，请设置 "<meta name="api-basename" content="url">"')
}

// 默认 v2 接口
axios.defaults.baseURL = basename.content || '/api/v2'

export default axios
