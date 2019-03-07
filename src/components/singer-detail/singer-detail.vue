<template>
  <!--transition实现动画效果-->
  <transition name="slide">
    <music-list :songs="songs" :bg-image="bgImage" :title="title" ref="musiclist"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from "api/singer"
  import {ERR_OK} from 'common/js/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        // 直接在当前页面刷新,很有可能获取不到数据,所以没有获取到数据就跳转到singer组件
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.data.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.hotSongs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          if (item.al && item.ar) {
            ret.push(createSong(item))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  /*.singer-detail*/
    /*position: fixed*/
    /*z-index: 100*/
    /*top: 0*/
    /*left: 0*/
    /*right: 0*/
    /*bottom: 0*/
    /*background: $color-background*/
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
