import { request } from './request'

export function loginCheck (config) {
  return request({
    url: '/login',
    params: {
      username: config.username,
      password: config.password
    }
  })
}
