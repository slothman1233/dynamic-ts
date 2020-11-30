/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-08-24 20:26:39
 * @LastEditTime: 2020-11-02 17:32:23
 */
export function getCacheCheckTime(key: string, expires:number = 24 * 60 * 60 * 1000) {
  let res = localStorage.getItem(key)
  if (!res) return null
  const cache = res.split('__time__')
  const time = +cache[1]
  if (new Date().getTime() - time >= expires) {
    // 缓存24小时过期
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