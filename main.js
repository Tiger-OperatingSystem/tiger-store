const electron = require('electron');
const fs = require('fs');
const spawner = require("child_process").spawn;
const path = require('path');
const url = require('url');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let win;

let btn_title = "";

let script = `

document.getElementById("search-box").placeholder="Pesquisar apps";

// Menu Heaven (3 pontos verticais)
if (document.getElementsByClassName("mat-menu-trigger")[0]) {
  document.getElementsByClassName("mat-menu-trigger")[0].remove();
}

// Rodapé
if (document.getElementsByTagName("store-footer")[0]) {
  document.getElementsByTagName("store-footer")[0].remove()
}

// Botões Públicar, Fórum, Sobre
if (document.getElementsByClassName("toolbar-nav")[0]) {
  document.getElementsByClassName("toolbar-nav")[0].remove()
}

// Cabeçalho (página de início)
if (document.getElementsByTagName("header")[0]) {
  document.getElementsByTagName("header")[0].remove()
}

// Quick setup
if (document.getElementsByClassName("app-details-main-installhint")[0]) {
  document.getElementsByClassName("app-details-main-installhint")[0].remove()
}

// Instalação via terminal
if (document.getElementsByTagName("store-app-details-install-instructions")[0]) {
  document.getElementsByTagName("store-app-details-install-instructions")[0].remove()
}

// Botões de ação

for (let element of document.getElementsByClassName("mat-button-wrapper")) {
  if (element.innerText == "INSTALL") {
      element.innerHTML=btn_title;
  }
  if (element.innerText == "See more") {
      element.innerHTML="Ver mais"
  }
}

// Traduções

`

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.setMenuBarVisibility(false);
  win.loadURL(url.format({pathname: path.join('flathub.org'),protocol: 'https:',slashes: true}));
  win.maximize();

  win.on("page-title-updated", function(event) {
    let package = win.webContents.getURL().replace("https://flathub.org/apps/details/","");
    console.log(package);

    if (fs.existsSync("/var/lib/flatpak/app/"+package+"/current/active/files/manifest.json")) {
      btn_title = "Remover";
    } else {
      btn_title = "Instalar";
    }

    win.webContents.executeJavaScript("btn_title = \""+btn_title+"\""+script); 
  });

  // O usuário clicou para instalar ou remover o app
  win.webContents.session.on('will-download', (e, item) => {
    let package = win.webContents.getURL().replace("https://flathub.org/apps/details/","");
    let package_name = win.webContents.getTitle().replace("—Linux Apps on Flathub","");
    item.cancel(); // Cancela o download, passe para o interceptador

    if (fs.existsSync("/var/lib/flatpak/app/"+package+"/current/active/files/manifest.json")) {
      spawner("flatpak-remove", [package])
    } else {
      spawner("flatpak-install", [package])
    }
  });
}

app.on('ready', createWindow)
