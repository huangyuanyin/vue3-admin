import request from '@/utils/request'

export function loginApi(data) {
  return request({
    url: '/employee/login',
    method: 'post',
    data
  })
}

export function logoutApi() {
  return request({
    url: '/employee/logout',
    method: 'post'
  })
}

export function getMemberListApi(params) {
  return request({
    url: '/employee/page',
    method: 'get',
    params
  })
}

// 新增---添加员工
export function addEmployee(params) {
  return request({
    url: '/employee',
    method: 'post',
    data: params
  })
}

// 修改---修改员工
export function editEmployee(params) {
  return request({
    url: '/employee',
    method: 'put',
    data: params
  })
}

// 删除员工
export function deleteEmployee(ids) {
  return request({
    url: '/employee',
    method: 'delete',
    params: { ids }
  })
}

export function dishPage(params) {
  return request({
    url: '/dish/page',
    method: 'get',
    params
  })
}

export const dishStatusByStatus = (params) => {
  return request({
    url: `/dish/status/${params.status}`,
    method: 'post',
    params: { ids: params.id }
  })
}

export const getCategoryPage = (params) => {
  return request({
    url: '/category/page',
    method: 'get',
    params
  })
}

export const addCategoryApi = (params) => {
  return request({
    url: '/category',
    method: 'post',
    data: params
  })
}

// 修改---启用禁用接口
export function enableOrDisableEmployee(params) {
  return request({
    url: '/employee',
    method: 'put',
    data: params
  })
}

// 跳转管理 -  删除接口
export const deleteDish = (ids) => {
  return request({
    url: '/dish',
    method: 'delete',
    params: { ids }
  })
}

export const getCategoryListApi = (params) => {
  return request({
    url: '/category/list',
    method: 'get',
    params
  })
}

// 跳转管理 - 修改接口
export const editDish = (params) => {
  return request({
    url: '/dish',
    method: 'put',
    data: { ...params }
  })
}

// 跳转管理 - 新增接口
export const addDish = (params) => {
  return request({
    url: '/dish',
    method: 'post',
    data: { ...params }
  })
}

// 跳转管理 - 查询详情
export const queryDishById = (id) => {
  return request({
    url: `/dish/${id}`,
    method: 'get'
  })
}

// 账号管理 - 查详情接口
export function queryEmployeeByIdApi(id) {
  return request({
    url: `/employee/${id}`,
    method: 'get'
  })
}

// 部门管理 - 删除当前列的接口
export const deleCategory = (ids) => {
  return request({
    url: '/category',
    method: 'delete',
    params: { ids }
  })
}

// 部门管理 - 修改接口
export const editCategory = (params) => {
  return request({
    url: '/category',
    method: 'put',
    data: { ...params }
  })
}

export const uploadMdImageApi = (params) => {
  return request({
    url: '/common/upload',
    method: 'post',
    data: params
  })
}

export const getNoticeListApi = (params) => {
  return request({
    url: '/notice/page',
    method: 'get',
    params
  })
}

export const getNoticeDetailApi = (params) => {
  return request({
    url: `/notice/${params}`,
    method: 'get'
  })
}

export const addNoticeListApi = (params) => {
  return request({
    url: '/notice',
    method: 'post',
    data: params
  })
}

export const editNoticeListApi = (params) => {
  return request({
    url: '/notice',
    method: 'put',
    data: params
  })
}
export const deleteNoticeListApi = (id) => {
  return request({
    url: `/notice/`,
    method: 'delete',
    params: { id }
  })
}
