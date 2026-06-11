const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

// Find the project and workspace directories
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// 4. Force zustand to resolve to CJS (.js) instead of ESM (.mjs)
//    zustand's ESM files use `import.meta.env` which is not supported
//    in the Metro bundler, causing "Cannot use 'import.meta' outside a module"
const zustandRoot = path.resolve(workspaceRoot, 'node_modules/zustand');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    if (moduleName === 'zustand') {
      return { type: 'sourceFile', filePath: path.join(zustandRoot, 'index.js') };
    }
    const subPath = moduleName.slice('zustand/'.length);
    const cjsPath = path.join(zustandRoot, `${subPath}.js`);
    if (fs.existsSync(cjsPath)) {
      return { type: 'sourceFile', filePath: cjsPath };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
