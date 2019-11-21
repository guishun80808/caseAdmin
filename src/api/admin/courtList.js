import request from '@/utils/request'



export function getAllCourtList() {
    return request({
      url:'courtInfo/queryAllCourt',
      method: 'post',
    //   params: { token }
    })
  };
  export function getAllCourtTreeList() {
    return request({
      url: '/courtInfo/queryTree',
      method: 'post',
    //   params: { token }
    })
  }
  export function getCourtRoomById(params) {
    return request({
      url: '/courtRoom/queryByCourtId',
      method: 'get',
      params
    })
  }
  export function searchCourtByName(params) {
    return request({
      url: '/courtRoom/queryByCourtId',
      method: 'get',
      params
    })
  }
  
  export function delCourtRoom(data) {
    return request({
      url: '/courtRoom/deleteCourtRoom',
      method: 'post',
      data
    })
  }
  export function addCourtRoom(data) {
    return request({
      url: '/courtRoom/addCourtRoom',
      method: 'post',
      data
    })
  }
  export function editCourtRoom(data) {
    return request({
      url: '/courtRoom/updateCourtRoom',
      method: 'post',
      data
    })
  }
  // export function queryAllCourtList() {
  //   return request({
  //     url: "/courtInfo/queryAllCourt",
  //     method: "get"
  //   });
  // }

  export function addCourt(data) {
    return request({
      url: '/courtInfo/addCourtInfo', 
      method: 'post',
      data
    })
  }
  
  export function editCourt(data) {
    return request({
      url: '/courtInfo/updateCourtInfo',
      method: 'post',
      data
    })
  }
  
  export function delCourt(data) {
    return request({
      url: '/courtInfo/deleteCourtInfo',
      method: 'post',
      data
    })
  }