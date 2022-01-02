
//import dependencies
let http = require('http')
let url = require('url')


//create server
 let server = http.createServer( function(req, res){
     res.end("hello World");
    //parse the URL
     let parsedUrl = url.parse(req.url, true)

     //get the path name
     let path = parsedUrl.pathname
     //trim the path
     let trimmedPath = path.replace(/^\.?\/?/, '')

     //get the method (GET, POST, DELETE, PUT)
     let method = req.method.toLowerCase()
     //console log the request & method
     console.log('request received on' , trimmedPath + 'this is method' + ' ' + method)
 })

//run the API on port 3000
server.listen( 3000, function (){
    console.log("Server running on port 3000")
});