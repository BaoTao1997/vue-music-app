import {HOST} from 'common/js/config'
import axios from 'axios'

export function getBanner () {
  const url = HOST + '/banner'
  return axios.get(url)
}

export function getRecommendList () {
  const url = HOST + '/personalized'
  return axios.get(url)
}

export function getRecommendListDetail (id) {
  const url = HOST + `/playlist/detail?id=${id}`
  return axios.get(url)
}
