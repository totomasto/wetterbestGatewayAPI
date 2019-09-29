const axios = require('axios');
const BASE_URL = 'http://192.168.1.69:8080';




/////////////////////////////////////////////////////////// WETTERBEST APP //////////////////////////////////////////////////////



let requestResellerCheck = async (cif,callback) => {

   let url = `http://192.168.1.69:8080/wtb/reseller/check/${cif}`;

    axios.get(url, {
        method : 'get'
    })
    .then((result)=>{
        callback(null, result.data);
    })
    .catch((error)=>{
        console.error(error);
    })




    // callback(null, resellerEmail);
}


let sendLinkToResseler = async (email, callback) => {

        let url = `http://localhost:8081/wtb/reseller/link/${email}`;

        axios.get(url, {
            method : 'get'
        })
        .then((result)=>{
            callback(null, result.data);
        })
        .catch((error)=>{
            console.error(error);
        })


}










//////////////////////////////////////////////////////////// END WETTERBEST APP //////////////////////////////////////////////////




let getLead = async (id, callback) => {

    let url = `http://192.168.1.69:8080/leads/select/${id}`;

    axios.get(url, {
        method : 'get'
    })
    .then((result)=>{
        callback(null, result);
    })
    .catch((error)=>{
        console.error(error);
    })

}


let getAllLeads = async (email, callback)=>{

    let url = `http://localhost:8081/wtb/leads/select/${email}`;
    console.log('Req has been made for '+ email);
     axios.get(url, {
        method : 'get'
    })
    .then((result)=>{
        // console.log(result.data);
        callback(null, result.data);
    })
    .catch((error)=>{
        console.error(error);
    })


}


let getClients = async (callback)=>{

      let url = `http://192.168.1.69:8080/nav/leads/clients`;

    axios.get(url, {
        method : 'get'
    })
    .then((result)=>{
        callback(null, result);
    })
    .catch((error)=>{
        console.error(error);
    })
}



let requestInsertOfLead = async (data,callback) => {
    let date = new Date();
    console.log(`${date} : Sending data to Wetterbest...`);
    let url = `http://192.168.1.69:8080/leads/insert`;
    axios.post(url, {
        method : 'post', 
        body : {
            fullName : data.fullName,
            email : data.email,
            phone: data.phone,
            region : data.region,
            city : data.city,
            tip : data.tip,
            source : data.source,
            obs : data.obs
        }
    }).then((result)=>{
       
        callback(null, result);
        
    })
    .catch((error)=>{
        console.error(error);
    })

} 


let requestUpdateOfLead = async (name,reason, callback) =>{

    console.log(`Sending status update to Wetterbest...`);
    let url = `http://192.168.1.69:8080/leads/update/success/${name}/${reason}`;
      axios.get(url, {
        method : 'get', 
        
    }).then((result)=>{ 
       
        callback(null, result);
        
    })
    .catch((error)=>{
        console.error(error);
    })


}

let requestUpdateOfLeadFailed = async (name,reason, callback) =>{

    console.log(`Sending status update to Wetterbest...`);
    let url = `http://192.168.1.69:8080/leads/update/fail/${name}/${reason}`;
      axios.get(url, {
        method : 'get', 
        
    }).then((result)=>{ 
       
        callback(null, result);
        
    })
    .catch((error)=>{
        console.error(error.url);
    })


}


let requestUpdateOfLeadWait = async (name, callback) =>{

    console.log(`Sending status update to Wetterbest...`);
    let url = `http://192.168.1.69:8080/leads/update/wait/${name}`;
      axios.get(url, {
        method : 'get', 
        
    }).then((result)=>{ 
       
        callback(null, result);
        
    })
    .catch((error)=>{
        console.error(error);
    })


}


let checkStatus = async (callback) => {



     let url = `http://192.168.1.69:8080/status`;
      axios.get(url, {
        method : 'get', 
        
    }).then((result)=>{ 
       
       var data = {form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#general",
      text: "Wetterbest API returned " + result.status + ":+1:"
    }};

    callback(null, data);

    })
    .catch((error)=>{
        // console.error(error);
        var data = {form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#general",
      text: "Wetterbest API is not available :poop: " 
    }};

     callback(null, data);

    })



}



// cortina products

let getCortinaProductsFromDB = async (callback) => {

let url = `http://192.168.1.69:8080/cortina/form/products`;

 axios.get(url).then((result)=>{
        callback(null, result.data);
    // console.log(result);
    })
    .catch((error)=>{
        console.log(error);
    })


}



let getCortinaPriceListFromDB = async (callback)=>{
    let url = `http://192.168.1.69:8080/cortina/priceApp/prices`;

    axios.get(url).then((result)=>{
        callback(null, result.data);
    }).catch((err)=>{
        console.log(error);
    })
}

let getCortinaClientsListFromDB = async (callback)=>{
    let url = `http://192.168.1.69:8080/cortina/priceApp/clientsList`;

    axios.get(url).then((result)=>{
        callback(null, result.data);
    }).catch((err)=>{
        console.log(error);
    })
}














// roua temporar
let sendRouaData = async (data, callback) => {


    let url = `http://192.168.1.69:8080/roua/email`;
    axios.post(url, {
        body : data
    }).then((result)=>{
        callback(null, result);
    })
    .catch((error)=>{
        console.log(error);
    })


}


let sendRouaContact = async(data, callback)=>{

 let url = `http://192.168.1.69:8080/roua/contact`;
    axios.post(url, {
        body : data
    }).then((result)=>{
        callback(null, result);
    })
    .catch((error)=>{
        console.log(error);
    })


}








//function export 
module.exports = {
    requestResellerCheck,
    sendLinkToResseler,
    getLead,
    getAllLeads,
    getClients,
    requestInsertOfLead,
    requestUpdateOfLead,
    requestUpdateOfLeadFailed,
    requestUpdateOfLeadWait,
    checkStatus,
    getCortinaProductsFromDB,
    getCortinaPriceListFromDB,
    getCortinaClientsListFromDB, 
    sendRouaData,
    sendRouaContact


}