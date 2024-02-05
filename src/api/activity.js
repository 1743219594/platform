import request from '@/utils/request'
// 获取活动列表
export function getActivityList(params) {
  return request({
    url:'/activity/list',
    method:'get',
    params:params
  })
}
// 添加活动
export function createActivity(data) {
  return request({
    url:'/activity/create',
    method:'post',
    data:data
  })
}
// 删除活动
export function deleteActivity(id) {
  return request({
    url:'/activity/delete' + id,
    method:'post',
  })
}

// 根据id获取文章详细信息
export function getActivityDetail(id) {
  return request({
    url: '/activity/detail/' + id,
    method: 'get'
  })
}
// 更新文章详细信息
export function updateActivity(id,data) {
  return request({
    url: '/activity/update/' + id,
    method: 'post',
    data: data
  })
}
