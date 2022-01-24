//handlers

let handlers = {}

handlers.ping = function (data, callback){
    callback(200)
}

handlers.sample = function (data , callback){
    callback(406, {'name': 'sample handler'})
}


handlers.notFound = function (data, callback){
    callback(404)
}

handlers.users = function (data, callback){
    let acceptableMethods = ['post', 'get', 'put', 'delete']
}


module.exports = handlers 