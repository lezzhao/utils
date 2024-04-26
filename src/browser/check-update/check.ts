
let cacheTag: string = ''
let intervalId: number | undefined = undefined

// get the time tag of current website
async function getTimeTag(url: string, cacheFlag = false) {
    const res = await fetch(url, {
        method: 'HEAD',
        cache: cacheFlag ? 'no-cache' : 'default'
    })
    console.log(res.headers.get('etag') || res.headers.get('last-modified') || '');
    
    return res.headers.get('etag') || res.headers.get('last-modified') || ''
}

// check current website version, if it is different from the cache, send a message to the main thread
async function check(url: string) {
    const curTag = await getTimeTag(url)
    if (curTag !== cacheTag) {
        self.postMessage('update')
        clearInterval(intervalId)
    }
}

// check the website url whether is valid
function isValidURL(url: string) {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

self.onmessage = (e) => {
    const { url, interval } = e.data
    if (isValidURL(url)) {
        getTimeTag(url, false).then(tag => {
            cacheTag = tag
            if (interval) {
                intervalId && clearInterval(intervalId)
                intervalId = setInterval(() => {
                    check(url)
                }, interval * 1000)
            } else {
                setTimeout(() => {
                    check(url)
                }, 6 * 1000);
            }
        })
    } else {
        console.log(`work can't work because of invalid url`);
    }
}
