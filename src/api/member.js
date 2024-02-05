import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/member/list',
    method:'get',
    params:params
  })
}

export function fetchListById(parentId) {
  return request({
    url:'/member/list/' + parentId,
    method:'get',
  })
}

export function deleteMember(memberId) {
  return request({
    url:'/member/delete/' + memberId,
    method:'post',
  })
}

export function fetchChildList(memberId) {
  return request({
    url:'/member/get/' + memberId,
    method:'get',
  })
}
