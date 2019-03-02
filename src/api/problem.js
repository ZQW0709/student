import axios from 'axios'

export function getAllexamtype() {   //获取全部题目的类型
    const url = 'http://localhost:9527/getAllexamtype'
  return axios.post(url, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getExaminfoByTypeId(params)  {  //根据题目类型ID获取题目
   const url = 'http://localhost:9527/getExaminfoByTypeId'
   return axios.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

}