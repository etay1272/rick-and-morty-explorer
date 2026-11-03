export function parseCharacterId(rawId: string | undefined): number | null {
  if (!rawId || !/^[1-9]\d*$/.test(rawId)) {
    return null
  }

  const id = Number(rawId)
  return Number.isSafeInteger(id) ? id : null
}
