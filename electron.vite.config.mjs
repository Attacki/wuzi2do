import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        // 确保这里的路径指向你实际的 shared 目录
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      rollupOptions: {
        output: {
          // 强制输出格式为 es
          format: 'es'
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        // 确保这里的路径指向你实际的 shared 目录
        '@': resolve(__dirname, 'src')
      }
    },
    build: {
      rollupOptions: {
        output: {
          format: 'es'
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
