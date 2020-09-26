<template>
  <div class="container">
    <button @click="auth()">Auth</button>
  </div>
</template>

<script>
export default {
    methods: {
        auth() {
            const clientId = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
            const authUrl = 'https://accounts.spotify.com/authorize';
            const responseType = 'token';
            const redirectUrl = encodeURI(`${location.origin}${process.env.BASE_URL}auth-callback`);
            const scope = encodeURI(["user-read-playback-state", "user-read-private", "user-read-email", "playlist-read-private", "user-library-read", "user-library-modify", "user-top-read", "playlist-read-collaborative", "playlist-modify-public", "playlist-modify-private", "user-follow-read", "user-follow-modify", "user-read-currently-playing", "user-modify-playback-state", "user-read-recently-played"].join(' '));
            location.href = `${authUrl}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUrl}`
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/vars";

.container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    button {
        outline: none;
        border: none;
        text-transform: uppercase;
        box-sizing: border-box;
        padding: 10px 30px;
        border-radius: 5px;
        background-color: $color-orange;
        color: $color-light;
    }
}

</style>
