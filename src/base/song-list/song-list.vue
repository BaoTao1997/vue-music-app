<!-- 歌曲列表组件 -->
<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs" @click="selectItem(song,index)" class="item">
        <div class="rank" v-show="rank">
          <span class="text">{{index + 1}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectItem(song, index) {
        this.$emit('select', song, index)
      },
      getDesc(song) {
        if (song.aliaName) {
          return `${song.singer} - ${song.aliaName}`
        } else {
          return `${song.singer}`
        }
      }
    },
  }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import '~common/stylus/variable';
  @import '~common/stylus/mixin';

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap();
          margin-top: 4px
          color: $color-text-d
      .rank
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        text-align: center;
        .text
          color: $color-theme;
          font-size: $font-size-large;
</style>
