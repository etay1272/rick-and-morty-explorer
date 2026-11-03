export function formatEpisodeCode(code: string): string {
  const match = /^S(\d{1,2})E(\d{1,2})$/i.exec(code.trim())

  if (!match) {
    return code
  }

  const season = Number(match[1])
  const episode = Number(match[2])
  return `S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`
}
