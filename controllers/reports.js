const axios = require('axios');




let downloadAllData = async (callback)=>{

		 let url = `http://192.168.1.69:8080/leads/report/all`;
      axios.get(url, {
        method : 'get', 
        
    }).then((result)=>{ 
       // console.log(result);
       var data = {form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#general",
      text: "Wetterbest API returned " + result.status + ":+1:",
     
    }};

    callback(null, data);

    })
    .catch((error)=>{
        // console.error(error);
        var data = {form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#general",
      text: "Wetterbest API is sent one file ",
      
    }};

     callback(null, data);

    })



}





module.exports = {

	downloadAllData


}