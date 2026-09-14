import Spinner from './Spinner.jsx'

export default function PageLoader({ label = 'Cargando...' }) {
  return (
    <div className="page-loader">
      <Spinner label={label} />
    </div>
  )
}