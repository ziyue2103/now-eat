export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 带权重的随机选择（Fisher-Yates 思想，直接随机取一个）
 */
export function randomPick<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 生成老虎机滚动展示用的随机序列
 * 用于制造「滚动」视觉效果
 */
export function generateSlotSequence<T>(arr: T[], length: number): T[] {
  const result: T[] = [];
  for (let i = 0; i < length; i++) {
    result.push(randomItem(arr));
  }
  return result;
}
