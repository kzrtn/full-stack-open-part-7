import { createRoot } from 'react-dom/client'
import { AnecdoteContextProvider } from './hooks/index.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <AnecdoteContextProvider>
    <App />
  </AnecdoteContextProvider>
)
