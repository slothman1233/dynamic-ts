export function getCacheCheckTime(key: string, expires:number = 30 * 60 * 1000) {
  let res = localStorage.getItem(key)
  if (!res) return null
  const cache = res.split('__time__')
  const time = +cache[1]
  if (new Date().getTime() - time >= expires) {
    // 缓存30m过期
    res = null
    localStorage.removeItem(key)
  } else {
    res = JSON.parse(cache[0])
  }
  return res
}
export function setCacheAddTime(key: string, val: any) {
  if (val) {
    localStorage.setItem(
      key,
      `${JSON.stringify(val)}__time__${new Date().getTime()}`
    )
  } else {
    localStorage.removeItem(key)
  }
}