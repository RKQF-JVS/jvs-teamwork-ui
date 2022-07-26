import request from "@/router/axios";
const BASE_PATH = '/mgr/teamwork'

export  const  projectTaskTagList = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskTag/listTag`,
    method:'get',
    params:data
  })
}

export const projectTaskListByTask = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/getListByTag`,
    method:'post',
    data
  })
}

export const projectTaskSaveTag = (data) =>{
  return request({
    url:`${BASE_PATH}/ProjectTaskTag/save`,
    method:'post',
    data
  })
}

export const projectTaskSetTag = (data) =>{
  return request({
    url:`${BASE_PATH}/ProjectTask/setTag`,
    method:'post',
    data
  })
}

export const projectTaskEditTag = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskTag/edit`,
    method:'put',
    data
  })
}

export const projectTaskDelTag = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskTag/del`,
    method:'delete',
    data
  })
}
