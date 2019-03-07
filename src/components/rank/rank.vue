<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item in topList">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.coverImgUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.top">
              <span>{{index + 1}}</span>
              <span>{{song.name}}-{{song.ar[0].name}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="showLoading">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getTopList} from 'api/rank'
  import {ERR_OK} from 'common/js/config'
  import {playlistMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  // 对应各种类型的排行榜
  const YUNMUSIC_TOP = [0, 1, 2, 3, 4, 22, 23]

  export default {
    mixins: [playlistMixin],
    created() {
      this._getTopList()
    },
    data() {
      return {
        // 各类排行榜数组
        topList: [],
        // loading组件的显示与隐藏
        showLoading: true,
        arr: [],
      }
    },
    methods: {
      handlePlaylist(playlist) {
        if (!playlist) {
          return
        }
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`
        })
        this.setTopList(item)
      },
      _getTopList() {
        for (let i = 0; i < YUNMUSIC_TOP.length; i++) {
          getTopList(YUNMUSIC_TOP[i]).then((res) => {
            if (res.data.code === ERR_OK) {
              let list = res.data.playlist
              list.top = res.data.playlist.tracks.slice(0,3)
              this.topList.push(list)
            }
            if (i === YUNMUSIC_TOP.length - 1) {
              this.showLoading = false
            }
          })
        }

      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    },
    watch: {
      // topList() {
      //   setTimeout(() => {
      //     this.$Lazyload.lazyLoadHandler()
      //   }, 20)
      // }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
