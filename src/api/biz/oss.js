import request from '@/utils/request'

export function ossInfo (fileNum) {
  return request({
    url: '/mall4cloud_biz/oss/info',
    method: 'get',
    params: { fileNum }
  })
}

export function pageFileGroup () {
  return request({
    url: '/mall4cloud_biz/m/attach_file_group/list',
    method: 'get'
  })
}

export function getFileGroup (param) {
  return request({
    url: '/mall4cloud_biz/m/attach_file_group',
    method: 'get',
    params: param
  })
}

export function saveFileGroup (data) {
  return request({
    url: '/mall4cloud_biz/m/attach_file_group',
    method: 'post',
    data
  })
}

export function updateFileGroup (data) {
  return request({
    url: '/mall4cloud_biz/m/attach_file_group',
    method: 'put',
    data
  })
}

export function deleteFileGroup (param) {
  return request({
    url: '/mall4cloud_biz/m/attach_file_group',
    method: 'delete',
    params: param
  })
}

/**
 * minIo上传文件
 * @param url 请求的url
 * @param data 图片文件
 */
export function minIoImgUpdate (url, data) {
  return request({
    headers: {
      'Content-Type': data.type
    },
    url,
    method: 'put',
    data
  })
}

// aliOss上传文件
/**
 * aliOss上传文件
 * @param url 请求的url
 * @param data 图片文件+请求的参数
 */
export function aliImgUpdate (url, data) {
  return request({
    headers: {
      'Content-Type': data.type
    },
    url,
    method: 'post',
    data
  })
}
