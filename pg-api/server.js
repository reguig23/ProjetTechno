let express = require("express");
let bodyParser = require("body-parser");
let morgan = require("morgan");
let pg = require("pg");
const port = 2100;

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
  response.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.post('/prjt/Connexion',function(request,response)  {
  var pseudo = request.body.pseudo;
  var mdp =  request.body.pwd;
  pool.connect((err,db,done) => {
    if (err){
      return response.status(400).send(err);
    }
    else{
      db.query(" Select pwd from nguser where pseudo=$1  ",[pseudo],(err,table)=>{
        done();
        if (err){
          console.log("Erreur ici ")
          return response.status(400).send(err);
        }
        else {
          if (table.rows.length == 0){
           
            response.status(200).send({message : "Probleme Id" });
           
          }
          else {
            if ((String(table.rows[0].pwd).localeCompare(mdp))==0  ){
              
              response.status(200).send({message : "Connexion etablie "});
              

            }
            else {
              response.status(200).send({message : "Probleme mdp"});
              
              
            }
          }
          db.end();
          
         
          
        }
      })
    }
  });

});
app.post('/prjt/AjoutCompte',function(request,response)  {
  var pseud = request.body.pseudo;
  var name = request.body.nom;
  var prename = request.body.prenom;
  var email = request.body.email;
  var mdp = request.body.pwd;
  var codeP= request.body.cp;
  var pays = request.body.country;
  let values = [pseud,name,prename,email,mdp,codeP,pays];
  pool.connect((err,db,done) => {
  if (err){
    return response.status(400).send(err);
  }
  else{
    db.query("Insert into nguser VALUES (nextval('incCodeU'),$1,$2,$3,$4,$5,false,$6,$7) ",[... values],(err,table)=>{
      done();
      if (err){
        return response.status(400).send(err);
      }
      else {
        return console.log("Data Insered ");
        db.end();
        response.status(200).send({message : "Votre Inscription est Validé "});
      }
    })
  }
});

});
app.listen(port,()=> console.log("Port allume"));
