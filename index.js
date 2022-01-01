
//import dependencies
let http = require('http')
let url = require('url')


//create server
 let server = http.createServer( function(res, req){
     res.end("hello World");
    //parse the URL
     let parsedUrl = url.parse(req.url, true)

     //trim the path
     let trimmedPath = parsedUrl.replace(/^\.?\/?/, '')

     //console log the request
     console.log('request received on' , trimmedPath)
 })

//run the API on port 3000
server.listen( 3000, function (){
    console.log("Server running on port 3000")
});