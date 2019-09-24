

    let processLead = async (connectionId, clientEmail, clientName, leadPhone, agentEmail) => {
     

        console.log(connectionId,clientEmail, clientName, leadPhone, agentEmail);
        
        let leadsData = JSON.parse(localStorage.getItem('leadsData'));

        leadsData.forEach(async (lead)=>{

            if(lead.id == connectionId){
             
           



                // not used for testing it fully works 
                // sending email with the data and client email address

                if( await sendLeadToClient(lead, clientEmail, agentEmail)){ console.log('Email was sent succesfully');}

                


                //Ideea : send SMS see if they re ok with it 
                await sendSMS(clientName, '7830e32b', 'Macboopro2012', leadPhone);
                  
    
                // making put request to the API to update the client and the status of the lead
                await updateTheClient(lead.id, clientName);


                //delete the lead so its updated and we have no use of it 
                // using the function that deletes (see up)
                await deleteLead(connectionId);

                //also needed is the disabling of all the buttons if the lead is proccesed 


                //reload the page -> its easier and kinda safe 
                // I tried to reload just the table but its much more effective to reload the page 
                // the reload is happening inside the deleteLead function, await doesnt seem to work, it reloads before the functions are finishing
                
                location.reload();
            }


        });
    
         
    }












let checkForConnection = async () => {

if(localStorage.getItem('lead') && localStorage.getItem('client')){
    console.log('Connection is possible...');

    let connectionData = {
        id   : localStorage.getItem('lead'),
        lead : localStorage.getItem('lead'),
        client : localStorage.getItem('client')
    }

    localStorage.setItem(`connection_${connectionData.id}`, JSON.stringify(connectionData));



    await discardPressedButtons();
    await removeLocalData();

    displayCurrentConnections();

}



}




let displayCurrentConnections = async () => { 

    let connectionsData = [];

    Object.keys(localStorage).forEach(function(key){
        if(key.includes('connection')){
           
            let connectionData = JSON.parse(localStorage.getItem(key));
            let leadID = connectionData.lead;
            let clientID = connectionData.client;
            let leadsData = JSON.parse(localStorage.getItem('leadsData'));
            let clientsData  = JSON.parse(localStorage.getItem('clientsData'));
            // console.log(clientsData);
            // console.log(clientID);
            leadsData.forEach((element)=>{
               
                if(element.id == leadID){
                    
                    let lead = element;

                    clientsData.forEach((element)=>{

                        if(element.No === clientID){
                           
                            lead.clientName  = element.Name;
                            lead.clientEmail = element.E_Mail;
                            lead.agentEmail  = element.email_agent;
                            

                        }

                    });
                    
                    connectionsData.push(lead);

                }


            });


        }
     });
    //  console.log(connectionsData);
        // actually displaying the table :D 
        let connectionsTable = document.getElementById('connections');
        $("#connections tr").remove(); 
connectionsData.forEach((element)=>{


                let row = connectionsTable.insertRow(-1);
                let cell1 = row.insertCell(-1);
                let cell2 = row.insertCell(-1);
                let cell3 = row.insertCell(-1);
                let cell4 = row.insertCell(-1);
                let cell5 = row.insertCell(-1);
                let cell6 = row.insertCell(-1);
                let cell7 = row.insertCell(-1);

                cell1.innerHTML = element.id; 
                cell2.innerHTML = 'Nume lead : <b>' + element.name + '</b>'; 
                cell3.innerHTML = 'Judet : <b>'  +  element.region + '</b>';
                cell4.innerHTML = `<i class="fa fa-arrow-right " aria-hidden="true"></i>`;
                cell5.innerHTML = "Distribuitorului: <b>" + element.clientName + "</b>";
                cell6.innerHTML = "Email : " + element.clientEmail;
                cell7.innerHTML = ` <button class="btn btn-success" type="button" onclick="processLead('${element.id}','${element.clientEmail}','${element.clientName}','${element.phone}','${element.agentEmail}')" >Trimite lead</button> 
                 <button class="btn btn-danger" type="button" onclick="deleteLead('${element.id}')" >Sterge lead</button>`;
});



}