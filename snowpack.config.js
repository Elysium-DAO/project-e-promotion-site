// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  "mount": {
    "src": {url: "/dist"},
    "public": {url : "/", static:true}
   },
  plugins: [  
    [
      '@snowpack/plugin-sass',
      {
        compilerOptions : {
          style : 'compressed'
        }
      }
    ],
    [
      '@snowpack/plugin-typescript',
      {
        args : "--project tsconfig.json"
      }
    ],
  ],
  devOptions: {
    port : 8080,
    open : 'none'
  },
  buildOptions: {
    //Build to docs folder for Github page
    out : "docs",
    baseUrl : "./"
  },
  
  "optimize": {
    "bundle": true,
    "minify": true,
    "target": 'es2018'
  }
};
