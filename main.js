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

// Botões Publicar, Fórum, Sobre
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

for (let element of document.getElementsByTagName("h3")) {
  switch (element.innerText) {
    case "DISCOVER":
      element.innerText = "Recomendados"
    break;
    case "CATEGORIES":
      element.innerText = "Categorias"
    break;
  }
}

for (let element of document.getElementsByTagName("a")) {
  switch (element.innerText) {
    case "Editor's Choice":
      element.innerText = "Recomendados"
    break;
    case "Recently Updated":
      element.innerText = "Atualizados recentemente"
    break;
    case "New Apps":
      element.innerText = "Novos apps"
    break;
    case "Popular":
      element.innerText = "Populares"
    break;
    case "All":
      element.parentElement.remove()
    break;
    case "Audio & Video":
      element.innerText = "Audiovisual"
    break;
    case "Developer Tools":
      element.innerText = "Desenvolvimento"
    break;
    case "Education":
      element.innerText = "Educação"
    break;
    case "Graphics & Photography":
      element.innerText = "Desenhos e fotografias"
    break;
    case "Communication & News":
      element.innerText = "Internet"
    break;
    case "Productivity":
      element.innerText = "Office e Produtividade"
    break;
    case "Science":
      element.innerText = "Produção científica"
    break;
    case "System":
      element.innerText = "Ferramentas de ajuste"
    break;
    case "Utilities":
      element.innerText = "Acessórios e outros"
    break;
    case "Games":
      element.parentElement.remove()
    break;
  }
}

for (let element of document.getElementsByTagName("h2")) {
  switch (document.title.replace("—Linux Apps on Flathub","")) {
    case "Editor's Choice Apps":
      element.innerText = "Recomendados"
    break;
    case "Recently Updated Apps":
      element.innerText = "Atualizados recentemente"
    break;
    case "New Apps":
      element.innerText = "Novos apps"
    break;
    case "Popular Apps":
      element.innerText = "Populares"
    break;
    case "All applications":
      element.innerText = "Todos"
    break;
    case "Audio & Video":
      element.innerText = "Audiovisual"
    break;
    case "Developer Tools":
      element.innerText = "Desenvolvimento"
    break;
    case "Education":
      element.innerText = "Educação"
    break;
    case "Graphics & Photography":
      element.innerText = "Desenhos e fotografias"
    break;
    case "Communication & News":
      element.innerText = "Internet"
    break;
    case "Productivity":
      element.innerText = "Office e Produtividade"
    break;
    case "Science":
      element.innerText = "Produção científica"
    break;
    case "System":
      element.innerText = "Ferramentas de ajuste"
    break;
    case "Utilities":
      element.innerText = "Acessórios e outros"
    break;
    case "Games":
      element.parentElement.remove()
    break;
  }
}

`

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.setMenuBarVisibility(false);
  win.loadURL(url.format({pathname: path.join('flathub.org/apps/collection/popular'),protocol: 'https:',slashes: true}));
  win.maximize();
  win.title="Tiger Store - Flathub"
  win.icon="/usr/lib/tiger-os/tiger-store/resources/tiger-store-window-icon.png"

  win.on("page-title-updated", function(event) {
    let package = win.webContents.getURL().replace("https://flathub.org/apps/details/","");
    console.log(package);

    if (fs.existsSync("/var/lib/flatpak/app/"+package+"/current/active/files/manifest.json")) {
      btn_title = "Remover";
    } else {
      btn_title = "Instalar";
    }
    
    if (fs.existsSync("/usr/lib/tiger-os/tiger-store/resources/index.html")) {
      if (win.webContents.getURL()=="https://flathub.org/home"){
        win.loadURL("/usr/lib/tiger-os/tiger-store/resources/index.html");
      }
    } else {
      if (win.webContents.getURL()=="https://flathub.org/home"){
        win.loadURL("https://flathub.org/apps/collection/popular");
      }
    }

    win.webContents.executeJavaScript("btn_title = \""+btn_title+"\""+script); 
    event.preventDefault();
  });

  win.on("ready-to-show", function(event) {
    let package = win.webContents.getURL().replace("https://flathub.org/apps/details/","");
    console.log(package);

    if (fs.existsSync("/var/lib/flatpak/app/"+package+"/current/active/files/manifest.json")) {
      btn_title = "Remover";
    } else {
      btn_title = "Instalar";
    }

    if (fs.existsSync("/var/lib/flatpak/app/"+package+"/current/active/files/manifest.json")) {
      btn_title = "Remover";
    } else {
      btn_title = "Instalar";
    }

    if (fs.existsSync("/usr/lib/tiger-os/tiger-store/resources/index.html")) {
      if (win.webContents.getURL()=="https://flathub.org/home"){
        win.loadURL("/usr/lib/tiger-os/tiger-store/resources/index.html");
      }
    } else {
      if (win.webContents.getURL()=="https://flathub.org/home"){
        win.loadURL("https://flathub.org/apps/collection/popular");
      }
    }
    
    win.webContents.executeJavaScript("btn_title = \""+btn_title+"\""+script); 
  });

  // O usuário clicou para instalar ou remover o app
  win.webContents.session.on('will-download', (e, item) => {
    let package = win.webContents.getURL().replace("https://flathub.org/apps/details/","");
    let package_name = win.webContents.getTitle().replace("—Linux Apps on Flathub","");
    item.cancel(); // Cancela o download, passe para o interceptador

    if (fs.existsSync("/var/lib/flatpak/app/"+package+"/current/active/files/manifest.json")) {
      spawner("flatpak-install-gui", ["--override-appname="+package_name,"--remove",package])
    } else {
      spawner("flatpak-install-gui", ["--override-appname="+package_name,package])
    }
  });
}

app.on('ready', createWindow)
