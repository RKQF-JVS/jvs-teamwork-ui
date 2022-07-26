import request from "@/router/axios";
const BASE_PATH = '/mgr/teamwork'

export const projectWorkFlow = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskWorkflow/listWorkflow`,
    method:'get',
    params:data
  })
}

export const projectTaskListMould = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskMould/listMould`,
    method:'post',
    data
  })
}

export const projectTaskListSave = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskMould/save`,
    method:'post',
    data
  })
}

export const projectTaskListEdit = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskMould/edit`,
    method:'put',
    data
  })
}

export const projectTaskListDel = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskMould/del`,
    method:'delete',
    params:data
  })
}

export const projectTaskRecycleBatch = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/taskRecycleBatch`,
    method:'delete',
    params:data
  })
}

export const projectTaskSave = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/save`,
    method:'post',
    data
  })
}

export const projectTaskEdit = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/edit`,
    method:'put',
    data
  })
}

export const projectTaskDetail = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/detail`,
    method:'get',
    params:data
  })
}

export const projectLogList =(data)=>{
  return request({
    url:`${BASE_PATH}/ProjectLog/listProjectLog`,
    method:'get',
    params:data
  })
}

export const projectTaskMouldSort = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskMould/sort`,
    method:'post',
    data
  })
}

export const projectTaskSort = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/sort`,
    method:'post',
    data
  })
}

export const projectTaskLike = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/taskLike`,
    method:'post',
    data
  })
}

export const projectTaskRecycle = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/taskRecycle`,
    method:'delete',
    params:data
  })
}

export const projectTaskRecovery = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/taskRecovery`,
    method:'put',
    params:data
  })
}

export const projectTaskCollect= (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/taskCollect`,
    method:'post',
    data
  })
}

export const projectTaskSetPrivate = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/setPrivate`,
    method:'put',
    data
  })
}

export const projectTaskComment= (data) =>{
  return request({
    url:`${BASE_PATH}/ProjectTask/taskComment`,
    method:'post',
    data
  })
}

export const projectTaskSaveWorkTime= (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/saveTaskWorkTime`,
    method:'post',
    data
  })
}

export const projectTaskEditWorkTime = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/editTaskWorkTime`,
    method:'PUT',
    data
  })
}

export const proejctTaskDone = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/taskDone`,
    method:'post',
    data
  })
}

export const projectTaskWorkTimeDel = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTaskWorkTimeRecord/delWorkTimeRecord`,
    method:'delete',
    data
  })
}

export const projectTasklistRecycle=(data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/listRecycle`,
    method:'get',
    params:data
  })
}

export const projectTaskDel= (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/del`,
    method:'delete',
    params:data
  })
}

export const projectTaskCopy = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/taskCopy`,
    method:'post',
    data
  })
}

export const projectTaskMove = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/taskMove`,
    method:'post',
    data
  })
}

export const projectTaskAssignExecutorBatch = (data)=>{
  return request({
    url:`${BASE_PATH}/ProjectTask/assignExecutorBatch`,
    method:'post',
    data
  })
}
