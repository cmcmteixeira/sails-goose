
module.exports = function( db ){
	

	var fs 		= require('fs');
	var root  	= process.cwd();
	var mongoose= require('mongoose');
	var goose 	= {};
	var goose_ 	= null; 

	var schemaFolder = root + '/api/goose-schemas/';
	var configFile   = root + '/config/goose.js'; 

	// Iterating through the schema file and obtaining the schemas
	//------------------------------
	var schemaFile = fs.readdirSync( schemaFolder )
	var schemas = [];
	for ( i in schemaFile ){
		schemas.push( { 
			name 	: schemaFile[i].replace(/\.js$/i,'') , 
			schema 	: require( schemaFolder + schemaFile[i] ) 
		} );
	}

	//Reading the configurations
	//--------------------------
	var config;
	config = require( configFile ).goose;

	//Obtaining connection options
	//----------------------------
	var options = config.options;
	goose_ = mongoose.connect('mongodb://'+config[db].host + ":" + config[db].port+'/' + config[db].db , options);

	// Creating models base on the db passed
	//--------------------------------------
	for ( i in schemas){
		goose[ schemas[i].name ] = goose_.model( schemas[i].name , schemas[i].schema ,  schemas[i].name );
	}

	// Setting models as globals
	//------------------------------
	if ( config[db].globals ){
		for ( i in schemas ){
			global[schemas[i].name] = goose[schemas[i].name]
		}
	}

	global.goose = goose; 
}