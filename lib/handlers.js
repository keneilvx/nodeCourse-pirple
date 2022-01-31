let _data = require('./data')
let helpers = require('./helpers')

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
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data, callback);

    }else{
        callback(405)
    }
}


handlers._users = {}
//Users - post 
//Required data: firstname, lastname , phonenumber, password, tosAgreement 
//Users -post
handlers._users.post = function(data , callback){
    //Check if all required fields are field out 

    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement )
    {
        //Make sure users does not exist 
        _data.read('users', phone , function(err, data){
         if(err){

            var hashedPassword = helpers.hash(password);

            var userObject = {
                'firstname': firstName,
                'lastname': lastName,
                'phone': phone,
                'password': hashedPassword,
                'tosAgreement': true,
                        }

                        _data.create('users', phone, userObject, function(err){
                            if(!err){
                                callback(200)
                            }else{
                                callback(500, {'Error': 'Could not hash the password'})
                            }
                        })

         }else{

         }   
        })

    }else{
        callback(400, {'Error': 'Missing Required fields'})
    }
}


//Users - get
//Required data: phone 

handlers._users.get = function(data , callback){
    //Check that the phone number is valid 
    let phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.length == 10 ? data.queryStringObject.phone.trim() : false

    if(phone){
        //get the token from the headers

        let token = typeof (data.headers.token )== 'string' ? data.headers.tokens : false
        //verify that given token from is valid

        handlers._tokens.verifyToken(token, phone , function (tokenIsValid){
            if(tokenIsValid){
                _data.read('users', phone, function(err, data){
                    if(!err && data){

                        delete data.hashedPassword;
                        callback(200, data)

                    }else
                    {
                        callback(404)
                    }
                })
            }else{
                callback(403, {'Error': ''})
            }
        })


    }else{
        callback(400, {'Error' : 'Missing required field'})
    }
}

//Users - put 
// Required data : phone 
// Optional data L firstname , lastname , password (at least one must be specfied)
// @TODO only let an authenicated user change their own object. Don't let any other user change someone else's object
handlers._users.put = function(data , callback){
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone.trim() : false


    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.length > 0 ? data.payload.lastName.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password.trim() : false;
  
    if(phone){

        if (firstName || lastName || password){

            let token = typeof (data.headers.token )== 'string' ? data.headers.tokens : false
            //verify that given token from is valid
            handlers._tokens.verifyToken(token, phone , function (tokenIsValid){
                if(tokenIsValid){
                    _data.read('users', phone , function(err, userData){
                        if(!err && userData){
                            userData.firstName = firstName;

                            userData.lastName = lastName;

                            userData.hashedPassword = helpers.hash(password)

                            if(!err){
                                callback(200)
                            }else {
                                console.log(err);

                                callback(500,{})
                            }

                        }else {
                            callback (400, {})
                        }
                    })
                }else {
                    callback(403, {'Error': 'Missing required token in header or token is invalid'})
                }


            })


        }
    }

}
//Users - delete 
// Required field Phone 
handlers._users.delete = function(data , callback){

    //check that phone number 
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone.trim() : false
    if(phone){
        //get the token from the headers

        let token = typeof (data.headers.token )== 'string' ? data.headers.tokens : false
        //verify that given token from is valid

        handlers._tokens.verifyToken(token, phone , function (tokenIsValid) {
            if (tokenIsValid) {
                _data.read('users', phone , function(err, data){
                    if (!err && data ){
                        _data.delete('users', phone , function(err, data){



                            if(!err){
                                callback(200)
                            }else {
                                console.log(err);

                                callback(500,{'Error': 'Could not delete Specfied user'})
                            }


                        })
                    }
                });
            }else {
                callback(403, {'Error': 'Missing required token in header or token is invalid'})
            }

        });

    }

    
}

//Container

handlers._tokens = {}

