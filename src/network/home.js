import { request } from './request'

export function getHomeAside () {
  return request({
    url: 'menus',
    method: 'GET'
  })
}
