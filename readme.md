# Module watcher
Designed for developers to help develop node modules.
Watches module changes locally runs specified build script and copies as a dependency to another module node_modules

## Install
Should be installed locally as a dependency for the developed module
```text
npm install advanced-module-watcher
```

## Launching
```text
npx watch-module
```

## Config file
Config file should be placed at the root of the developed module and file name is: **watcher.config.json**
```text
{
  "dist": "./dist",
  "dependent-paths": [
    "../example/test-module"
  ],
  "include": [
    "./src",
    "./package.json"
  ],
  "ignored": [

  ],
  "build": "npm run build"
}
```
**dist** - a build folder of the developed module that gets published to npm\
**dependent-paths** - paths of modules that depend on the developed module\
**include** - paths where to watch changes of the developed module\
**ignored** - paths where to ignore changes\
**build** - command that builds the developed module\
