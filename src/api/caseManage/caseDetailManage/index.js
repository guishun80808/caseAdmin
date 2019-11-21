import request from '@/utils/request'

export function queryCasesList(params) {
  return request({
    url: '/caseInfo/queryCases',
    method: 'get',
    params 
  })
}

export function downloadCasesInfo(data) {
  return request({
    url: '/hbDownload/zipHuayuDossier',
    method: 'post',
    data 
  })
}

export function queryAllSubCaseInfo(params) {
  console.log(params)
  return request({
    url: '/subCaseInfo/queryAllSubCaseInfo',
    method: 'get',
    params 
  })
}



