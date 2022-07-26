import request from "@/router/axios";
const BASE_PATH = '/mgr/teamwork'

export const getProjectMember = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectMember/listProjectMember`,
    method:'get',
    params:data
  })
}

export const projectAssignExecutor= (data) =>{
  return request({
    url:`${BASE_PATH}/ProjectTask/assignExecutor`,
    method:'post',
    data
  })
}

export const projectTaskMember = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskMember`,
    method:'get',
    params:data
  })
}

export const projectTaskSetMember = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskMember/inviteMember`,
    method:'post',
    data
  })
}

export const projecMemberForInList = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectMember/listForInvite`,
    method:'post',
    data
  })
}

export const projectMemberInvite = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectMember/inviteMember`,
    method:'post',
    data
  })
}

export const projectMembers = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectMember/projectMember`,
    method:'post',
    data
  })
}

export const projectMemberDel = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectMember/removeMember`,
    method:'delete',
    params:data
  })
}
