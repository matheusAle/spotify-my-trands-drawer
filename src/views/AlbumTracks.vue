<template>
  <div class="album_track_list">
    <div v-for="(track, index) in $store.state.visibleAlbum.tracks" :key="index" class="track">
      <div class="track__ic-container"><i class="icon-pause"></i></div>
      <span class="track__name">{{ track.name }}</span>
      <span class="track__time">{{ track.duration_ms | duration('milliseconds')}}</span>
    </div>
  </div>
</template>
<script>
  import duration from '@/filters/duration'
export default {
  filters: { duration }
}
</script>
<style lang="scss" scoped>
  @import "@/theme";
  .album_track_list {
    padding: 64px 32px;
    box-sizing: border-box;
  }

  .track {
    display: flex;
    align-content: center;
    align-items: center;

    &__ic-container {
      margin-right: .5rem;
      overflow: hidden;
      color: $color-orange;
    }

    &__name {
      width: 100%;
      font-size: 1.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__time {
      margin-left: .5rem;
      color: $color-darker;
      opacity: .6;
    }

    &:not(:last-of-type) {
      margin-bottom: 16px;
    }
  }
</style>
