import { useMemo, useState } from 'react'

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const toKey = (date) => {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const formatTime = (date) =>
  new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

export default function Calendar({ items = [], onDayClick, onDeleteItem, readOnly = false }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const byDay = useMemo(() => {
    const map = {}
    for (const item of items) {
      const key = toKey(item.date)
      if (!map[key]) map[key] = []
      map[key].push(item)
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => new Date(a.date) - new Date(b.date))
    }
    return map
  }, [items])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayKey = toKey(new Date())

  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const goPrev = () => setCursor(new Date(year, month - 1, 1))
  const goNext = () => setCursor(new Date(year, month + 1, 1))
  const goToday = () => {
    const now = new Date()
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
  }

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button className="calendar__nav" type="button" onClick={goPrev} aria-label="Mes anterior">
          ‹
        </button>
        <span className="calendar__title">
          {MONTHS[month]} {year}
        </span>
        <button className="calendar__nav" type="button" onClick={goNext} aria-label="Mes siguiente">
          ›
        </button>
        <button className="calendar__today" type="button" onClick={goToday}>
          Hoy
        </button>
      </div>

      <div className="calendar__weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="calendar__grid">
        {cells.map((dayDate, index) => {
          if (!dayDate) {
            return <div key={`empty-${index}`} className="calendar__cell calendar__cell--empty" />
          }
          const key = toKey(dayDate)
          const dayItems = byDay[key] || []
          const isToday = key === todayKey

          return (
            <div
              key={key}
              className={`calendar__cell${isToday ? ' calendar__cell--today' : ''}${
                !readOnly ? ' calendar__cell--clickable' : ''
              }`}
              onClick={!readOnly ? () => onDayClick?.(dayDate) : undefined}
            >
              <span className="calendar__day">{dayDate.getDate()}</span>
              <div className="calendar__items">
                {dayItems.map((item) => (
                  <div key={item.id} className="calendar__item">
                    <span className="calendar__item-time">{formatTime(item.date)}</span>
                    <span className="calendar__item-title">{item.workout?.title}</span>
                    {!readOnly && onDeleteItem && (
                      <button
                        className="calendar__item-remove"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onDeleteItem(item)
                        }}
                        aria-label="Quitar"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}