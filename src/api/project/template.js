import request from "@/router/axios";
const BASE_PATH = '/mgr/teamwork'

export const projectTempPage = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTemplate/page`,
    method:'get',
    params:data
  })
}

export const projectTemplateAll = ()=>{
  return request({
    url:`${BASE_PATH}/ProjectTemplate/listAll`,
    method:'get'
  })
}


export const projectTemplateSave = (data)=>{
  return request(data.id?{
    url:`${BASE_PATH}/ProjectTemplate/edit`,
    method:'put',
    data
  }:{
    url:`${BASE_PATH}/ProjectTemplate/save`,
    method:'post',
    data
  })
}

export const projectTemplateDel = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTemplate/del`,
    method:'delete',
    params:data
  })
}

export const projectTemplatTaskPage = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTemplateTask/listAll`,
    method:'get',
    params:data
  })
}

export const projcetTemplateTaskSave = (data)=>{
  return request(data.id?{
    url:`${BASE_PATH}/ProjectTemplateTask/edit`,
    method:'put',
    data
  }:{
    url:`${BASE_PATH}/ProjectTemplateTask/save`,
    method:'post',
    data
  })
}

export const projectTemplateTaskDel = (id)=>{
  return request({
    url:`${BASE_PATH}/ProjectTemplateTask/del/${id}`,
    method:'delete',
  })
}
