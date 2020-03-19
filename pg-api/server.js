let express = require("express");
let bodyParser = require("body-parser");
let morgan = require("morgan");
let pg = require("pg");
const port = 3000;

let pool = new pg.Pool({
  port:5431,
  password:'ninjiniÉ"&ÇÇ!',
  database : 'naturegathering',
  max:10,
  host:"localhost",
  user:"postgres"
});



let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(morgan('dev'));
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.post('/prjt/naturegathering',function(request,response){
  console.log(request.body);
});
app.listen(port,()=> console.log("Port allume"));
