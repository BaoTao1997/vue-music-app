// state数据文件
import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
  // 歌手数据
  singer: {},
  // 播放器播放与暂停
  playing: false,
  // 播放器是否全屏
  fullScreen: false,
  // 播放器的播放列表
  playList: [],
  // 播放器的顺序列表,只有顺序播放与playList是一致的,否则不同
  sequenceList: [],
  // 播放器的播放模式
  mode: playMode.sequence,
  // 播放器当前的索引
  currentIndex: -1,
  // 详情页歌单
  disc: {},
  // 排行榜歌单
  topList: {},
  // 搜索历史
  searchHistory: loadSearch(),
  // 播放历史
  playHistory: loadPlay(),
  // 收藏列表
  favoriteList: loadFavorite()
}

export default state
