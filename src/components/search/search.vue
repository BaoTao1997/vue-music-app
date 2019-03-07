<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.first)" class="item" v-for="item in hotKey">
                <span>{{item.first}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest @select="saveSearch" @listScroll="blurInput" :query="query" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有历史内容" confirmBtnText="清空"
             @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import Suggest from 'components/suggest/suggest'
  import {getSearchHot} from 'api/search'
  import {ERR_OK} from 'common/js/config'
  import {playlistMixin, searchMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'

  export default {
    mixins: [playlistMixin, searchMixin],
    data() {
      return {
        hotKey: [],
      }
    },
    computed: {
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created() {
      this._getHotKey()
    },
    methods: {
      handlePlaylist(playlist) {
        if (!playlist) {
          return
        }
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      // 通过Mixin实现公用
      // addQuery(query) {
      //   this.$refs.searchBox.setQuery(query)
      // },
      // 滚动时,input框失去焦点
      // blurInput() {
      //   this.$refs.searchBox.blur()
      // },
      // 若methods仅仅只是调用action的话,并且参数相同,可以直接把事件放到@click=后面减少代码量
      // deleteOne(item) {
      //   this.deleteSearchHistory(item)
      // },
      // deleteAll() {
      //   this.clearSearchHistory()
      // },
      // showConfirm() {
      //   this.$refs.confirm.show()
      // },
      // 保存搜索结果,在刷新的时候,还是能保存其结果,不能单纯地放到state中,还要放到localStorage
      // saveSearch() {
      //   this.saveSearchHistory(this.query)
      // },
      showConfirm() {
        this.$refs.confirm.show()
      },
      _getHotKey() {
        getSearchHot().then((res) => {
          if (res.data.code === ERR_OK) {
            this.hotKey = res.data.result.hots
          }
        })
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch: {
      // 边界情况,刚好搜索记录撑开父盒子时切回主页面,由于DOM还是搜索列表页面,所以并不能scroll
      // 从搜索列表切到主页面时,要把Scroll组件进行刷新
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      SearchBox,
      SearchList,
      Scroll,
      Confirm,
      Suggest
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
