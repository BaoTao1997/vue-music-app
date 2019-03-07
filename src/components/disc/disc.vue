<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getRecommendListDetail} from 'api/recommend'
  import {ERR_OK} from 'common/js/config'
  import {mapGetters} from 'vuex'
  import {createRecommendListSong} from 'common/js/song'

  export default {
    computed: {
      title() {
        return this.disc.copywriter
      },
      bgImage() {
        return this.disc.picUrl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getRecommendListDetail(this.disc.id)
    },
    methods: {
      _getRecommendListDetail (id) {
        // if (!id) {
        //   this.$router.push('/recommend')
        //   return
        // }
        getRecommendListDetail(id).then((res) => {
          if (res.status === ERR_OK) {
            this.songs = res.data.playlist.tracks.map((item) => {
              return createRecommendListSong(item)
            })
            console.log(this.songs)
          } else {
            console.error('getRecommendListDetail 获取失败！')
          }
        })
      },
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
