let BASE_URL = 'http://192.168.1.69:8080';
// urls used to access the API 
let url = `${BASE_URL}/leads/select`;
let clientsUrl = `${BASE_URL}/nav/leads/clients`;
let paramUrl = `${BASE_URL}/nav/leads/clients/selection`;
let dataEmailUrl = `${BASE_URL}/leads/email`;
let dataSMSUrl = `${BASE_URL}/leads/sms`;
let webImportUrl = `${BASE_URL}/wp/get`;












let removeLocalData = async () => {

    if(localStorage.getItem('lead')){ localStorage.removeItem('lead'); }
    if(localStorage.getItem('client')){ localStorage.removeItem('client');}

}




// gets data from the API for leads and clients 
let fetchDataFromAPI = async () => {

    
                // loadingTables(true);

                // we query for leads
                await queryAPI(url, 'GET', '',(err, data)=>{
                    if(err) console.log(err);
                    
                   
                        let convertedData = JSON.stringify(data);
                        localStorage.setItem('leadsData', convertedData);
                    

                });

                // then we query for clients 
                await queryAPI(clientsUrl, 'GET', '', (err, data)=>{

                    if(err) console.log(err);

               
                        let convertedData = JSON.stringify(data);
                        localStorage.setItem('clientsData', convertedData);
               


                });

            await renderTables();
            // loadingTables(false);
}







let renderTables = async () => {

                   
                   
                    const clientsTable =  $('#clientsTable').DataTable({
                        "lengthChange": false,
                        "pageLength" : 50,
                        "scrollY": "600px",
                        "deferRender" : true,
                        "columnDefs"  : [ {'targets': 0, 'searchable': false} ]
                    
                    }).clear().draw();



                   
                    
                    


                    // extracting data from localstorage clients and adding rows inside datatable
                    
                    JSON.parse(localStorage.getItem('clientsData')).forEach(async (element)=>{
                        
                        let count = 1;
                    
                            clientsTable.row.add([
                            `<button type="button" class="btn btn-success btn-sm" onclick="changeBtn(this.id);" id="${element.No}">Aplica</button>`,
                            element.Name,
                            element._x003C_Judet_x003E_,
                            element.Post_Code,

                        ]);

                    count++;
                

                    });

                    clientsTable.draw();



      

}


removeLocalData();
fetchDataFromAPI();
displayCurrentConnections();


// simulating the pressed button on lead 
localStorage.setItem('lead', leadID);
console.log(leadID);