import axios from 'axios'
// 创建axios实例

let baseURL = 'http://edu.test/'


const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  baseURL,
  timeout: 15000, // 请求超时时间
  withCredentials: true
})

// request拦截器
service.interceptors.request.use(config => {
  // config.headers['X-Guzzu-Access-Token'] = '5757gh76'

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {

    return response.data
  },
  error => {
    console.log(error.response)
    let message
    return Promise.reject(error)
  }
)

export default service
