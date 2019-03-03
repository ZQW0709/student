import axios from 'axios'

export function studentLogin(params) { // 学生登录
  // const url = 'http://localhost:9527/studentLogin'
  const url = 'http://localhost:9527/studentLogin'

  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function updateStudent(params) { // 修改学生信息
  const url = 'http://localhost:9527/updateStudent'
  return axios.post(url, params)
}

export function delClassmanage(params) { // 删除
  const url = 'http://localhost:9527/delClassmanage'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getAllCampusmanage(params) { // 获取校区所有数据 用于绑定下拉列表
  const url = 'http://localhost:9527/getAllCampusmanage'
  return axios.post(url, params)
}

export function addClassmanage(params) { // 新增
  const url = 'http://localhost:9527/addClassmanage'
  return axios.post(url, params)
}

export function updataPwd(params) { // 修改密码
  const url = 'http://localhost:9527/updataPwd'
  return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
