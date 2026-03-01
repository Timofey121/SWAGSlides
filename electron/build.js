const builder = require("electron-builder")
const fs = require("fs")
const path = require("path")

// AfterPack hook: set executable permissions on macOS; no-op on Windows
const afterPack = async (context) => {
  if (context.electronPlatformName === "darwin") {
    const appPath = context.appOutDir
    const fastapiPath = path.join(appPath, "SWAGSlides.app/Contents/Resources/app/resources/fastapi/fastapi")

    console.log("Setting executable permissions for FastAPI binary...")
    console.log("FastAPI path:", fastapiPath)

    if (fs.existsSync(fastapiPath)) {
      fs.chmodSync(fastapiPath, 0o755)
      console.log("✓ Execute permissions set for FastAPI")
    } else {
      console.warn("⚠ FastAPI binary not found at:", fastapiPath)
    }

    const fastapiDir = path.join(appPath, "SWAGSlides.app/Contents/Resources/app/resources/fastapi")
    if (fs.existsSync(fastapiDir)) {
      console.log("FastAPI directory contents:", fs.readdirSync(fastapiDir))
    }
  }
}

const config = {
  appId: "SWAGSlidesAI.SWAGSlides",
  asar: false,
  copyright: "Copyright © 2026 SWAGSlides",
  directories: {
    output: "dist",
    buildResources: "build",
  },
  files: [
    "resources",
    "app_dist",
    "node_modules",
    "NOTICE"
  ],
  afterPack,
  mac: {
    artifactName: "SWAGSlides-${version}.${ext}",
    target: ["dmg"],
    category: "public.app-category.productivity",
    icon: "resources/ui/assets/images/SWAGSlides_short_filled.png",
  },
  linux: {
    artifactName: "SWAGSlides-${version}.${ext}",
    target: ["AppImage"],
    icon: "resources/ui/assets/images/SWAGSlides_short_filled.png",
  },
  win: {
    target: ["nsis", "appx"],
    icon: "build/icon.ico",
    artifactName: "SWAGSlides-${version}.${ext}",
    executableName: "SWAGSlides",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    allowElevation: true,
    installerIcon: "build/icon.ico",
    uninstallerIcon: "build/icon.ico",
    installerHeaderIcon: "build/icon.ico",
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "SWAGSlides",
    uninstallDisplayName: "SWAGSlides",
  },
  appx: {
    identityName: "SWAGSlidesAI.SWAGSlides",
    publisher: "CN=8A2C57B5-F1C6-473A-93EE-2E9B72134341",
    publisherDisplayName: "SWAGSlides AI",
    applicationId: "SWAGSlidesAI.SWAGSlides",
  },
}

builder.build({ config })