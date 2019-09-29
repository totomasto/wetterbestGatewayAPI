const express = require('express') // express
const axios = require('axios') //make requests at the real API 
const controller = require('./controllers');
const reportController = require('./controllers/reports.js');
const bodyParser = require('body-parser');
let path = require('path');

// for slack 
require('dotenv').config();
const request = require("request");
// end slack 


let cors = require('cors');

let app = express();
let port = process.env.port || 80;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.listen(port, ()=>{ console.log(`Gateway running on : http://localhost:${port}`) });


// setting template 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.get('/',(req,res)=>{ res.send('Gateway online');  });



app.get('/check', (req,res)=>{ insertLogsToSlack('Up and running');});

app.get('/leads/select/:email', (req, res)=>{
	console.log('Req was received')
	controller.getAllLeads(req.params.email,(err, leads)=>{
		res.send(leads);

	});

})


app.get('/index/:leadid', (req, res)=> { 
		
		controller.getLead(req.params.leadid ,(err, lead)=>{
					
			controller.getClients((err, clients)=>{

				// console.log(clients.data);
					res.render('leader', {lead : lead.data[0], clients : clients.data});
			
			});
				
		});
		
});



app.post('/leads/insert', async(req, res)=>{ 
   
    controller.requestInsertOfLead(req.body,(err, result) => { 
        //  console.log(req.body);
          if(err){ 
          	insertLogsToSlack(`Error at insertion of lead from Gateway to API -> ${err}`);
              console.log(err); 
            } else {
            	insertLogsToSlack('Inserted lead succesfully from Gateway to API ');
                 res.redirect('http://lead.wetterbest.ro/process.html'); 
                } 
     });
   
});


app.post('/wpdb', (req, res)=>{

console.log(req.body);
res.sendStatus(200);


});


// Update cu succes pentru mail 
app.get('/leads/insert/status/success/:name', (req,res)=>{ res.sendFile(path.join(__dirname + '/public/email/success.html'));});
app.post('/leads/insert/status/success/:name', (req, res)=>{ console.log(req.body); console.log(req.params);
 controller.requestUpdateOfLead(req.params.name,req.body.fact, (err, result)=>{
		if(err) { console.log(err); insertLogsToSlack(`At email press of the success button this error was issued -> ${err} `); } 
		// res.sendStatus(200);
		insertLogsToSlack('At email press of the success button everything worked correctly');
		res.send('Informatiile au fost transmise cu succes');

	}); 
});


// Update cu fail pentru mail 

app.get('/leads/insert/status/fail/:name', (req,res)=>{ res.sendFile(path.join(__dirname + '/public/email/fail.html'));});
app.post('/leads/insert/status/fail/:name', (req, res)=>{ console.log(req.body); console.log(req.params);
 controller.requestUpdateOfLeadFailed(req.params.name,req.body.fact, (err, result)=>{
		if(err) { console.log(err); insertLogsToSlack(`At email press of the fail button this error was issued -> ${err} `); } 
		// res.sendStatus(200);
		insertLogsToSlack('At email press of the fail button everything worked correctly');
		res.send('Informatiile au fost transmise cu succes');

	}); 
});

// Update cu in asteptare pentru mail 
app.get('/leads/insert/status/wait/:name', (req,res)=>{ 

	 controller.requestUpdateOfLeadWait(req.params.name, (err, result)=>{
		if(err) { console.log(err); insertLogsToSlack(`At email press of the wait button this error was issued -> ${err} `); } 
		// res.sendStatus(200);
		insertLogsToSlack('At email press of the wait button everything worked correctly');
		res.send('Informatiile au fost transmise cu succes');

	}); 

});




//////////////////////////////////////////////////////////// WETTERBEST APP ////////////////////////////////////////////////////////////


app.get('/wtb/lead/update/:name/:status/:reason', (req, res)=>{
	console.log('Update req was received');
if(req.params.status === 'Finalizat'){
	console.log(req.params.name,req.params.status, req.params.reason);
	controller.requestUpdateOfLead(req.params.name,req.body.fact, (err, result)=>{
		if(err) res.sendStatus(404);
		res.sendStatus(200);
	}); 
	
} else if(req.params.status === 'Pierdut'){
	console.log(req.params.name,req.params.status, req.params.reason);
	

	controller.requestUpdateOfLeadFailed(req.params.name,req.body.reason, (err, result)=>{
		if(err) res.sendStatus(404);
		res.sendStatus(200);
	}); 
} else if(req.params.status === 'In asteptare'){
	console.log(req.params.name,req.params.status, req.params.reason);
	controller.requestUpdateOfLeadWait(req.params.name, (err, result)=>{
	if(err) res.sendStatus(404);
		res.sendStatus(200);
	});
	
}


});

app.post('/wtb/reseller/check', (req, res)=>{
	controller.requestResellerCheck(req.body.cif,(err, result)=>{
		if(err) { console.log(err); res.sendStatus(500);
		} else { 
			res.send(result);
		}
	});
});


app.get('/wtb/reseller/signup/:email', (req, res)=>{

		controller.sendLinkToResseler(req.params.email, (err, result)=>{
			if(err) { console.log(err); res.sendStatus(500);
			} else {
				res.sendStatus(200);
			}

		})

});








//////////////////////////////////////////////////////////// END WETTERBEST APP ////////////////////////////////////////////////////////////



// SLACK 

app.post('/status', (req, res) => {


controller.checkStatus((err, result)=>{

	// if(err) console.log(err);

request.post('https://slack.com/api/chat.postMessage', result, function (error, response, body) {
      // Sends welcome message
      if(error) console.log(error);
      console.log(body);
      res.json();
    });
});

});


app.post('/leads/report/all', async (req, res)=>{

await reportController.downloadAllData((err, result)=>{ });


}) 



let insertLogsToSlack = async (log) => { 

		var SlackWebhook = require('slack-webhook')
		 
		var slack = new SlackWebhook(process.env.SLACK_WEB_HOOK_LOGS);

		slack.send(log);

		return 

} 

	





// END SLACK 






/// CORTINA PRODUSE FORMULAR


app.get('/cortina/form/products', (req,res)=>{
console.log('Connection from Cortina Form was received');

controller.getCortinaProductsFromDB((err,result)=>{

if(err) res.sendStatus(400);
res.send(result);



     });




});




app.get('/cortina/priceApp/prices', (req, res)=>{

	console.log('Cortina price app is requesting the price list');

	controller.getCortinaPriceListFromDB((err, result)=>{
		if(err) res.sendStatus(400);
		res.send(result);
	})

});


app.get('/cortina/priceApp/clients', (req,res)=>{
	console.log('Cortina price app is requesting the clients list');

	controller.getCortinaClientsListFromDB((err, result)=>{
		if(err) res.sendStatus(400);
		res.send(result);
	})
})








// END CORTINA




















