import { storage } from "./storage";

type ThemeType = 'light' | 'dark' | 'system';

const THEME_KEY = 'l-custom-theme';

export function toggle(theme: ThemeType, cb?: (isDark: boolean) => void) {
    const { start, stop } = autoFollowSystem(cb)
    if (theme === 'light') {
        stop()
        storage.set(THEME_KEY, 'light')
    } else if (theme === 'dark') {
        stop()
        storage.set(THEME_KEY, 'dark')
    } else {
        start()
    }
}


function autoFollowSystem(cb?: (isDark: boolean) => void) {
    const isSupport = 'matchMedia' in window && typeof window.matchMedia === 'function'
    let mediaQuery: MediaQueryList
    const handler = (event: MediaQueryListEvent) => {
        storage.set(THEME_KEY, event.matches ? 'dark' : 'light')
        cb?.(event.matches)
    }
    function start() {
        if (isSupport) {
            mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            if ('addEventListener' in mediaQuery)
                mediaQuery.addEventListener('change', handler)
            else
                // @ts-expect-error deprecated API
                mediaQuery.addListener(handler)
            storage.set(THEME_KEY, mediaQuery.matches ? 'dark' : 'light')
        }
    }

    function stop() {
        if (!isSupport)
            return
        if ('removeEventListener' in mediaQuery)
            mediaQuery.removeEventListener('change', handler)
        else
            // @ts-expect-error deprecated API
            mediaQuery.removeListener(handler)
    }

    return { start, stop }
}


export function getTheme() {
    return storage.get(THEME_KEY) as ThemeType
}


export function useTheme(cb: (isDark: boolean) => void){
    
}
