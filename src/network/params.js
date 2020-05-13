import { request } from './request'

export function getActiveParams (id, activeName) {
  return request({
    url: 'categories/' + id + '/attributes',
    method: 'GET',
    params: {
      sel: activeName
    }
  })
}

export function addParamsSubmit (id, addParams, activeName) {
  return request({
    url: 'categories/' + id + '/attributes',
    method: 'POST',
    data: {
      attr_name: addParams.attr_name,
      attr_sel: activeName
    }
  })
}

export function editParamsSubmit (id, attrId, activeName, editParams) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    method: 'PUT',
    data: {
      attr_name: editParams.attr_name,
      attr_sel: activeName
    }
  })
}

export function deleteParams (id, attrid) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrid,
    method: 'DELETE'
  })
}

export function tagSubmit (id, attrId, activeName, params, attrVals) {
  return request({
    url: 'categories/' + id + '/attributes/' + attrId,
    method: 'PUT',
    data: {
      attr_name: params.attr_name,
      attr_sel: activeName,
      attr_vals: attrVals
    }
  })
}
