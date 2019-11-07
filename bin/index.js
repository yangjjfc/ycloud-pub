#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version

const semver = require("semver");
const path = require('path');
const chalk = require('chalk');
const program = require('commander');
//转化路径问题
const requiredVersion = require(path.resolve(__dirname, "../package.json")).engines.node;

//检测版本
if (!semver.satisfies(process.version, requiredVersion)) {
    error(
        `You are using Node ${process.version}, but vue-cli-service ` +
        `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
    );
    process.exit(1);
}

//版本
program
    .version(require('../package').version)
    .usage('<command> [options]')

program
    .command('pub')
    .description('build a pub project powered by node')
    .option('-l, --local', 'Perform local development')
    .option('-n, --name <name>', 'Name of the target')
    .option('-c, --customer <namelist>', 'Custom packaging directory, name comma separated')
    .action((cmd) => {
        const options = cleanArgs(cmd)
        require('../lib/pub')(options)
    })

program
    .arguments('<command>')
    .action((cmd) => {
        program.outputHelp()
        console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
        console.log()
    })

program.on('--help', () => {
    console.log()
    console.log(`  Run ${chalk.cyan(`ycloud <command> --help`)} for detailed usage of given command.`)
    console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)


//错误提示
const enhanceErrorMessages = require('../utils/enhanceErrorMessages')

enhanceErrorMessages('missingArgument', argName => {
    return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})


enhanceErrorMessages('unknownOption', optionName => {
    return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
    return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
        flag ? `, got ${chalk.yellow(flag)}` : ``
    )
})

function camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs(cmd) {
    const args = {}
    cmd.options.forEach(o => {
        const key = camelize(o.long.replace(/^--/, ''))
        // if an option is not present and Command has a method with the same name
        // it should not be copied
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key]
        }
    })
    return args
}