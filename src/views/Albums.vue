<template>
  <div class="container">
    <transition name="bounce">
<!--      <span id="close-tracks" @click="close()" v-if="viewItem">></span>-->
    </transition>
    <div class="albums_list">
      <div
        class="album_item"
        v-for="disc of $store.state.albums.list" :key="disc.id"
        @click.stop="view(disc, $event)"
      >
        <div class="album" :ref="disc.id" :class="{ '--active': disc.id === activeAlbumId }">
          <img class="album__cover" :src="disc.images[0].url">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {ALBUM_VISIBLE__SET, ALBUM_VISIBLE__UNSET, ALBUMS__FETCH_DISCS} from "../store";
  export default {
    props: {
      activeItemsStats: null
    },
    data: () => ({
      viewItem: false,
    }),
    computed: {
      activeAlbumId() {
        return this.$store.state.visibleAlbum?.album?.id
      }
    },
    async created() {
      if (!this.$store.state.isAuthorized) {
        this.$router.replace('/')
      }
      try {
        await this.$store.dispatch(ALBUMS__FETCH_DISCS);
      } catch (e) {
        this.$router.replace('/');
      }
    },
    watch: {
      activeAlbumId(newValue, oldValue) {
        const [el] = this.$refs[newValue || oldValue];
        const initialPos = el.getBoundingClientRect();
        if (newValue) {
          el.classList.add('--active');
          const endPos = el.getBoundingClientRect();

          this.animate(el, [
            { transform: `rotateX(-30deg) translateY(${ initialPos.top - endPos.top }px)` },
            { transform: 'rotateX(0deg) translate(0)' },
          ]);
        } else {
          el.classList.remove('--active');
          const endPos = el.getBoundingClientRect();
          this.animate( el,[
            { transform: `rotateX(0deg) translateY(${ initialPos.top - endPos.top }px)`  },
            { transform: `rotateX(-30deg) translateY(0px)` },
          ])
        }
      },
      activeItemsStats(newValue) {
        if (!this.$refs[this.activeAlbumId]) {
          return;
        }
        this.animate(this.$refs[this.activeAlbumId][0],[newValue]);
      }
    },
    methods: {
      animate(el, frames) {
        el.animate(frames, {
          duration: 500,
          easing: 'cubic-bezier(.31,.8,.65,1.01)',
          fill: "forwards"
        });
      },
      view(disc) {
        this.viewItem = true;
        if (this.activeAlbumId === disc.id) {
          return this.close();
        }
        this.$store.dispatch(ALBUM_VISIBLE__SET, disc)
      },
      close() {
        this.viewItem = false;
        this.$store.dispatch(ALBUM_VISIBLE__UNSET)
      }
    }
  }
</script>
<style lang="scss">
@import "@/responsive-mixin";
@import "@/vars";

:root {
  --album-item__size: #{$album-item__size};
  --album-item__top: #{$album-item__top};

  @include min-md() {
    --album-item__size: #{$album-item__size--md};
  }
}
</style>
<style lang="scss" scoped>
@import "@/vars";
@import "@/responsive-mixin";

#close-tracks {
  display: none;

  @include min-md() {
    $close-size: 32px;
    background: white;
    width: $close-size;
    height: $close-size;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: center;
    line-height: $close-size;
    font-weight: 800;
    transform: rotate(90deg) scale(1);
    font-size: .9rem;
    position: fixed;
    left: calc(50% - #{$close-size} / 2);
    z-index: 10;
    top: calc(var(--album-item__size) + var(--album-item__top) - #{$close-size} / 2);
    box-shadow: -1px 0px 6px 0px #0000007d;
    color: lightgray;
    cursor: pointer;
    transition: all 150ms ease-out;

    &:hover {
      color: gray;
      box-shadow: -1px 0px 6px 2px #0000007d;
    }
  }
}

.bounce {
  &-enter-active,
  &-leave-active {
    transition: transform 10s cubic-bezier(.31,.8,.65,1.01);
  }

  &-enter,
  &-leave-to {
    transform: scale(0);
  }
}

.container {
  overflow: scroll;
}

.albums_list {
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .album_item {
    height: 90px;
    width: var(--album-item__size);

    .album {
      pointer-events: none;
      border-radius: 10px;
      overflow: hidden;
      transition: transform 500ms cubic-bezier(.31,.8,.65,1.01)
                , width 500ms cubic-bezier(.31,.8,.65,1.01);
      transform: rotateX(-30deg);
      transform-style: preserve-3d;
      transform-origin: 50% 0;
      perspective-origin: 50% 50%;
      width: var(--album-item__size);
      left: calc(50% - var(--album-item__size) / 2);

      &:after {
        content: '';
        position: absolute;
        background: linear-gradient(transparent 0%, $color-darker);
        width: 100%;
        height: 50%;
        bottom: 0;
        left: 0;
      }

      &__cover {
        width: 100%;
        object-fit: cover;
      }

      &.--active {
        transform: rotateX(0deg);
        z-index: 9;
        top: var(--album-item__top);
        position: fixed;
        width: 40vh;
        height: 40vh;
        left: calc(50% - 20vh);

        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
