
const SESSION_KEY = 'spot_drawer_session';

export function loadSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
}

export function storeSession(data) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}
