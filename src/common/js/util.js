// 把数组随机打乱
export function shuffle(arr) {
  // 传递数组的副本,保证不改变原数组
  let _arr = arr.slice()
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 节流函数
export function debounce(func, delay) {
  let timer
  // 每次返回一个新的函数,如果在delay时间内再次调用,则清空之前的定时器,设置一个新的定时器
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
