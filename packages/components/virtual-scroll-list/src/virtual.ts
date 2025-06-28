import { RangeOptions, updateType, VirtualOptions } from './virtualScrollList'

export function initVirtual(param: VirtualOptions, update: updateType) {
  const range: RangeOptions = { start: 0, end: 0, padFront: 0, padBehind: 0 }

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
  function getPadFront() {
    return param.estimateSize * range.start
  }
  function getPadBehind() {
    const lastIndex = param.uniqueIds.length - 1
    return (lastIndex - range.end) * param.estimateSize
  }
  // 从0 -> 最后一项
  checkRange(0, param.keeps - 1)
  return {}
}
