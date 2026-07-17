import { useState } from 'react'

interface WikiPhotoProps {
  /** Wikimedia Commons filename (without the "File:" prefix). */
  commonsFile: string
  alt: string
  caption: string
}

/** Loads a curated campus/city photo from Wikimedia Commons. */
export function WikiPhoto({ commonsFile, alt, caption }: WikiPhotoProps) {
  const [failed, setFailed] = useState(false)
  const src = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(commonsFile)}?width=640`

  return (
    <figure className="detail-photo">
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="detail-photo-fallback" aria-hidden="true">
          No photo
        </div>
      )}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
