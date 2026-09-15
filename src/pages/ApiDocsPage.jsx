import { useEffect, useState } from 'react'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import { api } from '../lib/apiClient.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import '../styles/apiDocs.scss'

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api
      .get('/api-docs.json')
      .then((data) => {
        if (active) setSpec(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'No se pudo cargar la documentación')
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="api-docs">
      <PageHeader
        title="API Docs"
        subtitle="Documentación interactiva de la API (solo administradores)"
      />

      <Alert variant="error">{error}</Alert>

      {!spec && !error && <Spinner label="Cargando documentación..." />}

      {spec && (
        <div className="api-docs__swagger">
          <SwaggerUI spec={spec} />
        </div>
      )}
    </section>
  )
}
