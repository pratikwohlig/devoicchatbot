var schema = new Schema({
    Questions: {
        type: String,
    },
    Answers: {
        type: String,
    },
    que_ans: {
        type: String,
    },
    final: {
        type:String,
    },
    Category: {
       type:String,
    }, 
    Link: {
       type:String,
   },
});

schema.plugin(deepPopulate, {
    
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);

module.exports = mongoose.model('Chatbotautocomplete', schema,'chatbotautocomplete');

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
//new RegExp(searchstring)
//{ $regex: searchstring, $options: 'i' }
var model = {
    getautocomplete: function (data, callback) {
        searchstring=data.string;
        searchstring = "/"+searchstring+"/";
        Chatbotautocomplete.find({
            Questions:{ $regex: '.*' + data.string + '.*',$options:"i" }
        }, { Answers: 1, Questions: 1,Category:1,Link:1 }).limit(4).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } 
            else {
                if (found) {
                    callback(null, found);
                } else {
                    callback({
                        message: "-1"
                    }, null);
                }
            }

        });
    },
    authenticate: function (data, callback) {
        //var exec = require('child_process').execFile;
       // var executablePath =  process.cwd()+'\\exe\\licence_validate.exe';
		/*var execFile = require('child_process').execFile;
        var parameters = ["chat.i-on.in"];
		execFile('C:\\Users\\Administrator\\auth\\licence_validate.exe', ['chat.i-on.in'], function(err, found) {
			if(err) {
				console.log(err)
			} 
			else 
			console.log(found.toString()); 
			callback(null, JSON.parse(found));		
		}); */

        exec('C:\\Users\\Administrator\\auth\\licence_validate.exe "chat.i-on.in"', function(err, found) {
            console.log(err)
            console.log(found.toString());
            callback(null, JSON.parse(found));
        });
		
		
		/*
		 var spawn = require("child_process").spawn;
        var process = spawn('python',['C:\\Users\\Administrator\\auth\\licence_validate2.py',"chat.i-on.in"], {detached: true});
        //process.unref();
        
        process.stdout.on('data',function(chunk){

            var textChunk = chunk.toString('utf8');// buffer to string
			console.log("data", textChunk);
            json_data = JSON.parse(chunk);
            //console.log("tts",json_data);
            //console.log("chunk",chunk);
            //util.log(chunk);
            //console.log("data", chunk);
            callback(null, json_data);
            
        });

        process.on('close', function (code) {
            console.log("close",code);
        });
		
        process.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });
        process.stdout.on('error', function( err ) {
            if (err.code == "EPIPE") {
                console.log("error",err);
                py.exit(0);
            }
			callback(err,null);
        });
        process.stdout.on('end', function(){
        	//var str = dataString.substring(1,dataString.length);
        	console.log("end");
        });
        process.stdin.write(JSON.stringify(data));

        process.stdin.end();*/
		
		/*var spawn = require("child_process").spawn;
        var process1 = spawn('cmd',['C:\\Users\\Administrator\\auth\\licence_validate.exe'], {detached: true});
        process1.stdout.on(parameters,function(chunk){

             console.log("data", textChunk);
             json_data = JSON.parse(chunk);
        //     //console.log("tts",json_data);
        //     //console.log("chunk",chunk);
        //     //util.log(chunk);
        //     console.log("data", chunk);
             callback(null, json_data);
            
         });
         process1.on('close', function (code) {
             console.log("close",code);
         });
		
         process1.stderr.on('data', function (data) {
             console.log('stderr: ' + data);
         });
         process1.stdout.on('error', function( err ) {
             if (err.code == "EPIPE") {
                 console.log("error",err);
                 //py.exit(0);
             }
		 	callback(err,null);
        });
         process1.stdout.on('end', function(){
        // 	//var str = dataString.substring(1,dataString.length);
        // 	console.log("end");
        });
        // process1.stdin.write(JSON.stringify(parameters));

         process1.stdin.end();*/
        // searchstring=data.string;
        // searchstring = "/"+searchstring+"/";
        // Chatbotautocomplete.find({
        //     questions:{ $regex: '.*' + data.string + '.*',$options:"i" }
        // }, { answers: 1, questions: 1,category:1,link:1 }).limit(4).exec(function (err, found) {
        //     if (err) {
        //         callback(err, null);
        //     } 
        //     else {
        //         if (found) {
        //             callback(null, found);
        //         } else {
        //             callback({
        //                 message: "-1"
        //             }, null);
        //         }
        //     }

        // });
    },
};
module.exports = _.assign(module.exports, exports, model);