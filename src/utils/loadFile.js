/**
 * ? 动态创建 script 加载js文件
 * @param {String} jsUrl 
 * @returns 
 */
export const loadJS = jsUrl => new Promise(resolve => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = jsUrl
    script.onload = () => {
        resolve(true)
    }
    document.getElementsByTagName('head')[0].appendChild(script)
})

/**
 * ? 动态创建 link 加载css文件
 * @param {String} jsUrl 
 * @returns 
 */
export const loadCSS = jsUrl => new Promise(resolve => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = jsUrl
    link.onload = () => {
        resolve(true)
    }
    document.getElementsByTagName('head')[0].appendChild(link)
})

/**
 * ? 图片预加载方法
 * @param {Array} arr：图片资源路径数组
 * @returns 
 */
export const preloadImages = arr => {
    const newImages = []
    let loadedImages = 0
    // 此处增加了一个postAction函数
    let postAction = function () {}
    const newArr = typeof arr !== 'object' ? [...arr] : arr
    const imageLoadPost = () => {
        loadedImages++
        if (loadedImages === newArr.length) {
            // 加载完成用我们调用postAction函数并将newImages数组做为参数传递进去
            postAction(newImages)
        }
    }

    for (let i = 0; i < newArr.length; i++) {
        newImages[i] = new Image()
        newImages[i].src = newArr[i]
        newImages[i].onload = () => {
            imageLoadPost()
        }
        newImages[i].onerror = () => {
            imageLoadPost()
        }
    }
    // 此处返回一个空白对象的done方法
    return {
        done (f) {
            postAction = f || postAction
        }
    }
}
