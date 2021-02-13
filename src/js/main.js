const $ = require('jquery');
const electron = require('electron');
const { remote, shell } = electron;
const path = require('path');
const fs = require('fs-extra')
const archiver = require('archiver');
const extract = require('extract-zip')
const tar = require('tar-fs')
const unrar = require("node-unrar-js");
const FileManager = require(path.join(__dirname, '/js/FileManager.js'));
const os = require('os');
var current = "mount"
let currentPack = "{SELECTED}";
const minecraft_folder = os.type == "Linux" ? path.join(remote.app.getPath('userData'), "..", "..", ".minecraft")
  : path.join(remote.app.getPath('userData'), "..", ".minecraft");

$(() => {
  if (!fs.existsSync(path.join(os.tmpdir(), "mcpc"))) fs.mkdirSync(path.join(os.tmpdir(), "mcpc"));
  update();
  var versions_folder = path.join(minecraft_folder, "resourcepacks")
  mountVersions(versions_folder)
  reloadSkinTexture("https://www.minecraftskins.com/uploads/skins/2020/09/13/low-effort-dream-15272065.png?v256")
  setupCurrentPack();
})

function setupCurrentPack() {
  document.querySelectorAll(".select-box__value").forEach((e, k) => {
    e.children[0].addEventListener("change", (c) => {
      if (c.target.checked) {
        CHANGED(e.children[1].innerHTML)
        currentPack = e.children[1].innerHTML
      };
    })
    if (e.children[0].checked) {
      CHANGED(e.children[1].innerHTML)
      currentPack = e.children[1].innerHTML;
    }
  })

  function CHANGED(toChange) {
    document.querySelectorAll(".profile-main").forEach((e) => {
      e.innerHTML = e.innerHTML.replace(currentPack, toChange);
    })
  }
}

function mountVersions(folderpath) {
  const files = fs.readdirSync(folderpath);
  files.forEach((f, key) => {
    var input = ` <div class="select-box__value">
        <input class="select-box__input" type="radio" id="${key}" value="${key}"  name="Ben" checked="checked" />
        <p class="select-box__input-text">${f}</p>
      </div>`

    var li = `<li>
      <label class="select-box__option" for="${key}"  aria-hidden="aria-hidden">${f}</label>
    </li>`

    $(input).appendTo(".select-box__current")

    $(li).appendTo(".select-box__list");
  })
}

function update() {
  current = "home";
  updateMount();
  /*if (datafile.data.account.accessToken === "") {
    current = "signin";
  } else {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    if (datafile.data.account.accessToken === "invited") {
      current = "account"
      document.getElementsByClassName("background")[0].setAttribute("state", current)
      document.getElementById("account-username").innerText = datafile.data.account.username
      document.getElementById("pixel-username").innerHTML = "<span>Username:</span> " + datafile.data.account.username
      document.getElementById("pixel-email").innerHTML = "<span>Email:</span> Invited account"
      var date = datafile.data.account.from;
      var mDate = new Date(date)
      document.getElementById("pixel-from").innerHTML = "<span>Sign in from:</span> " + months[mDate.getMonth()] + " " + mDate.getDay() + ", " + mDate.getFullYear() + " - " + (mDate.getHours().toFixed().length == 1 ? "0" + mDate.getHours() : mDate.getHours()) + ":" + (mDate.getMinutes().toFixed().length == 1 ? "0" + mDate.getMinutes() : mDate.getMinutes())
      updateMount();
    } else {
      authenticate(datafile.data.account.accessToken).then((account) => {
        current = "home"
        document.getElementsByClassName("background")[0].setAttribute("state", current)
        document.getElementById("account-username").innerText = datafile.data.account.username
        document.getElementById("pixel-username").innerHTML = "<span>Username:</span> " + datafile.data.account.username
        document.getElementById("pixel-email").innerHTML = "<span>Email:</span> " + datafile.data.account.email
        var date = datafile.data.account.from;
        var mDate = new Date(date)
        document.getElementById("pixel-from").innerHTML = "<span>Sign in from:</span> " + months[mDate.getMonth()] + " " + mDate.getDay() + ", " + mDate.getFullYear() + " - " + (mDate.getHours().toFixed().length == 1 ? "0" + mDate.getHours() : mDate.getHours()) + ":" + (mDate.getMinutes().toFixed().length == 1 ? "0" + mDate.getMinutes() : mDate.getMinutes())
        updateMount();

      }, (json) => {
        current = "signin";
        updateMount();
      })
    }
  }*/

}

