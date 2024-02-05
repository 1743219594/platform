import request from '@/utils/request'
// 获取文章列表
export function fetchList(params) {
  return request({
    url:'/knowledge/list',
    method:'get',
    params:params
  })
}
// 删除文章
export function deleteAirticle(id, data) {
  return request({
    url: '/knowledge/update/' + id,
    method: 'post',
    data: data
  })
}
// 新增文章
export function createArticle(data) {
  return request({
    url: '/knowledge/create',
    method: 'post',
    data: data
  })
}
// 根据id获取文章详细信息
export function getAirticleDetail(id) {
  return request({
    url: '/knowledge/detail/' + id,
    method: 'get'
  })
}
// 更新文章详细信息
export function updateArticle(id,data) {
  return request({
    url: '/knowledge/update/' + id,
    method: 'post',
    data: data
  })
}