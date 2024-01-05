// 通过 contextBridge将应用中的 Chrome、Node、Electron 版本号暴露至渲染器
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});
