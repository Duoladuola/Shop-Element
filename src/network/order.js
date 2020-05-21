import { request } from './request'

export function getOrderList (params) {
  return request({
    url: 'orders',
    method: 'GET',
    params
  })
}
export function getTransport (id) {
  return request({
    url: '/kuaidi/' + id,
    method: 'GET'
  })
}
