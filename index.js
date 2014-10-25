	var fs 		= require('fs');
	var root  	= process.cwd();
	var mongoose= require('mongoose');
	var goose 	= null; 

	var schemaFolder = root + '/api/goose-schemas/';
	var configFile   = root + '/config/goose.js'; 

	//------------------------------
	var schemaFile = fs.readdirSync( process.cwd() +'/api/goose-models' )

	//------------------------------
	var schemas = [];
	for ( i in schemaFile ){
		schemas.push( { 
			name 	: schemaFile[i].replace(/\.js$/i,'') , 
			schema 	: require( schemaFolder + schemaFile[i] ).model  } )
	}

	//------------------------------
	var config;
	config = require( configFile ).goose;

	//------------------------------
	var options = config.options;
	goose = mongoose.connect('mongodb://'+config.host + ":" + config.port+'/' + config.db , options);

	//------------------------------
	for ( i in schemas){
		goose[ schemas[i].name ] = goose.model( schemas[i].name , schemas[i].schema ,  schemas[i].name );
	}


	//------------------------------
	if ( config.globals ){
		for ( i in schemas ){
			global[schemas[i].name] = goose[schemas[i].name]
		}
	}
	
	global.goose = goose; 