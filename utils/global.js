const fs = require("fs");
const fse = require('fs-extra')
const copy = require("./copy.js");
const path = require("path");

let trasPath = (dir) => {
    return path.normalize(path.resolve(dir))
}
const global = {
    /**
     * 生成配置文件
     * @param {*读取路劲} path 
     * @param {*目标项目,数组} target 
     * @param {*配置} map 
     */
    generateConfig: (path, target, map) => {
        let files = fs.readdirSync(path);
        let config = [];
        files.forEach(element => {
            var stat = fs.statSync(trasPath(path + "/" + element));
            if (stat.isDirectory()) {
                //递归读取文件
                let json = fse.readJsonSync(trasPath(path + "/" + element + "/project.json"), {
                    throws: false
                });
                if (json && (!target.length || target.includes(json.name))) {
                    map.imports[json.name] = json[json.name];
                    config.push(json);
                }
            }
        });
        return [config, map];
    },
    /**
     * 配置
     * @param {目标项目} dir 
     * @param {配置} config 
     * @param {*} map 
     */
    wirteConfig: (path, dir, config, map) => {
        fs.writeFileSync(
            trasPath(`${path}/${dir}/project.js`),
            `define(function (){return {projects: ${JSON.stringify(config)}};})`, {
                encoding: "utf-8"
            }
        );
        fs.writeFileSync(
            trasPath(`${path}/${dir}/map.json`),
            JSON.stringify(map, null, 4)
        );
        console.log("项目配置文件生成");
    },
    /**
     * 生成
     * @param {目标项目} dir 
     * @param {*} config 
     */
    generate: (path, dir, config,map) => {
        if (!fs.existsSync(trasPath(`${path}/${dir}`))) {
            fs.mkdirSync(`${path}/${dir}`);
        }
        global.wirteConfig(path, dir, config, map);
        config.forEach(item => {
            copy(
                trasPath(`${path}/${item.name}/dist`),
                trasPath(`${path}/${dir}/${item.name}`)
            );
        });
        copy(`${path}/protal/dist`, `${path}/${dir}/protal`);
        console.log("项目文件已经重新生成");
    }
}


module.exports = global;