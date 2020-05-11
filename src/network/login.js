import { request } from './request'

export function loginCheck (config) {
  return request({
    url: '/login',
    method: 'POST',
    params: {
      username: config.username,
      password: config.password
    }
  })
}
