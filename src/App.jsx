import { useMemo, useState } from 'react'
import './App.css'

const TOTAL = 100
const MINIMO = 0
const MAXIMO = 100

const pilares = [
  {
    key: 'confidencialidad',
    titulo: '🔒 Confidencialidad',
    clase: 'tarjeta-confidencialidad',
    descripcion:
      'Protege la privacidad: solo personas autorizadas pueden ver la información.',
    ejemplo:
      'Historia clínica: solo paciente y personal médico autorizado pueden consultarla.',
    impacto:
      'Subirla suele agregar controles (contraseñas, validaciones), lo que puede hacer más lento el acceso.',
  },
  {
    key: 'integridad',
    titulo: '🧾 Integridad',
    clase: 'tarjeta-integridad',
    descripcion:
      'Asegura que los datos sean correctos, completos y no se alteren sin permiso.',
    ejemplo:
      'Nota académica: no debe cambiarse sin una actualización oficial y registrada.',
    impacto:
      'Subirla implica más verificaciones (aprobaciones, revisiones), por eso a veces baja la rapidez de uso.',
  },
  {
    key: 'disponibilidad',
    titulo: '⚡ Disponibilidad',
    clase: 'tarjeta-disponibilidad',
    descripcion:
      'Garantiza que el sistema y la información estén accesibles cuando se necesitan.',
    ejemplo:
      'Banca en línea: debe funcionar justo cuando necesitas pagar una factura.',
    impacto:
      'Subirla pide redundancia y acceso rápido; si se exagera sin control, puede reducir privacidad o controles.',
  },
]

function App() {
  const [niveles, setNiveles] = useState({
    confidencialidad: 34,
    integridad: 33,
    disponibilidad: 33,
  })

  const ajustarPilar = (claveObjetivo, nuevoValor) => {
    setNiveles((anterior) => {
      const objetivo = Math.max(MINIMO, Math.min(MAXIMO, Number(nuevoValor)))
      const otros = Object.keys(anterior).filter((clave) => clave !== claveObjetivo)
      const disponibleParaOtros = TOTAL - objetivo
      const sumaOtros = otros.reduce((total, clave) => total + anterior[clave], 0)

      const actualizado = { ...anterior, [claveObjetivo]: objetivo }
      let asignado = 0

      otros.forEach((clave, indice) => {
        if (indice === otros.length - 1) {
          actualizado[clave] = disponibleParaOtros - asignado
          return
        }

        const proporcional =
          sumaOtros === 0
            ? Math.round(disponibleParaOtros / otros.length)
            : Math.round((anterior[clave] / sumaOtros) * disponibleParaOtros)
        actualizado[clave] = proporcional
        asignado += proporcional
      })

      return actualizado
    })
  }

  const analisis = useMemo(() => {
    const entries = Object.entries(niveles)
    const mayor = entries.reduce((a, b) => (a[1] >= b[1] ? a : b))
    const menor = entries.reduce((a, b) => (a[1] <= b[1] ? a : b))

    const nombres = {
      confidencialidad: 'confidencialidad',
      integridad: 'integridad',
      disponibilidad: 'disponibilidad',
    }

    const ejemplos = {
      confidencialidad:
        'Ejemplo: hospital con doble autenticación para abrir expedientes médicos.',
      integridad:
        'Ejemplo: notas escolares con registro de cambios y aprobación del docente.',
      disponibilidad:
        'Ejemplo: tienda en línea con servidores de respaldo para no caerse en horas pico.',
    }

    return {
      texto: `Ahora priorizas ${nombres[mayor[0]]} (${mayor[1]}%). Esto hace que ${nombres[menor[0]]} quede en ${menor[1]}%, mostrando que mejorar un pilar suele exigir ceder en otro por costo, tiempo o facilidad de uso.`,
      ejemplo: ejemplos[mayor[0]],
    }
  }, [niveles])

  return (
    <main className="infografia">
      <header className="encabezado">
        <p className="etiqueta">Seguridad de la información</p>
        <h1>La tríada CIA explicada para todos</h1>
        <p className="resumen">
          La seguridad digital se basa en tres ideas simples: que la información
          sea privada, correcta y esté disponible cuando la necesitamos. Aquí
          puedes mover los niveles y ver cómo se afectan entre sí.
        </p>
      </header>

      <section className="tarjetas-cia" aria-label="Tríada de la información">
        {pilares.map((pilar) => (
          <article key={pilar.key} className={`tarjeta ${pilar.clase}`}>
            <h2>{pilar.titulo}</h2>
            <p>{pilar.descripcion}</p>
            <p className="ejemplo">
              <strong>Ejemplo:</strong> {pilar.ejemplo}
            </p>
            <p className="impacto">
              <strong>¿Por qué impacta a los otros?</strong> {pilar.impacto}
            </p>
            <label className="control">
              Nivel actual: <strong>{niveles[pilar.key]}%</strong>
              <input
                type="range"
                min={MINIMO}
                max={MAXIMO}
                step="5"
                value={niveles[pilar.key]}
                onChange={(event) => ajustarPilar(pilar.key, event.target.value)}
              />
            </label>
            <div className="barra-fondo" aria-hidden="true">
              <div
                className="barra-valor"
                style={{ width: `${(niveles[pilar.key] / MAXIMO) * 100}%` }}
              />
            </div>
          </article>
        ))}
      </section>

      <section className="balance">
        <h2>¿Qué está pasando cuando subes una barra?</h2>
        <p>{analisis.texto}</p>
        <p className="ejemplo-dinamico">{analisis.ejemplo}</p>
      </section>

      <section className="balance balance-secundario">
        <h2>¿Por qué deben estar las 3 juntas?</h2>
        <p>
          Si una sube demasiado, las demás pueden bajar. Por ejemplo, más filtros
          de acceso mejoran confidencialidad, pero pueden reducir disponibilidad
          porque tardas más en entrar. El objetivo real es encontrar equilibrio
          según la necesidad de cada servicio.
        </p>
      </section>
    </main>
  )
}

export default App
