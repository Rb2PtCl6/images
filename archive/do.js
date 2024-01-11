const fs = require("fs")


const source = "archive.txt"
const content = (fs.readFileSync(source, 'utf-8')).split('\n')

/*for (var i = 0; i < content.length; i++) {
    console.log(content[i])
}*/

var which = 0
var this_string
var tmp
var tmp2

var skip = false

var final_ver  = {a: {}, y: {}}
var final_ver_2 = []

//console.log(content)

for (var i = 0; i < content.length; i++) {
    // console.log(content)
    this_string = content[i]
    //console.log(this_string)
    if (this_string == "C:/path/to/functions/downloader-2") {
        which = 1
        //console.log("set which == 1")
        continue
    } else if (this_string == "C:/path/to/functions/webm-to-mp3/result") {
        which = 2
        //console.log("set which == 2")
        continue
    }
    if (which == 1) {
        //console.log("opened which == 1")
        tmp = (this_string.split("/"))[0]
        // console.log(tmp)
        if (tmp.includes("a")) {
            tmp = (tmp.replace("   video", "")).replace("a", "")
            if (!final_ver["a"][tmp]) {
                final_ver["a"][tmp] = []
            }
            final_ver["a"][tmp].push((this_string.split("/"))[1])
        } else if (tmp.includes("y")) {
            tmp = (tmp.replace("   video", "")).replace("y", "")
            if (!final_ver["y"][tmp]) {
                final_ver["y"][tmp] = []
            }
            tmp2 = (this_string.split("/"))[1]
            tmp2 = (tmp2.replace("].webm", "")).replace(/.*\[/gm, "")
            final_ver["y"][tmp].push(tmp2)
        }
    } else if (which == 2) {
        if (skip){
            skip = false
            continue
        }
            tmp2 = this_string.replace("   ","")
            tmp2 = (tmp2.replace("].jpg", "")).replace(/.*\[/gm, "")
            final_ver_2.push(tmp2)
            skip = true
    }
}

console.log(final_ver)
console.log(final_ver_2.length)

//fs.writeFileSync("downloader-2.json",JSON.stringify(final_ver))
//fs.writeFileSync("webm-to-mp3.json",JSON.stringify(final_ver_2))