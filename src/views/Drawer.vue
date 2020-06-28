<template>
  <div id="drawer" :style="{'--offset': offset}">
    <Albums id="albums"/>
    <transition name="tracks">
      <div class="tracks-container" v-if="$store.state.visibleAlbum.viewing">
        <AlbumTracks
          class="album_tracks"
          @touchmove="touchmove"
          @touchend="touchend"
          @touchstart="touchstart"
          @click="e => e.stopPropagation()"
        />
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
  methods: {
    touchend() {
      this.offset = 0;
    },
    touchstart({ touches:[touch]}) {
      this.offset = 0;
      this.screenY = touch.screenY;
    },
    touchmove({ touches:[touch], }) {
      const offset = (-(this.screenY - touch.screenY));
      if (offset < 0) {
        return;
      }
      if (offset > 100) {
        this.$store.dispatch(ALBUM_VISIBLE__UNSET);
        return;
      }
      this.offset = offset + 'px';
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

  #drawer {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  #albums {
    width: 100%;
    height: 100%;
  }

  .tracks-container {
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000000ba;

    .album_tracks {
      height: 65vh;
      width: 95vw;
      background: white;
      margin: 0 auto;
      z-index: 1;
      bottom: 0;
      overflow: hidden;
      position: fixed;
      left: 0;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      right: 0;
      transform: translateY(var(--offset));
    }
  }

  .tracks {
    &-enter-active,
    &-leave-active {
      transition: background-color .4s cubic-bezier(.31,.8,.65,1.01);

      .album_tracks {
        transition: transform .5s cubic-bezier(.31,.8,.65,1.01), opacity 300ms cubic-bezier(.31,.8,.65,1.01);
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
