import request from "@/router/axios";
const BASE_PATH = '/mgr/teamwork'

export const projectSave = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/save`,
    method:'post',
    data
  })
}

export const projectPage = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/page`,
    method:'get',
    params:data
  })
}

export const projectCollection = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectCollection/collect`,
    method:'delete',
    params:data
  })
}

export const projectDetail = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/detail`,
    method:'get',
    params:data
  })
}

export const projectFile = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/uploadProjectFile`,
    method:'post',
    data
  })
}

export const projectEdit = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/edit`,
    method:'put',
    data
  })
}

export const projectArchive = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/archive`,
    method:'post',
    data
  })
}

export const projectRecoveryArchive = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/recoveryArchive`,
    method:'post',
    data
  })
}

export const projectRecycle = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/recycle`,
    method:'delete',
    data
  })
}

export const projectRecovery = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/recovery`,
    method:'post',
    data
  })
}

export const projectExit= (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/exitProject`,
    method:'delete',
    params:data
  })
}

export const  projectInfoListAll= ()=>{
  return request({
    url:`${BASE_PATH}/ProjectInfo/listAll`,
    method:'get'
  })
}
