import { request } from './request'

export function getGoodsList (params) {
  return request({
    url: 'goods',
    method: 'GET',
    params
  })
}

export function deleteGoods (id) {
  return request({
    url: 'goods/' + id,
    method: 'DELETE'
  })
}
