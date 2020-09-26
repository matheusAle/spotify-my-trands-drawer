<template>
  <div id="drawer" :style="{'--offset': `${offset < 0 ? -offset : 0}px`}">
    <Albums
      id="albums"
      :activeItemsStats="activeItemsStats"
    />
    <transition name="tracks">
      <div id="tracks-container" v-if="$store.state.visibleAlbum.viewing">
        <div class="tracks-wrapper" ref="tracksWrapper" @scroll="scroll($event)">
          <AlbumTracks
            class="album_tracks"
            @touchmove="touchmove"
            @touchend="touchend"
            @touchstart="touchstart"
            @click="e => e.stopPropagation()"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AlbumTracks from './AlbumTracks'
import Albums from './Albums';
import {loadSpoifySdk} from "../services/spotify";
import {ALBUM_VISIBLE__UNSET, PLAYER__FETCH} from "../store";

export default {
  components: { AlbumTracks, Albums },
  filters: {

  },
  data() {
    return {
      player: null,
      offset: 0,
      screenY: null,
    }
  },
  created() {
    this.$store.dispatch(PLAYER__FETCH)
    // this.startSpotifySdk();
  },
  destroyed() {
    if (this.player) {
      this.player.disconnect()
    }
  },
  computed: {
    activeItemsStats() {
      if (this.offset < 0) {
        return { transform: `translateY(${ this.offset }px)` }
      }
      return { transform: `translateY(${ -this.offset }px) scale(${ 1 - (this.offset / 2500) })` }
    }
  },
  methods: {
    touchend() {
      if (this.offset < 0) {
        this.offset = 0;
      }
    },
    scroll({ target: { scrollTop } }) {
      this.offset = scrollTop;
      console.log(scrollTop)
    },
    touchstart({ touches:[touch]}) {
      this.screenY = touch.screenY;
    },
    touchmove({ touches: [ touch ]}) {
       const offset = this.screenY - touch.screenY;
      if (offset > 0 || this.$refs.tracksWrapper.scrollTop !== 0) {
        return;
      }
      if (offset < -100) {
        this.offset = 0;
        this.$store.dispatch(ALBUM_VISIBLE__UNSET);
        return;
      }
      this.offset = offset;
    },
    async startSpotifySdk() {
      const Spotify = await loadSpoifySdk();
      const player = new Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(this.$store.state.auth.access_token); }
      });

      this.player = player;

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', (data) => {
        console.log('Ready with Device ID', data);
        player.getCurrentState().then(console.log);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      player.connect();

    }
  }
}
</script>

<style lang="scss" scoped>
  @import "@/responsive-mixin";

  #drawer {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    align-content: center;
  }

  #albums {
    width: 100%;
    height: 100%;
  }


  #tracks-container {
    overflow: hidden;
    position: fixed;
    top: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    background-color: #000000ba;

    .tracks-wrapper {
      overflow: auto;
      max-height: 100%;
      width: 100%;
      height: 100%;
    }

    .album_tracks {
      /*height: 65vh;*/
      width: 95vw;
      background: white;
      z-index: 1;
      bottom: 0;
      overflow: hidden;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      transform: translateY(var(--offset));
      margin-top: 40vh;
      min-height: 60vh;
      margin-left: auto;
      margin-right: auto;

      @include min-sm() {
        width: 650px;
      }
    }
  }

  .tracks {
    &-leave-active {
      background-color: transparent !important;
    }
    &-enter-active,
    &-leave-active {
      transition: background-color .4s cubic-bezier(.31,.8,.65,1.01);

      .album_tracks {
        transition: transform .300ms cubic-bezier(.31,.8,.65,1.01), opacity 300ms cubic-bezier(.31,.8,.65,1.01);
      }
    }

    &-enter,
    &-leave-to {
      background-color: transparent;

      .album_tracks {
        transform: translateY(100%);
        opacity: 0;
      }
    }
  }
</style>
