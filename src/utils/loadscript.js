
export function loadScript(src) {
    return new Promise((resolve) => {
        const scriptEl = document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.src = src;

        if (scriptEl.readyState) {  // IE

            scriptEl.onreadystatechange = () => {
                if (scriptEl.readyState === 'loaded' || scriptEl.readyState === 'complete') {
                    scriptEl.onreadystatechange = null;
                    resolve(true);
                }
            };

        } else {  // Others
            scriptEl.onload = () => resolve(true);
        }
        document.getElementsByTagName('head')[0].appendChild(scriptEl);
    });
}
