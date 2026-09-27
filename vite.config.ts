import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'
import fs from 'fs'
import path from 'path'

// Copy uploaded logo assets to public directory
try {
  const uploadDir = 'C:/Users/rahul/.gemini/antigravity-ide/brain/f02f1644-7659-4823-8dce-ee2b9f289228/.user_uploaded';
  const publicDir = fileURLToPath(new URL('./public', import.meta.url));
  fs.copyFileSync(path.join(uploadDir, 'media_1790489144104.png'), path.join(publicDir, 'logo-full.png'));
  fs.copyFileSync(path.join(uploadDir, 'media_1790489150262.png'), path.join(publicDir, 'logo-symbol.png'));
} catch (e) {
  console.warn('Failed to copy logo assets', e);
}

export default defineConfig({
  base: '/PrepDrift/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    fs: {
      allow: [
        '.',
        'C:/Users/rahul/.gemini/antigravity-ide/brain/f02f1644-7659-4823-8dce-ee2b9f289228/.user_uploaded'
      ]
    }
  }
})
