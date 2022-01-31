const fs = require('fs')
const path = require('path')
const helpers = require('./helpers')


let lib = {}

//define base directory for the .data folder


lib.baseDir = path.join(__dirname, '/../.data/')

lib.create = function (dir, file , data, callback){
    
    //open the file for writing 
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){

        if (!err && fileDescriptor){
            //convert data to string 
            let stringData = JSON.stringify(data)

            fs.writeFile(fileDescriptor, stringData, function(err){

                if (!err){
                    fs.close(fileDescriptor, stringData, function(err){
                        callback(false)
                    })

                }else{
                    callback('Error writing to new file')
                }
            })
        }else{
            callback('COuld not create new file, It may already exist ')
        }
    })
}


lib.read = function (dir, file, callback){
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8', function(err,data){
        if(!err && data){
            let parsedData = helpers.parseJsonToObject(data);
            callback(false)
        }else{
            callback(err,data);
        }
        
    })
}

//update data inside a file 


lib.update =  function(dir, file , data , callback){
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+' , function(err, fileDescriptor){
        if(!err && fileDescriptor){
            // Convert data to string 
            let stringData = JSON.stringify(data)

            //truncate the file 
            fs.truncate(fileDescriptor, function(err){
                if(!err){
                    //Write to file and close it
                    fs.writeFile(fileDescriptor, stringData , function(err){
                        if(!err){
                            callback(false)
                        }else{
                           callback('Error closing the file') 
                        }
                    })
                } else{
                    callback('Error trunating file')
                }
            })
        }
    })
};

lib.delete = function (dir, file , callback){
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', function(err){
        if(!err){
            callback(false)
        }else{
            callback("file does not exist")
        }
    })
}

module.exports = lib 