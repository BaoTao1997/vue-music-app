import axios from 'axios'
import {HOST} from 'common/js/config'

export function getTopList (id) {
  const url = HOST + `/top/list?idx=${id}`
  return axios.get(url)
}
