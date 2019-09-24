let queryAPI = async (url, method, body, callback) => {

   await fetch(url,{
        method : method, 
        headers : {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
        }
    }).then(response => response.json()).then((data)=>{

        
            callback(null, data);


    }).catch((err)=>{
        console.log(err);
    })


}



let webImport = async () => {

    await fetch(webImportUrl,{
       method: 'GET',
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
           "Access-Control-Allow-Origin": "*",
           "Access-Control-Allow-Methods": "*",
           "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
       }, 
     
   }).then(response => response.json()).then(async (data) => {
   
           return data;
   
     }).catch((err) => {
       console.log(err);
     });

    //    location.reload();

}   






let changeBtn = async (id) => {
      await checkIfOtherBtnIsPressed(id);
    let button = document.getElementById(id);

 
    if(button.innerHTML === 'Aplicat'){
        button.innerHTML = 'Aplica';
        button.className = 'btn btn-success btn-sm';
    } else {
        
        button.innerHTML = 'Aplicat';
        button.className = 'btn btn-warning btn-sm ';
        (id.includes('_')) ? localStorage.setItem('client', id) : localStorage.setItem('lead', id);   
        
    }

    checkForConnection();

}





let checkIfOtherBtnIsPressed = async(id)=>{

    if(id.includes('_')){

        if(localStorage.getItem('client')){
            try{
            let button = document.getElementById(localStorage.getItem('client'));
            button.innerHTML = 'Aplica';
            button.className = 'btn btn-success btn-sm';
            } catch(error){
                console.log('The button was not on the same page at client press');
            }
        } 

    } else {

        if(localStorage.getItem('lead')){
                try { 
            let button = document.getElementById(localStorage.getItem('lead'));
            button.innerHTML = 'Aplica';
            button.className = 'btn btn-success btn-sm';
                } catch(error){
                    console.log('The button was not on the same page at lead press');
                }
        }

    }


}


let discardPressedButtons = async () => {


   let clientBtn =  document.getElementById(localStorage.getItem('client'))


clientBtn.innerHTML= 'Aplica';
clientBtn.className = 'btn btn-success btn-sm';

}




let deleteLead = async (id) =>{

    Object.keys(localStorage).forEach(function(key){

        if(key.includes(id)){
            localStorage.removeItem(key);
        }


    });


        displayCurrentConnections();
}



let displayObsModal = async (id) => {


    let leadsData = JSON.parse(localStorage.getItem('leadsData'));

    leadsData.forEach(async (lead)=>{

        if(lead.id == id){

            alert(lead.obs);

        }

});


}








/////////////////////// lead functionality //////////////////////////


let sendLeadToClient = async (lead, clientEmail, agentEmail) => { 

        

     
    await fetch(dataEmailUrl,{
     method: 'POST',
     headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "*",
         "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
     }, 
     body:JSON.stringify({
         lead : lead , 
         clientEmail : clientEmail,
         agentEmail : agentEmail
     })
 }).then(response => response.json()).then(async (data) => {
 
         return data;
 
   }).catch((err) => {
     console.log(err);
   });



}



let updateTheClient = async (id, client) => { 

 console.log(`${id}-${client}`);

 await fetch(`${BASE_URL}/leads/update/${id}/${client}`,{

     method: 'PUT',
     headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "*",
         "Access-Control-Allow-Headers": " Origin, X-Requested-With, Content-Type, Accept, Authorization"
     }
 }).then(response => response.json()).then(async (data) => {

   console.log(data);
 
   }).catch((err) => {
     console.log(err);
   });

}



let sendSMS = async (clientName, apiKey, apiSecret, leadPhone) => {


 await fetch(`${dataSMSUrl}/${clientName}/${apiKey}/${apiSecret}/${leadPhone}`,{
     method: 'GET',
     headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         "Access-Control-Allow-Origin": "*",
         "Access-Control-Allow-Methods": "*",
         "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
     }
 }).then(response => response.json()).then(async (data) => {
 
     console.log(data);
     
 }).catch((err) => {
   console.log(err);
 });



}

