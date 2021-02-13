class Converter {

  constructor(folder, portTo) {
    this.folder = folder;
    this.portTo = portTo;
  }

  setMCMeta(mcmeta) {
    this.mcmeta = fs.readJsonSync(path.join(folder, "pack.mcmeta"));
  }

  getVersion() {
    return packFormats[this.mcmeta.pack.pack_format];
  }

  getFullyList() {
    return fileReader;
  }

  getEditedList() {
    console.log(path.join(minecraft_folder, "resourcepacks", currentPack));
    var JSONParsed = JSON.stringify(fileReader).replaceAll("\\\\", "/").replaceAll(path.join(minecraft_folder, "resourcepacks", currentPack).replaceAll("\\", "/")+"/assets/minecraft/", "")
    let versionEdited = JSON.parse(JSONParsed);
    delete versionEdited[path.join(minecraft_folder, "resourcepacks", currentPack).replaceAll("\\", "/")+"/assets/minecraft"]
    delete versionEdited[path.join(minecraft_folder, "resourcepacks", currentPack).replaceAll("\\", "/")+"/assets"]
    console.log(versionEdited);
  }


}

module.exports = Converter;