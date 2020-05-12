import { request } from './request'
export function getCategory (params) {
  return request({
    url: 'categories',
    method: 'GET',
    params
  })
}

export function getCategoryDetail () {
  return request({
    url: 'categories',
    method: 'GET',
    params: {
      type: 2
    }
  })
}

export function addCategorySubmit (data) {
  return request({
    url: 'categories',
    method: 'POST',
    data
  })
}

export function getCateById (id) {
  return request({
    url: 'categories/' + id,
    method: 'GET'
  })
}

export function editCateSubmit (data) {
  return request({
    url: 'categories/' + data.cat_id,
    method: 'PUT',
    data: {
      cat_name: data.cat_name
    }
  })
}

export function deleteCate (id) {
  return request({
    url: 'categories/' + id,
    method: 'DELETE'
  })
}
