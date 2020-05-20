import { request } from './request'
export function getCateParams (id, deffirence) {
  return request({
    url: 'categories/' + id + '/attributes',
    method: 'GET',
    params: {
      sel: deffirence
    }
  })
}
export function addGoods (data) {
  return request({
    url: 'goods',
    method: 'POST',
    data
  })
}
