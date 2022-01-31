
//import dependencies
const http = require('http')
const https = require('https')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config')
var fs = require('fs')
let _data = require('./lib/data')
let handlers = require('./lib/handlers')

// @TODO

// _data.create('test', 'newFile', function(err){
//     console.log('this was the error', err)
// })

// _data.read('test', 'newFile', {'foo': 'bar'}, function(err, data ){
//     console.log('this was the error', err, "and this is data")
// })


// _data.update('test', 'newFile', {'ffizz': 'bbuzz'}, function(err, data ){
//     consolse.log('this was the error', err)
// })

// 
//HTTP SERVER 
//create server
 let httpServer = http.createServer( function(req, res){
    unifiedServer(req, res)
 })


httpServer.listen( config.httpPort, function (){
    console.log("Server running on port " + config.httpPort + "enviroment is current" + config.envName)
});

let httpsServerOptions = {

    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')

};

 //HTTPS SERVER 
let httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req, res)
 })

httpsServer.listen( config.httpsPort, function (){
    console.log("Server running on port " + config.httpsPort + "enviroment is current " + config.envName)
});

let unifiedServer = (function(req,res){
    res.end("hello World");
    //parse the URL
     let parsedUrl = url.parse(req.url, true)

     //get the path name
     let path = parsedUrl.pathname

     //trim the path
     let trimmedPath = path.replace(/^\.?\/?/, '')

     let queryStringObject = parsedUrl.query

     let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

     let data = {
         'trimmed Path': trimmedPath,
        'queryStringObject':queryStringObject,
        //'method': method,
        'headers': headers,
        // 'payload': payload,
        'payload': helpers.parseJsonToObject(buffer)

     }

     chosenHandler(data , function(statusCode, payload){
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200

         payload = typeof(payload) == 'object' ? payload : {}

         let payloadString = JSON.stringify(payload)
        
         //formats to JSON 
         res.setHeader('Content-Type', 'application/json')
         //Return the response 
         res.writeHead(statusCode)

         res.end(payloadString)

         console.log ('returning the response ', statusCode , payloadString)
     })

     //get the method (GET, POST, DELETE, PUT)
     let method = req.method.toLowerCase()
     let queryString =  parsedUrl.query

     let headers = req.headers
     const decoder = new StringDecoder('utf8');
     let buffer = ''

     //Will be triggered if data is in the request
     req.on('data', function (data){
         buffer += decoder.write(data)
     })

     //Will get call everytime
     req.on('end', function (){
        buffer += decoder.end()

         //console log the request & method
         //console.log('request received on' , trimmedPath + 'this is method' + ' ' + method + "The query string parameters are as follows: " );

         //console log the headers
         //console.log('headers', headers)s
        // console.dir(queryString);
     })


})

 
let router = {
    'sample' : handlers.sample,
    'ping': handlers.ping,
    'handlers': handlers.user ,
    'tokens': handlers.token

}