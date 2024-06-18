export default {
    mounted(el) {
        // 先保存原始的src
        const imgSrc = el.src
        // 把src设置为空
        el.src = ''
        // 观察者
        const observer = new IntersectionObserver(([{ isIntersecting
        }]) => {
            // 元素出现在可视区域 和 离开可视区域触发
            // console.log('触发了', isIntersecting)
            if (isIntersecting) {
                // 加载图片
                el.src = imgSrc
                // 停止观察
                observer.unobserve(el)
            }
        }, {
            threshold: 1
        })
        observer.observe(el)
    }
}