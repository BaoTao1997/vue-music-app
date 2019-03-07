<template>
  <scroll ref="suggest" class="suggest" :data="songs" :pullup="pullup" :beforeScroll="beforeScroll"
          @beforeScroll="listScroll" @scrollToEnd="searchMore">
    <ul class="suggest-list">
      <li @click="selectItem(suggest.artists[0])" class="suggest-item" v-if="suggest.artists && showSinger">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{suggest.artists[0].name}}</p>
        </div>
      </li>
      <li @click="selectSong(item)" class="suggest-item" v-for="(item, index) in songs">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{item.name}}</p>
        </div>
      </li>
      <loading v-show="hasMore && query" title=""></loading>
    </ul>
    <div v-show="!hasMore && !songs.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import NoResult from 'base/no-result/no-result'
  import {getSearchSongs, getSearchSuggest, getSongDetail} from 'api/search'
  import {ERR_OK} from 'common/js/config'
  import {createSearchSong} from 'common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        // 是否上拉刷新
        pullup: true,
        // 上拉是否把键盘收起
        beforeScroll: true,
        // 搜索第几页
        page: 0,
        // 搜索是否有更多
        hasMore: true,
        // 搜索歌曲内容
        songs: [],
        // 搜索歌手和歌单
        suggest: {}
      }
    },
    methods: {
      selectItem(item) {
        const singer = new Singer({
          id: item.id,
          name: item.name,
          avatar: item.img1v1Url
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
        this.$emit('select')
      },
      // 要把歌曲添加到当前播放的列表
      selectSong(item) {
        getSongDetail(item.id).then((res) => {
          item.image = res.data.songs[0].al.picUrl
          this.insertSong(item)
        })
        this.$emit('select')
      },
      search() {
        this.haveMore = true
        if (!this.query) {
          return
        }
        // 每次重新搜索,则上拉到顶部
        this.$refs.suggest.scrollTo(0, 0)
        getSearchSongs(this.query, this.page).then((res) => {
          if (res.data.code === ERR_OK) {
            if (!res.data.result.songs) {
              this.hasMore = false
              return
            }
            let list = res.data.result.songs
            let ret = []
            list.forEach((item) => {
              ret.push(createSearchSong(item))
            })
            this.songs = ret
          }
        })
        this.page += 30
        getSearchSuggest(this.query).then((res) => {
          if (res.data.code === ERR_OK) {
            this.suggest = res.data.result
          }
        })
      },
      searchMore() {
        console.log('searchMore')
        if (!this.hasMore) {
          return
        }
        getSearchSongs(this.query, this.page).then((res) => {
          let list = res.data.result.songs
          if (!res.data.result.songs) {
            this.hasMore = false
            return
          }
          let ret = []
          list.forEach((item) => {
            ret.push(createSearchSong(item))
          })
          this.songs = this.songs.concat(ret)
          this.page += 30
        })
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      listScroll() {
        this.$emit('listScroll')
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query(newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
