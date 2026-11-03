/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Firebase SDK 묶음(약 540KB)은 Firebase 모드에서만 내려받으므로 경고 기준을 조금 올림
    chunkSizeWarningLimit: 600,
  },
  test: {
    // localStorage가 필요한 데모 저장소 테스트를 위해 브라우저 흉내 환경 사용
    environment: 'jsdom',
  },
});
