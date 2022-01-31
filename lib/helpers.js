//helpers for various tasks 




//Container for all the helpers 
const cryto = require('crypto')
const config = require('./config')


let helpers = {}


//Create a 
helpers.hash = function(str){
    if(typeof(str) == 'string' && str.length > 0){
        let hash = cryto.createHmac('sha256',config.hashingSecret).update(str).digest('hex')
    }else{
        return false;
    }
}

helpers.parseJsonToObject = function (str){
    try{
                let obj = JSON.parse(str)
                return obj
    }catch( error){
        return {}
    }
}

//Create a string of random alphanumeric characters, of a given length

helpers.createRandomString = function (strLength){

    strLength = typeof (strLength) == 'number' && strLength > 0 ? strLength : false;


    let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz123456789';

    let str = '';

    for (let x = 0; x <= strLength; x++){
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters));

        str+= randomCharacter ;
    }
}

module.exports = helpers 


