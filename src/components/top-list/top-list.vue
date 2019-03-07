<template>
    <transition name="slide">
      <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="topListDetail"></music-list>
    </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  export default {
    data () {
      return {
        topListDetail: [],
        rank: true
      }
    },
    computed: {
      title() {
        return this.topList.name
      },
      bgImage() {
        return this.topList.coverImgUrl
      },
      ...mapGetters([
        'topList'
      ])
    },
    created() {
      if (!this.topList.id) {
        this.$router.push('/rank')
      }
      this._normalizeSongs(this.topList.tracks)
    },
    methods: {
      _normalizeSongs(list) {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        let ret = []
        list.forEach((item) => {
          ret.push(createSong(item))
        })
        this.topListDetail = ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slider-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slider-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
