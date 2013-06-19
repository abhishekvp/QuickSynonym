let data = require("sdk/self").data;
let Request = require("sdk/request").Request;
let cm = require("sdk/context-menu");
var tDict;
var jDict = new Array();
let getDict = Request({
    url: data.url("dict.txt"),
    overrideMimeType: "text/plain; charset=utf8",
    onComplete: function (response) {
        readOnce(response.text);
    }
});

getDict.get();

let item = cm.Item({
    label: "Synonym:",
    context: cm.SelectionContext()
});

require("sdk/selection").on("select", function () {
    let ans = lookUp(this.text);
    item.label = ans;
})

function readOnce(dict) {
    tDict = dict.split("\n");
    for (let i = 0; i < tDict.length; i++) {
        jDict[i] = tDict[i].split(",");
    }
    console.log("reading complete !");


}

function lookUp(sText) {
    let flag = 0;

    if (sText != null && sText.length > 1) {
        console.log("Text to search =" + sText);
        var syn = "";
        for (let i = 0; i < jDict.length; i++) {
            for (let j = 0; j < 3; j++) {
                if (j == 2 && sText.replace(" ","").match(new RegExp(jDict[i][j].substring(0, (jDict[i][j].length - 1)),"i"))) {
                    flag = 1;
                    syn = jDict[i][0];
                    break;
                } else if (sText.replace(" ","").match(new RegExp(jDict[i][j],"i"))) {
                    flag = 1;
                    syn = jDict[i][j + 1];
                    break;
                }
            }
        }

        if (flag == 0)
            syn = "Only ask for difficult words, my friend !";
        return "Synonym: " + syn;

    }
}