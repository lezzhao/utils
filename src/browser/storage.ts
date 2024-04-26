
type StorageType = 'local' | 'session'

export class SimpleStorage {
    private storage: Storage = localStorage
    private type: StorageType

    constructor(type: StorageType = 'local') {
        this.type = type
        this.setStorage(type)
    }

    private setStorage(type: StorageType) {
        this.storage = type === 'local' ? localStorage : sessionStorage
    }

    /**
     * get the current storage type
     * @param key StorageType
     */
    cur() {
        return this.type
    }
    
    /**
     * toggle the current storage type
     * @param key StorageType
     */
    toggle(type?: StorageType) {
        const _type = type || this.type === 'local' ? 'session' : 'local'
        this.type = _type
        this.setStorage(_type)
        return this
    }
    /**
     * get the value of the specified key in the current storage
     * @param key StorageType
     */
    get(key: string){
        const value = this.storage.getItem(key)
        return value ? JSON.parse(value) : value
    }
    /**
     * set the value of the specified key to the current storage
     * @param key StorageType
     */
    set(key: string, value: unknown) {
        this.storage.setItem(key, JSON.stringify(value))
    }
    /**
     * remove the specified key belonged current storage
     * @param key StorageType
     */
    remove(key: string) {
        this.storage.removeItem(key)
    }
    /**
     * clear the keys of current storage
     */
    clear() {
        this.storage.clear()
    }
}


export const storage = new SimpleStorage()