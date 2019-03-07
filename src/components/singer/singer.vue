<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'common/js/config'
  import Singer from 'common/js/singer'
  import listView from 'base/listview/listview'
  // Vue的语法糖,对Mutations进行封装
  import {mapMutations} from 'vuex'
  import {playlistMixin} from "common/js/mixin";

  const pinyin = require('pinyin')
  const HOT_SINGER_LEN = 10
  const HOT_NAME = '热门'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist) {
        if (!playlist) {
          return
        }
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        // 利用Vuex获取歌手的详情数据
        this.setSinger(singer)
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.data.code === ERR_OK) {
            let s = res.data.artists
            s.map((item) => {
              let py = pinyin(item.name[0], {
                style: pinyin.STYLE_FIRST_LETTER
              })
              item.initial = py[0][0].toUpperCase()
            })
            this.singers = this._normalizeSinger(s)
            // this.singers = this._normalizeSinger(res.data.list)
          } else {
            console.error('getSingerList 获取失败')
          }
        })
      },
      _normalizeSinger(list) {
        let map ={
          // 热门
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach(function (item, index) {
          if(index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              aliaName: item.alias.join(' / ')
            }))
          }

          const key = item.initial
          if(!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          map[key].items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias[0]
          }))
        })
        // 为了得到有序列表需要处理Map
        let hot = []
        let ret = []
        for(let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if(val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a,b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret);
      },
      // 简化了this.$store.state.commit()
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    components: {
      listView
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
