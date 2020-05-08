import { request } from './request'

export function getUserList (config) {
  return request({
    url: '/users',
    method: 'GET',
    params: config
  })
}

export function changeUserState (url) {
  return request({
    url: url,
    method: 'PUT'
  })
}

export function addNewUser (config) {
  return request({
    url: '/users',
    method: 'POST',
    data: config
  })
}

export function getIdUser (id) {
  return request({
    url: 'users/' + id,
    method: 'GET'
  })
}

export function editUser (config) {
  return request({
    url: 'users/' + config.id,
    method: 'PUT',
    data: config
  })
}

export function deleteUser (config) {
  return request({
    url: 'users/' + config,
    method: 'DELETE',
    params: {
      id: config
    }
  })
}
