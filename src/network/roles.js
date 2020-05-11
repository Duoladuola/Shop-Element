import { request } from './request'

export function getRoles () {
  return request({
    url: 'roles',
    method: 'GET'
  })
}

export function addRole (data) {
  return request({
    url: 'roles',
    method: 'POST',
    data
  })
}

export function getIdRole (id) {
  return request({
    url: 'roles/' + id,
    method: 'GET'
  })
}

export function editRoleSubmit (data) {
  return request({
    url: 'roles/' + data.roleId,
    method: 'PUT',
    data
  })
}

export function deleteRole (id) {
  return request({
    url: 'roles/' + id,
    method: 'DELETE'
  })
}

export function deleteTag (url) {
  return request({
    url,
    method: 'DELETE'
  })
}
export function getRights () {
  return request({
    url: 'rights/tree',
    method: 'GET'
  })
}

export function asignRightsSubmit (url, idStr) {
  return request({
    url,
    method: 'POST',
    data: {
      rids: idStr
    }
  })
}
