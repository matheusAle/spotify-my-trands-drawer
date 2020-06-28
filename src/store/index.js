import Vue from 'vue'
import Vuex from 'vuex'
import {fetchAlbumTracks, fetchCurrentPlayer, fetchDevices, fetchTopTracks} from "../services/spotify";
import {loadSession, storeSession} from "../services/session";

Vue.use(Vuex);

const _getAct = s => s.split('/').reverse()[0];
const _getMutations = (stateDef, { mutations = {}, state = {} } = {}) => {
  return Object.entries(stateDef).reduce((newState, [prop, {  initial, setter  = true }]) => {
    if (setter) {
      const setName = `set${prop[0].toUpperCase()}${prop.slice(1, prop.length)}`;
      newState.mutations[setName] = function (state, v) { state[prop] = v }
    }
    newState.state[prop] = initial;
    return newState;
  }, {
    state: state,
    mutations: mutations
  })
};

export const SET_AUTH = 'SET_AUTH';

const ALBUMS = 'albums';
export const ALBUMS__FETCH_DISCS = `${ALBUMS}/FETCH`;

export const PLAYER = 'player';
export const PLAYER__PLAY_TRACK = `${PLAYER}/PLAY_TRACK`;
export const PLAYER__FETCH = `${PLAYER}/FETCH`;

const ALBUM_VISIBLE = 'visibleAlbum';
export const ALBUM_VISIBLE__SET = `${ALBUM_VISIBLE}/SET_VISIBLE`;
export const ALBUM_VISIBLE__UNSET = `${ALBUM_VISIBLE}/UNSET_VISIBLE`;

export default new Vuex.Store({
  state: {
    isAuthorized: !!loadSession(),
    auth: (() => {
      const auth = loadSession();
      if (auth && auth.expires_in < Date.now()) {
        storeSession(null);
        return {};
      } else {
        return auth;
      }
    })(),
  },
  mutations: {
    [SET_AUTH]: (state, auth) => {
      state.isAuthorized = !!auth.access_token;
      state.auth = auth;
      storeSession(auth);
    }
  },
  modules: {
    [ALBUMS]: {
      namespaced: true,
      ..._getMutations({
        loading: { initial: true, setter: true },
        list: { initial: [], setter: true }
      }),
      actions: {
        async [_getAct(ALBUMS__FETCH_DISCS)]({ rootState, commit }) {
          try {
            commit('setLoading', true);
            const { items } = await fetchTopTracks(rootState.auth);
            const albumsMap = new Map();
            items.map(item => item.album).forEach(album => albumsMap.set(album.id, album));
            commit('setList', [...albumsMap.values()]);
          } finally {
            commit('setLoading', false);
          }
        }
      }
    },
    [ALBUM_VISIBLE]: {
      namespaced: true,
      ..._getMutations({
        viewing: { initial: false, setter: true },
        loading: { initial: true, setter: true },
        album: { initial: null, setter: true },
        tracks: { initial: [], setter: true }
      }),
      actions: {
        async [_getAct(ALBUM_VISIBLE__SET)]({ commit, rootState }, album) {
          try {
            commit('setAlbum', album);
            commit('setViewing', true);
            commit('setLoading', true);
            const tracks = await fetchAlbumTracks(rootState.auth, album);
            commit('setTracks', tracks.items);
          } catch (e) {
            console.error(e)
          } finally {
            commit('setLoading', false);
          }
        },
        [_getAct(ALBUM_VISIBLE__UNSET)]({ commit }) {
          commit('setLoading', false);
          commit('setAlbum', {});
          commit('setViewing', false);
          commit('setTracks', []);
        }
      },
    },
    [PLAYER]: {
      namespaced: true,
      ..._getMutations({
        loading: { initial: null, setter: true },
        devices: { initial: [], setter: true },
        current: { initial: {}, setter: true },
      }),
      actions: {
        async [_getAct(PLAYER__FETCH)]({ commit, rootState }) {
          try {
            commit('setLoading', true);
            const { devices } = await fetchDevices(rootState.auth);
            commit('setDevices', devices);
            commit('setCurrent', await fetchCurrentPlayer(rootState.auth));
          } finally {
            commit('setLoading', false);
          }
        }
      }
    }
  }
})
