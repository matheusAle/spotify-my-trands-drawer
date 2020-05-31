<template>
  <div class="container">
    <div class="albums_list" :style="{ '--totalItems': $store.state.albums.list.length }">
      <div
        class="album_item"
        v-for="disc of $store.state.albums.list" :key="disc.id"
        :ref="disc.id"
        @click.stop="view(disc, $event)"
      >
        <div class="album">
          <img class="album__cover" :src="disc.images[0].url">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {ALBUM_VISIBLE__SET, ALBUM_VISIBLE__UNSET, ALBUMS__FETCH_DISCS} from "../store";
  export default {
    data: () => ({
      viewItemindex: -1,
      itemPos: null,
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
          this.animate(el, [
            { transform: `rotateX(-30deg) translateY(${ initialPos.top }px)` },
            { transform: 'rotateX(0deg) translateY(0)' },
          ]);
        } else {
          el.classList.remove('--active');
          const endPos = el.getBoundingClientRect();
          this.animate( el,[
            { transform: `rotateX(0deg) translateY(${ initialPos.top - endPos.top }px)` },
            { transform: `rotateX(-30deg) translateY(0px)` },
          ])
        }
      }
    },
    methods: {
      animate(el, frames) {
        el.animate(frames, {
          duration: 500,
          easing: 'cubic-bezier(.31,.8,.65,1.01)',
        });
      },
      view(disc) {
        if (this.activeAlbumId === disc.id) {
          return this.close();
        }
        this.$store.dispatch(ALBUM_VISIBLE__SET, disc)


      },
      close() {
        this.itemPos = null;
        this.viewItemindex = -1;
        this.$store.dispatch(ALBUM_VISIBLE__UNSET)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/theme";

  .container {
    overflow: auto;
  }

  .albums_list {
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(50ch + calc(var(--totalItems) * 90));

    .album_item {
      height: 90px;
      transform-style: preserve-3d;
      transform: rotateX(-30deg);
      transform-origin: 50% 0;
      perspective-origin: 50% 50%;
      width: 90vw;
      transition: transform 500ms cubic-bezier(.31,.8,.65,1.01);

      &.--active {
        transform: rotateX(0deg);
        position: fixed;
        top: 30px;
        width: 80vw;
        z-index: 9;

        .album::after {
          display: none;
        }
      }

      .album {
        pointer-events: none;
        position: relative;
        border-radius: 10px;
        overflow: hidden;

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
      }
    }
  }

</style>
