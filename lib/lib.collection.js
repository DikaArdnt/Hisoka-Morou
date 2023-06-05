export default class Collection extends Map {
    find(fn = (value, key, collection) => {}, thisArgs) {
        if (typeof thisArgs !== "undefined") fn = fn.bind(thisArgs)
        for (const [key, val] of this) {
            if (fn(val, key, this)) return val
        }
    }

    findKey(fn = (value, key, collection) => {}, thisArgs) {
        if (typeof thisArgs !== "undefined") fn = fn.bind(thisArgs)
        for (const [key, val] of this) {
            if (fn(val, key, this)) return key
        }
    }

    sort(compareFunction = this.defaultSort) {
        const entries = [...this.entries()]
        entries.sort((a, b) => compareFunction(a[0], b[0]))
        super.clear()
        for (const [key, value] of entries) super.set(key, value)
        return this
    }

    map(fn = (value, key, collection) => {}, thisArgs) {
        const iter = this.entries()
        return Array.from({ length: this.size }, () => {
            const [key, value] = iter.next().value
            return fn(value, key, this)
        })
    }

    defaultSort(firstKey, secondKey) {
        return Number(firstKey > secondKey) || Number(firstKey === secondKey) - 1
    }
}