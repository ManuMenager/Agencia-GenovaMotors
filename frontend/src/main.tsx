import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { SiteDataProvider } from '@/context/SiteDataContext'
import { router } from '@/routes/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteDataProvider>
      <RouterProvider router={router} />
    </SiteDataProvider>
  </StrictMode>,
)
