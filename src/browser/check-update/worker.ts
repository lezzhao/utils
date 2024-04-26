
/**
 * check current website whether has new version
 * @param options 
 */
export const checkUpdate = (options?: {
    interval?: number,
    content?: string,
    cb?: () => void
}) => {
    const { content = 'A new version is available, whether to refresh the page?', cb, interval } = options || {};
    const worker = new Worker(new URL('./check.ts', import.meta.url), { type: 'module' });
    // Notification to enable the version check
    worker.postMessage({ url: location.href, interval });
    worker.onmessage = (event) => {
        if (event.data === 'update') {
            if (cb && typeof cb === 'function') {
                cb()
            } else {
                const res = confirm(content)
                res && location.reload()
            }
        }
        console.log('check update', event.data);
        
    }
}