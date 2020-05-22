import { request } from './request'
export function getTimerLine () {
  return request({
    url: 'reports/type/1',
    method: 'GET'
  })
}
