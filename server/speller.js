var nodehun = require('nodehun');
var fs = require("fs");

var ruRU = require('dictionary-ru')

ruRU(function(err, result) {
    var dict = new nodehun(result.aff, result.dic);
    dict.spellSuggest('безперебойный', function(err, correct, suggestion, origWord) {
        console.log('RU', err, correct, suggestion, origWord);
    });

    dict.spellSuggest('скрость', function(err, correct, suggestion, origWord) {
        console.log('RU', err, correct, suggestion, origWord);
    });
})


/*
var lanDir = "/home/ubuntu/workspace/server/Language"

var affbuf = fs.readFileSync(lanDir + '/ru_RU.aff');
var dictbuf = fs.readFileSync(lanDir + '/ru_RU.dic');

var dict = new nodehun(affbuf, dictbuf);

dict.stem('красивая', function(err, stems) {
    console.log(err, stems);
    // the output will be: null, [telling, tell]
});

dict.spellSuggest('скорост', function(err, correct, suggestion, origWord) {
    console.log(err, correct, suggestion, origWord);
    // because "color" is a defined word in the US English dictionary
    // the output will be: null, true, null, 'color'
});

dict.spellSuggest('скорость', function(err, correct, suggestion, origWord) {
    console.log(err, correct, suggestion, origWord);
    // because "calor" is not a defined word in the US English dictionary
    // the output will be: null, false, "carol", 'calor'
});
*/
