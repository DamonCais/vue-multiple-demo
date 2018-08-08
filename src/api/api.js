import request from '@/util/request'
// import axios from 'axios'

import jsonp from 'jsonp'
export function upLoadImg(url, params) {
  return request({
    url: url,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function upLoadImgV2(url, params) {
  return request({
    url: url,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function doPost(url, params) {
  return request({
    url: url,
    method: 'post',
    data: params
  })
}

export function doPatch(url, params) {
  return request({
    url: url,
    method: 'patch',
    data: params
  })
}
export function doDel(url, params) {
  const href = getFullUrl(url, params)
  return request({
    url: href,
    method: 'delete'
  })
}

export function doGet(url, params) {
  const href = getFullUrl(url, params)
  return request({
    url: href,
    method: 'get'
  })
}
function getFullUrl(url, params) {
  let query = ''
  for (const p in params) {
    query += `&${p}=${params[p]}`
  }
  url += '?' + query.substring(1)
  return url
}
