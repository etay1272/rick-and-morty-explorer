import { useState } from 'react'

interface CharacterImageProps {
  src: string
  alt: string
  className: string
  loading?: 'eager' | 'lazy'
}

function CharacterImage({ src, alt, className, loading = 'lazy' }: CharacterImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const hasError = failedSrc === src

  if (hasError) {
    return (
      <div
        className={`${className} image-fallback`}
        role={alt ? 'img' : undefined}
        aria-label={alt ? `${alt} image unavailable` : undefined}
        aria-hidden={alt ? undefined : true}
      >
        <span className="image-fallback-symbol" aria-hidden="true">▧</span>
        <span>Image unavailable</span>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailedSrc(src)}
    />
  )
}

export default CharacterImage
