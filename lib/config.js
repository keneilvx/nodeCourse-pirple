//create and export configuration variables 

//general container for all the enviroments


let enviroments = {}

//Staging the (default object)

enviroments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisISASecret',
    'maxChecks': '5'
};

enviroments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'thisISASecret',
    'maxChecks': '5'
};


//determine which should be exported out 

let currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';


//check if the environment is one above environments

let environmentToExport = typeof(enviroments[currentEnvironment]) == 'object' ? enviroments[currentEnvironment] : enviroments.staging


module.exports = environmentToExport