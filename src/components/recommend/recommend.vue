<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <!--加上v-if判断recommends.length是否存在,保证有数据被渲染才从slider.vue的slot中用mounted设置样式-->
      <div>
        <div v-if="banners.length" class="slider-wrapper">
          <slider>
            <div v-for="item in banners">
              <a>
                <img class="needsclick" @load="loadImage" :src="item.imageUrl" alt="">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" @click="selectItem(item)" class="item">
              <div class="icon">
                <img v-lazy="item.picUrl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.copywriter"></h2>
                <p class="desc" v-html="item.name"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider';
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import {ERR_OK} from 'common/js/config';
  import {getBanner, getRecommendList} from "api/recommend";
  import {playlistMixin} from "common/js/mixin";
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        // 首页轮播图
        banners: [],
        discList: []
      }
    },
    created() {
      this._getRecommendList()
      this._getBanner()
    },
    methods: {
      handlePlaylist(playlist) {
        if (!playlist) {
          return
        }
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.id}`
        })
        this.setDisc(item)
      },
      _getBanner () {
        getBanner().then((res) => {
          if (res.status === ERR_OK) {
            this.banners = res.data.banners.splice(4)
          } else {
            console.error('Banner 获取失败')
          }
        })
      },
      _getRecommendList () {
        getRecommendList().then((res) => {
          if (res.status === ERR_OK) {
            this.discList = res.data.result
          } else {
            console.error('getRecommendList 获取失败')
          }
        })
      },
      loadImage() {
        // 设定标记位保证程序只执行一次
        if(!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
