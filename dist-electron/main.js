import { app as e, BrowserWindow as t } from "electron";
import i from "path";
import * as a from "url";
const l = a.fileURLToPath(import.meta.url), r = i.dirname(l);
function n() {
  const o = new t({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: !0,
      contextIsolation: !1
    }
  });
  process.env.NODE_ENV === "development" ? (o.loadURL("http://localhost:5173"), o.webContents.openDevTools()) : o.loadFile(i.join(r, "../dist/index.html"));
}
e.whenReady().then(() => {
  n(), e.on("activate", function() {
    t.getAllWindows().length === 0 && n();
  });
});
e.on("window-all-closed", function() {
  process.platform !== "darwin" && e.quit();
});