handlers._tokens.post = function (data , callback) {
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.length > 0 ? data.payload.password.trim() : false;
    if(phone && password){
        _data.read('users', phone, function(err, userData){
            if(!err && userData){
                //if valid create a new token with a randdom name. Ser expiration date 1 hour in the future
                let hashedPassword = helpers.hashed(password);
                if(hashedPassword == userData.hashedPassword){

                    let tokenId = helpers.createRandomString(20);
                    let expires = Date.now() + 1000 * 60 * 60;
                    let tokenObject = {
                        'phone' : phone,
                        'id' : tokenId,
                        'expire' : expires

                    };

                    _data.create('tokens', tokenId, tokenObject , function(err)
                    {
                        if(!err){
                            callback (200, tokenObject)
                        }else
                        {
                            callback( 500, {'Error' : ''})
                        }
                    })
                }else {
                    callback(400, {'Error': 'Password did not match the specfied users stored password'})
                }
            }else{
                callback(400, {'Error' : 'Could not find Specfied user'})
            }
        })

    }else{
        callback(400, {'Error': 'Missing required fields'})
    }
}



handlers._tokens.get = function (data , callback) {

    let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.length == 20 ? data.queryStringObject.id.trim() : false

    if(id){
        _data.read('tokens', id, function(err, tokenData){
            if(!err && tokenData){

                delete data.hashedPassword;
                callback(200, tokenData)

            }else
            {
                callback(404)
            }
        })
    }else{
        callback(400, {'Error' : 'Missing required field'})
    }

}

//Tokens - put
//Required data : id : extend
handlers._tokens.put = function (data , callback) {
    let id = typeof(data.payload.id) == 'string' && data.queryStringObject.id.length == 20 ? data.queryStringObject.id.trim() : false
    let extend = typeof(data.payload.extend) == 'string' && data.payload.extend.length == true ? true : false


    if(id && extend ){
        //Lookup the token

        _data.read('tokens', id, function (err, tokenData){
            if(!err && tokenData){

                if(tokenData.expires > Date.now())
                {
                    tokenData.expires = Date.now() + 1000 * 60 * 60
                    _data.update('token', id , tokenData , function (err){
                        if(!err){
                            callback(200)
                        }else{
                            callback(500, {'Error': 'Could not update the token exipration date'})
                        }
                    })
                    //Set Expiration date

                }else{


                }
            }else{
                callback(400, {'Error': 'Specified token does not exist'})
            }

        })
    }else
    {
        callback(400, {'Error': 'Missing required field(s) or field(s) are invalid'})
    }
}

handlers._tokens.delete = function (data , callback) {

    let id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.length == 20 ? data.queryStringObject.id.trim() : false

    if (id){
        _data.read('tokens', id, function(err, data){
            if(!err && data){
                _data.delete('tokens', id, function(err){
                    if(!err){
                        callback(200)
                    }else
                    {
                        callback(500, {'Error': 'Could not delete the specified token'})
                    }
                })
            }else{
                callback(400, {'Error' : 'Could not find the specified token'})
            }
        })
    }else{
        callback(400, {'Error': 'Missing Required field'})
    }
}

handlers._tokens.verifyToken = function(id, phone , callback){
    _data.read('tokens', id , function (err, tokenData){

        if(!err && callback){
            if (tokenData.phone == phone && tokenData.expires > Date.now()){

                callback(false)

            }else{
                callback(false)
            }
        }else
        {
            callback(false)
        }
    })
}

//Tokens
handlers.tokens = function (data, callback){
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._tokens[data.method](data, callback);

    }else{
        callback(405)
    }
}

handlers.checks  = function (data, callback){
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._checks[data.method](data, callback);

    }else{
        callback(405)
    }
}

handlers._checks = {}


// Checks - post
//Require data: protocol , url , method , successCodes, timeoutSeconds
//Optional data : none

handlers._checks.post = function(data, callback){
    let protocol = typeof(data.payload.protocol) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false
    let url = typeof(data.payload.url) == 'string' && ['https', 'http'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false


}



module.exports = handlers 