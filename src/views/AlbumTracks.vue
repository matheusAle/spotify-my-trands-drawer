<template>
  <div class="album_track_list">
    <transition-group
      name="track"
      tag="div"
      @before-enter="beforeEnter"
    >
      <div
        v-for="(track, index) in $store.state.visibleAlbum.tracks"
        :key="track.id"
        class="track"
        :data-index="index"
      >
        <div class="track__ic-container"><i class="icon-pause"></i></div>
        <span class="track__name">{{ track.name }}</span>
        <span class="track__time">{{ track.duration_ms | duration('milliseconds')}}</span>
      </div>
    </transition-group>
  </div>
</template>
<script>
import duration from '@/filters/duration'

export default {
  filters: { duration },
  methods: {
    beforeEnter(el) {
      el.style.setProperty('--delay', (el.dataset.index * 40) + 500 + 'ms')
    },
  }
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

    &-enter-active,
    &-leave-active {
      transition: transform 300ms var(--delay), opacity 100ms var(--delay);
    }

    &-enter,
    &-leave-to {
      opacity: 0;
      transform: translateY(-50%);
    }
  }
</style>