function updateMount() {
  updateNavbar();
  changeView(current, "mount")
  document.getElementsByClassName("upper")[0].removeAttribute("style")
  updateNavbar();
}

function updateNavbar() {
  Array.from($(".navbar").children()).forEach(e => {
    e.classList.remove("in")
    if (e.getAttribute("to") === current) {
      e.classList.add("in")
    }
    e.addEventListener("click", (b) => {
      Array.from($(".navbar").children()).forEach(s => { s.classList.remove("in") })
      b.target.classList.add("in")
      current = b.target.getAttribute("to")
      changeView(b.target.getAttribute("to"), "app")

    })
  })
}

function changeView(view) {
  Array.from(document.getElementById('app').children).forEach(e => {
    e.classList.add('invisible')
  })
  document.getElementById(view).classList.remove('invisible');
  document.getElementsByClassName("background")[0].setAttribute("state", view)
  current = view;
  updateNavbar();
}
document.getElementById('close').addEventListener('click', () => {
  var win = remote.getCurrentWindow();
  win.close();
})

document.getElementById('minimize').addEventListener('click', () => {
  var win = remote.getCurrentWindow();
  win.minimize();
})


var converterState;

loadButtonsDownload();

function loadButtonsDownload() {
  converterState = document.getElementById("converterState").getAttribute("state");
  document.querySelectorAll(".profile-stat-off").forEach(a => {
    if (converterState.split("-")[0] != "idle") {
      a.children[0].addEventListener("click", (e) => {
        document.getElementById("converterState").setAttribute("state", "idle-" + e.target.getAttribute("version"));
        loadButtonsDownload();
      })
    } else {
      if (a.children[0].getAttribute("version") == converterState.split("-")[1]) {
        var el = `<div class="profile-download">
        <div id="down" class="profile-cr-download"><div></div></div>
        <span>Preparing convertion</span>
        </div>
        <a id="stop" class="far fa-stop-circle"></a>`
        var element = document.createElement("div");
        element.innerHTML = el;
        a.parentElement.appendChild(element.firstChild)
        a.parentElement.appendChild(element.lastChild)
        a.style.display = 'none'
        createTemp()
      } else {
        a.children[0].disabled = true;
      }
    }
  })

}

function createTemp() {
  return new Promise(async (resolve, reject) => {
    var ext = fileExtension(currentPack)[0];
    var packPath = path.join(minecraft_folder, "resourcepacks", currentPack);
    var converterMC = new Converter(path.join(os.tmpdir(), "mcpc", currentPack), converterState.split("-")[1])
    switch (ext) {
      case "zip":
        console.log("ZIPER");
        break;
      case "tar": break;
      case "rar":
        break;
      default:
        document.getElementById("down").nextElementSibling.innerHTML = "Sending to temp...";
        await copyFolderRecursiveSync(path.join(minecraft_folder, "resourcepacks", currentPack), path.join(os.tmpdir(), "mcpc"));
        document.getElementById("down").nextElementSibling.innerHTML = "Successfully copy";
        document.getElementById("down").nextElementSibling.innerHTML = "Parsing strings";
        converterMC.getEditedList();
        break;
    }
  })
}

document.getElementById("open-pack").addEventListener("click", () => {
  shell.openPath(path.join(minecraft_folder, "resourcepacks", currentPack))
})


function fileExtension(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : ["folder"];
}