// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron')
const path = require('path')
const childProcess = require('child_process')

const handleSetTitle = (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)

  const cmd = 'ls'
  childProcess.exec('cmd', (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误： ${error}`)
      return
    }

    console.log(`输出： ${stdout}`)
    console.error(`错误输出： ${stderr}`)
  })
}

const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 750,
    height: 600,
    // alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  // 加载 index.html
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // 打开开发工具
  // mainWindow .webContents.toggleDevTools();
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('ping', () => 'pong')
  ipcMain.on('counter-value', (_event, value) => {
    console.log('counter-value', value)
  })
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
