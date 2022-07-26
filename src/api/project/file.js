import request from "@/router/axios";
const BASE_PATH = '/mgr/teamwork'

export const projectTaskUploadFile= (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/uploadRelationFile`,
    method:'post',
    data
  })
}

export const projectTaskFileList = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/listTaskFile`,
    method:'get',
    params:data
  })
}

export const projectTaskCancelRelation = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/cancelRelationFile`,
    method:'post',
    data
  })
}

export const projectFileListRecycle = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectFileInfo/listRecycle`,
    method:'get',
    params:data
  })
}

export const projectFileDel = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectFileInfo/del`,
    method:'delete',
    params:data
  })
}
export const projectFileRecovery = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectFileInfo/fileRecovery`,
    method:'put',
    params:data
  })
}

export const projectFileListAll = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectFileInfo/listAll`,
    method:'get',
    params:data
  })
}

export const projectFileRecycle = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectFileInfo/fileRecycle`,
    method:'delete',
    params:data
  })
}
