const fs = require("fs")

const source = "archive-2.txt"
const content = (fs.readFileSync(source, 'utf-8')).split('\n')

var separator = "/"
var this_string
var tmp

var default_link

var final = {}

for (var i = 0; i < content.length; i++) {
    // console.log(content)
    this_string = content[i]
    tmp = this_string.split(separator)
    default_link = final
    console.log(tmp)
    for (var j = 0; j < tmp.length; j++){
        //console.log(j)
        if ( j == (tmp.length - 1) ){
            //console.log("here")
            if (!default_link["content"]){
                default_link["content"] = []
            }
            default_link["content"].push(tmp[j])
        } else {
            if (!default_link[tmp[j]]){
                default_link[tmp[j]] = {}
            }
            default_link  = default_link[tmp[j]]
        }
    }
}

console.log(final)

fs.writeFileSync("unsorted_music.json",JSON.stringify(final))