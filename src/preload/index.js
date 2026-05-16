import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  minimize: () => ipcRenderer.send('minimize-app'),
  close: () => ipcRenderer.send('close-app'),
  onWindowSnap: (callback) => ipcRenderer.on('window-snap', (_event, value) => callback(value)),
  onThemeChanged: (callback) => ipcRenderer.on('theme-changed', (_event, value) => callback(value)),
  onLocaleChanged: (callback) => ipcRenderer.on('locale-changed', (_event, value) => callback(value)),
  // 获取初始设置（同步主进程的 electron-store 状态）
  getInitialSettings: () => ipcRenderer.sendSync('get-initial-settings')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
