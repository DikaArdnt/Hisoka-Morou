import '../../config.js'

import axios from 'axios'
import formData from 'form-data'


export default class API {
    constructor(name, options) {
        this.name = name
        this.URI = (name in global.APIs) ? global.APIs[name].URI : name

        this.create = axios.create({
            baseURL: this.URI,
            timeout: 0,
            headers: options?.headers ? options.headers : {},
            ...options
        })
    }

    async get(path = '/', query = {}, apikey) {
        const data = await this.create.get(path, {
            params: (query || apikey) ? new URLSearchParams(Object.entries({ ...query, ...(apikey ? { [apikey]: global.APIs[this.name].Key } : {}) })) : ''
        })

        return {
            status: data.status,
            statusText: data.statusText,
            data: data.data
        }
    }

    async post(path = '', data = {}, apikey, options = {}) {
        if (!!data) {
            const form = new FormData()

            for (let key in data) {
                let valueKey = data[key]
                form.append(key, valueKey)
            }
        
            const data = await this.create.post(path + new URLSearchParams(Object.entries({ ...(apikey ? { [apikey]: global.APIs[this.name].Key } : {}) })), form, { ...options })

            return {
                status: data.status,
                statusText: data.statusText,
                data: data.data
            }
        } else {
            throw `No Input Data`
        }
    }
}

reloadFile(import.meta.url)
