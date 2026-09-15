import Modal from './Modal.jsx'

const toEmbedUrl = (url) => {
  if (!url) return null
  try {
    const u = new URL(url)

    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      if (u.pathname.startsWith('/embed/')) return url
      if (u.pathname.startsWith('/shorts/')) {
        return `https://www.youtube.com/embed/${u.pathname.split('/')[2]}`
      }
    }

    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }

    return null
  } catch {
    return null
  }
}

export default function VideoModal({ open, url, title, onClose }) {
  const embed = toEmbedUrl(url)

  return (
    <Modal open={open} title={title || 'Vídeo'} onClose={onClose}>
      {embed ? (
        <div className="video-embed">
          <iframe
            src={embed}
            title={title || 'Vídeo'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : url ? (
        <p className="video-fallback">
          <a href={url} target="_blank" rel="noreferrer">
            Abrir el vídeo en una pestaña nueva
          </a>
        </p>
      ) : (
        <p className="video-fallback">Este ejercicio no tiene vídeo.</p>
      )}
    </Modal>
  )
}