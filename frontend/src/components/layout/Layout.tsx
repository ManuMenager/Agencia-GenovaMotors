import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Cada página decide qué mostrar mientras llegan los datos (ver DataGate), así el inicio no espera a la API. */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
