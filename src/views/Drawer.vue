<template>
  <div id="drawer">
    <Albums id="albums"/>
    <AlbumTracks
      v-if="$store.state.visibleAlbum.viewing"
      id="album_tracks"
    />
  </div>
</template>

<script>
    import AlbumTracks from './AlbumTracks'
    import Albums from './Albums';
    import {loadSpoifySdk} from "../services/spotify";
    import {PLAYER__FETCH} from "../store";

    export default {
        components: { AlbumTracks, Albums },
        data() {
            return {
                player: null,
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

  #album_tracks {
    overflow: hidden;
    position: fixed;
    z-index: 1;
    bottom: 0;
    left: 0;
    height: 65vh;
    width: 95vw;
    background: white;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    margin: 0 auto;
    right: 0;
  }
</style>
