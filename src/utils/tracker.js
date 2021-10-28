export function log (cls, data = {}) {
    if (!window.__qd__) return

    try {
        window.__qd__.click({
            cls,
            v: data
        })
    } catch (e) {
        console.log(e)
    }
}

export function imp (cls, data = {}) {
    if (!window.__qd__) return

    try {
        window.__qd__.imp({
            cls,
            v: data
        })
    } catch (e) {
        console.log(e)
    }
}

export function page (data = {}) {
    if (!window.__qd__) return

    try {
        window.__qd__.page(data)
    } catch (e) {
        console.log(e)
    }
}
