//create and export configuration variables 

//general container for all the enviroments


let enviroments = {}

//Staging the (default object)

enviroments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
};

enviroments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
};


//determine which should be exported out 

let currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


//check if the enviroment is one above enviroments 

let enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging


module.exports = enviromentToExport