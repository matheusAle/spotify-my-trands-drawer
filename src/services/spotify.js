import {loadScript} from "../utils/loadscript";

const server = 'https://api.spotify.com/v1';

function req(url, options) {
    return fetch(`${server}${url}`, options)
        .then(response => {
            if (response.status >= 400) {
                throw response
            }
            return response.json();
        })
}

const _get = (url, options) => req(url, { method: 'GET', ...options });


export function fetchTopTracks({ access_token, token_type }) {
    return _get(`/me/top/tracks`, { headers: { Authorization: `${ token_type } ${ access_token }` }});
}

export function fetchAlbumTracks({ access_token, token_type }, { id }) {
    return _get(`/albums/${id}/tracks`, { headers: { Authorization: `${ token_type } ${ access_token }` }});
}

export function fetchDevices({ access_token, token_type }) {
    return _get(`/me/player/devices`, { headers: { Authorization: `${ token_type } ${ access_token }` }});
}

export function fetchCurrentPlayer({ access_token, token_type }) {
    return _get(`/me/player`, { headers: { Authorization: `${ token_type } ${ access_token }` }});
}

export async function loadSpoifySdk() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        window.onSpotifyWebPlaybackSDKReady = () => {
            resolve(window.Spotify);
            delete window.onSpotifyWebPlaybackSDKReady
        };
        await loadScript('https://sdk.scdn.co/spotify-player.js')
    })
}
