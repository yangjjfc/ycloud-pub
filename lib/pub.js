const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const { error, stopSpinner } = require('@vue/cli-shared-utils')

const global = require("../utils/global.js");

async function create(options) {
    const PROJECT_PATH = process.env.DIR || process.cwd(); //路径
    let map = JSON.parse(fs.readFileSync(path.normalize(`${PROJECT_PATH}/protal/public/map.json`))),
        config = null;
    let targetDir = "dist"
    if (options.name) { //自定义名称
        targetDir = options.name
    }
    let targetProjects = [];
    if (options.customer) { //自定义打包子项目
        targetProjects = options.customer.split(',');
    }
    [config, map] = global.generateConfig(PROJECT_PATH, targetProjects, map);

    if (options.local) { //本地开发
        global.wirteConfig(PROJECT_PATH, "protal/public", config, map);
    } else {
        rimraf(targetDir, global.generate.bind(this,PROJECT_PATH, targetDir, config,map));
    }
}

module.exports = (...args) => {
    return create(...args).catch(err => {
        stopSpinner(false) // do not persist
        error(err)
        if (!process.env.VUE_CLI_TEST) {
            process.exit(1)
        }
    })
}