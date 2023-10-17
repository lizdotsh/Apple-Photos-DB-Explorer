module.exports = {
  packagerConfig: {
    ignore: [
        /^\/src/,
        /(.eslintrc.json)|(.gitignore)|(electron.vite.config.ts)|(forge.config.cjs)|(tsconfig.*)/,
        /^\/node_modules\/.vite/,
      ],
    extendInfo: {
      NSPhotoLibraryUsageDescription:
        "This program needs access to your photos library db",
      osxSign: {
        identity: 'liz inerati',
      },
      osxNotarize: false, 
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
    {
      name: "@electron-forge/maker-dmg",
    },
  ],
//   plugins: [
//     {
//       name: '@electron-forge/plugin-vite',
      
    
//     }
    // ],
};
