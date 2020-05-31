<template>
  <div class="container">
    <div class="albums_list" :class="{ '--active': viewItemindex > -1 }" @click="close()">
      <div
        class="album_item"
        v-for="(disc, index) of $store.state.albums.list" :key="disc.id"
        :class="{ '--active': index === viewItemindex }"
        @click.stop="view(index, $event)"
      >
        <div class="album">
          <img class="album__cover" :src="disc.images[0].url">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {ALBUM_VISIBLE__SET, ALBUM_VISIBLE__UNSET, ALBUMS__FETCH_DISCS, SET_AUTH} from "../store";
    export default {
        data: () => ({
            viewItemindex: -1,
            itemPos: null,
        }),
        async created() {
            if (!this.$store.state.isAuthorized) {
              await this.$store.dispatch(SET_AUTH, false);
              this.$router.replace('/')
            }
            try {
                await this.$store.dispatch(ALBUMS__FETCH_DISCS);
            } catch (e) {
                this.$router.replace('/');
                console.error(e)
            }
        },
        methods: {
            view(index, event) {
                if (this.viewItemindex === index) {
                    return this.close();
                }
                const initialPos = event.target.getBoundingClientRect();
                this.viewItemindex = index;
                this.$store.dispatch(ALBUM_VISIBLE__SET, this.$store.state.albums.list[this.viewItemindex])

                this.$nextTick(() => {
                  event.target.animate([
                    { transform: `rotateX(-30deg) translateY(${ initialPos.top }px)` },
                    { transform: 'rotateX(0deg) translateY(0)' }
                  ], {
                    duration: 500,
                    easing: 'cubic-bezier(.31,.8,.65,1.01)',
                  });
                });
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    &.--active {
      .album_item:not(.--active) {
        visibility: hidden;
      }

    }

    .album_item {
      height: 80px;
      transform-style: preserve-3d;
      transform: rotateX(-30deg);
      transform-origin: 50% 0;
      perspective-origin: 50% 50%;
      width: 90vw;

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
