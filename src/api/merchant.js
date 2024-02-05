import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/merchant/list',
    method: 'get',
    params: params
    })
}

export function updateStatus(id, params) {
  return request({
    url: '/merchant/status/' + id,
    method: 'post',
    params: params
    })
}

export function deleteMerchant (params) {
return request({
    url: '/merchant/delete/' + id,
    method: 'post',
    params: params
    })
}

export function fetchMerchantExamineList(params) {
return request({
    url: '/merchant/examineList',
    method: 'get',
    params: params
    })
}

export function fetchMerchantExamineDetail(id) {
return request({
    url: '/merchant/examineDetail/' + id,
    method: 'get',
    })
}

export function passExamine(id,data) {
return request({
    url: '/merchant/examinePass/' + id,
    method: 'post',
    params: data
    })
}

export function refuseApplication(id) {
return request({
    url: '/merchant/refuse' + id,
    method: 'get',
    })
}