import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import * as Tooltip from '@radix-ui/react-tooltip'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Tooltip.Provider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Tooltip.Provider>
    </BrowserRouter>
  </StrictMode>,
)
