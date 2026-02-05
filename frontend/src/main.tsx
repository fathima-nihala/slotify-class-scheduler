import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import * as Tooltip from '@radix-ui/react-tooltip'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Tooltip.Provider>
        <Provider store={store}>
          <App />
        </Provider>
      </Tooltip.Provider>
    </BrowserRouter>
  </StrictMode>,
)
