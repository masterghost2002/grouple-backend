import NodeCache from "node-cache";
export default class Cache{
    static instance:Cache;
    public cache:NodeCache;
    constructor(){
        this.cache = new NodeCache();
    }
    static getCache(){
        if(!Cache.instance)
            Cache.instance = new Cache();
        return Cache.instance;
    }
}