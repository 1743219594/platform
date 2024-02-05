import request from '@/utils/request'
export function fetchBrandList(params) {
  return request({
    url:'/merchant/list',
    method:'get',
    params:params
  })
}
export function createBrand(data) {
  return request({
    url:'/merchant/create',
    method:'post',
    data:data
  })
}
export function updateShowStatus(data) {
  return request({
    url:'/merchant/update/showStatus',
    method:'post',
    params:data
  })
}

export function updateFactoryStatus(data) {
  return request({
    url:'/merchant/update/factoryStatus',
    method:'post',
    data:data
  })
}

export function deleteBrand(id) {
  return request({
    url:'/merchant/delete/'+id,
    method:'get',
  })
}

export function getBrand(id) {
  return request({
    url:'/merchant/'+id,
    method:'get',
  })
}

export function updateBrand(id,data) {
  return request({
    url:'/merchant/update/'+id,
    method:'post',
    data:data
  })
}

