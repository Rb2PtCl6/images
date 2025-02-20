import * as fs from 'node:fs'
import { spawn } from 'child_process'

const config = JSON.parse(fs.readFileSync("config.json"))
var  storage = {}

async function execute_command(compression_level, format, achive_format, interaction) {
    const action = spawn("7z", "a", `-mx${compression_level}`, `${format}-${compression_level}-${interaction}.${achive_format}`, `${format}.${format}`)
    action.stdout.on("data", data => {
        console.log(`stdout: ${data}`)
    })
    action.stderr.on("data", data => {
        console.log(`stderr: ${data}`)
    })
    action.on('error', (error) => {
        console.log(`error: ${error.message}`)
    })
    action.on("close", code => {
        console.log(`child process exited with code ${code}`)
    })
}

(async function () {
    for await (var format of config.formats){
        storage[format] = {"original_size": fs.statSync(`${format}.${format}`).size}
        for await (var achive_format of config.achive_formats){
            storage[format][achive_format] = {}
            for await (var compression_level of config.compression_levels){
                storage[format][achive_format][compression_level] = {}
                for await (var interaction of config.interactions){
                    var start = +new Date()
                    await execute_command(compression_level, format, achive_format, interaction)
                    var end = +new Date()
                    storage[format][achive_format][compression_level][interaction] = {
                        size: fs.statSync(`${format}-${compression_level}-${interaction}.${achive_format}`).size,
                        time: end - start
                    }
                }
            }
        }
    }
    console.log(storage)
})()