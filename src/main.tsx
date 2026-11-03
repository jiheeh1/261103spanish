import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './auth/AuthContext';
import { backend } from './services/firebase';
import './index.css';

// 데모/Firebase 중 어떤 저장소를 쓸지는 services/firebase.ts가 정하고,
// 여기서 앱 전체에 한 번만 넘겨 줍니다. (화면 코드는 구현체를 직접 import하지 않음)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider backend={backend}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
