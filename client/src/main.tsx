import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import './i18.ts' // 初始化 i18n
import '@unocss/reset/normalize.css' // unocss reset
import 'virtual:uno.css'; // unocss
import './assets/sass/main.sass' // custom
import App from './App.tsx'
import Loading from './views/layout/Loading'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Loading />
      <App />
    </Provider>
  </StrictMode>
)
