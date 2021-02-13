module.exports = {
  packagerConfig: {
    "name": "MinecraftPackConverter"
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: "Emir Ali",
        name: "MinecraftPackConverter",
        version: "1.0.0"
      }
    }
  ]
}