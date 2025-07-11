import { RangeOptions, updateType, VirtualOptions } from './virtualScrollList'
const enum CALC_TYPE {
  INIT = 'INIT',
  FIXED = 'FIXED',
  DYNAMIC = 'DYNAMIC'
}
export function initVirtual(param: VirtualOptions, update: updateType) {
  const range: RangeOptions = { start: 0, end: 0, padFront: 0, padBehind: 0 }
  const sizeMap = new Map<string | number, number>()
  let recordOffsetValue = 0
  let fixedSizeVal = 0
  let firstRangeAvg = 0
  let caclType = CALC_TYPE.INIT

  function isFixed() {
    return caclType === CALC_TYPE.FIXED
  }

  function getEstimateSize() {
    // 优化平均值
    return isFixed() ? fixedSizeVal : firstRangeAvg || param.estimateSize
  }

  function updateRange(start: number, end: number) {
    range.start = start
    range.end = end
    range.padFront = getPadFront()
    range.padBehind = getPadBehind()
    update({
      ...range
    })
  }
  function checkRange(start: number, end: number) {
    const total = param.uniqueIds.length
    const keeps = param.keeps
    // 一些边界情况
    if (total < keeps) {
      start = 0
      end = total - 1
    } else if (end - start < keeps - 1) {
      // ? 最后滑动到90-100， 90-100之间只有10个，但是要显示30，71-100
      start = end - keeps + 1
    }
    updateRange(start, end)
  }

  // 根据滚动后的元素计算偏移量
  function getIndexOffset(idx: number) {
    if (!idx) return 0
    let offset = 0
    for (let i = 0; i < idx; i++) {
      let indexSize = sizeMap.get(param.uniqueIds[i])
      offset += typeof indexSize === 'number' ? indexSize : getEstimateSize()
    }
    return offset
  }
  function getScrollOvers() {
    if (isFixed()) {
      return Math.floor(recordOffsetValue / getEstimateSize())
    } else {
      // 在整个列表里查找最接近滚动的那一项，计算每一项的偏移量看与哪一项最接近
      let low = 0
      let high = param.uniqueIds.length
      let middle = 0
      let middleOffset = 0
      while (low <= high) {
        middle = Math.floor((low + high) / 2)
        middleOffset = getIndexOffset(middle)
        if (middleOffset === recordOffsetValue) {
          return middle
        } else if (middleOffset < recordOffsetValue) {
          low = middle + 1
        } else if (middleOffset > recordOffsetValue) {
          high = middle - 1
        }
      }
      return low > 0 ? --low : 0
    }
  }
  function getPadFront() {
    if (isFixed()) {
      return getEstimateSize() * range.start
    } else {
      // 讲滚动后的高度相加, 计算上padding
      return getIndexOffset(range.start)
    }
  }
  function getPadBehind() {
    const lastIndex = param.uniqueIds.length - 1
    return (lastIndex - range.end) * getEstimateSize()
  }

  // 根据开始位置来更新结束位置
  function getEndByStart(start: number) {
    const computeEnd = start + param.keeps - 1
    return Math.min(computeEnd, param.uniqueIds.length - 1)
  }

  function handleFront() {
    const overs = getScrollOvers()
    if (overs > range.start) {
      return
    }
    const start = Math.max(0, overs - param.buffer)
    checkRange(start, getEndByStart(start))
  }

  function handleBehind() {
    const overs = getScrollOvers()
    if (overs < range.start + param.buffer) {
      return
    }
    // 超过缓存区, 获取新的范围，start更新为划过的位置
    checkRange(overs, getEndByStart(overs))
  }

  function handleScroll(offset: number) {
    const direction = offset < recordOffsetValue ? 'FRONT' : 'BEHIND'
    recordOffsetValue = offset
    if (direction === 'FRONT') {
      handleFront()
    } else if (direction === 'BEHIND') {
      handleBehind()
    }
  }

  function saveSize(key: number | string, size: number) {
    sizeMap.set(key, size)
    if (caclType === CALC_TYPE.INIT) {
      // 第一个元素加载完毕后默认认为是固定高度
      fixedSizeVal = size
      caclType = CALC_TYPE.FIXED
    } else if (caclType === CALC_TYPE.FIXED && fixedSizeVal !== size) {
      caclType = CALC_TYPE.DYNAMIC
      fixedSizeVal = 0 // 默认采用estimateSize
    }
    if (caclType === CALC_TYPE.DYNAMIC) {
      if (sizeMap.size < Math.min(param.uniqueIds.length, param.keeps)) {
        firstRangeAvg = Math.round(
          sizeMap.values().reduce((a, b) => a + b, 0) / sizeMap.size
        )
      }
    }
  }
  // 从0 -> 最后一项
  checkRange(0, param.keeps - 1)
  return {
    handleScroll,
    saveSize
  }
}
