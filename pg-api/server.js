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
      db.query(" Select codeu,pseudo,pwd from nguser where pseudo=$1  ",[pseudo],(err,table)=>{
        done();
        if (err){
          console.log("Erreur ici ")
          return response.status(400).send(err);
        }
        else {
          if (table.rows.length == 0){

            response.status(200).send({message : "pseudoError" });

          }
          else {
            if ((String(table.rows[0].pwd).localeCompare(mdp))==0  ){
     
              response.status(200).send({ message : "Connexion etablie", pseudo : String(table.rows[0].pseudo), id : String(table.rows[0].codeu) });
              


            }
            else {
              response.status(200).send({message : "pwdError"});


            }
          }
          



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
      return response.status(400).send({error : err});
    }
    else{
          db.query("Insert into nguser VALUES (nextval('incCodeU'),$1,$2,$3,$4,$5,false,$6,$7) ",[... values],(err,table)=>{
          done();
          if (err){
            return response.status(400).send(err);
          }
          else{
              response.status(200).send({ message : "Votre Inscription est Validé "});
              db.end();
          }
        })
    }
  })
});

app.post('/prjt/Listeami',function(request,response){
  var pseud = request.body.id;
  pool.connect((err,db,done) =>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("select codeu2 from friends where codeu1=$1",[pseud],(err,table)=>{
        done();
        if(err){
          console.log("Erreur Ici")
          console.log(err);
          return response.status(400).send(err);
        }
        else{
          var liste=[pseud];
          for(var i=0 ; i<table.rows.length;i++){
            table.rows[i]=table.rows[i].codeu2.split(" ")[0] 
          }

          response.status(200).send({friends : table.rows});
          
        }
      })
    }
    
  })

});

app.post('/prjt/Informationuser',function(request,response){
  var id = request.body.id;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("select * from nguser where codeu=$1",[id],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          response.status(200).send({info : table.rows});
        }
      })
    }
    
  })
});

app.post('/prjt/ModifTable',function(request,response){
  var tb = request.body.table;
  var new_data = request.body.new;
  var id = request.body.id;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("UPDATE nguser SET "+tb+"= $1 where codeu = $2  ",[new_data,id],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          response.status(200).send({message : true});
        }
      })
    }
    
  })
})

app.post('/prjt/ListEventfriend',function(request,response){
  var friends = request.body.friends;
  var requete = "select codeE from event where creatorE IN (";
  for (var i = 0;i<friends.length;i++){
      if( i == friends.length-1 ){
        requete=requete+"$"+(i+1)+");";
      }
      else{
        requete=requete+"$"+(i+1)+",";
      }   
  }
  
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query(requete,friends,(err,table)=>{
        done();
        if(err){
          console.log(err);
          return response.status(400).send(err);
        }
        else{
          if(table.rows.length == 0){
            return response.status(200).send({EvenPre : false} );
          }
          else{
            for(var i=0 ; i<table.rows.length;i++){
              table.rows[i]=table.rows[i].codee.split(" ")[0] 
            }
            response.status(200).send({EvenPre : true , Event : table.rows } );
          }
        }
      })
    }
    
  })
  


})

app.post('/prjt/EvenParid',function(request,response){
  var id = request.body.id;
  
  pool.connect((err,db,done)=>{
    if(err){
      
      return response.status(400).send({error : err});
    }
    else{
      db.query("Select * from event where codee = $1",[id],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({Titre : table.rows[0] } );
        }
      })
    }
    
  })
})

app.post('/prjt/Nblike',function(request,response){
  var idEvent = request.body.id;
  var idUtil = +request.body.idUtil;
  var alike = false;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Select codeu from likee where codee = $1  ",[idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          for(var i=0 ; i<table.rows.length;i++){

            var idLike= +table.rows[i].codeu.split(" ")[0];
            if(idLike == idUtil){
              alike = true;
            }
          }
          response.status(200).send({nb : table.rows.length , ALike : alike }  );
        }
      })
    }
  })
})

app.post('/prjt/Delike',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Delete  from likee where codeu = $1 and codee =$2 ",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : false}  );
        }
      })
    }
  })
})

app.post('/prjt/Delike2',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Delete  from aime where codeu = $1 and codeen =$2  and type='event'",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : false}  );
        }
      })
    }
  })
})

app.post('/prjt/Like',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Insert INTO likee  VALUES ($1,$2)",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : false}  );
        }
      })
    }
  })
})

app.post('/prjt/Like2',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Insert INTO AIME  VALUES ($1,$2,'event')",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : false}  );
        }
      })
    }
  })
})
  
app.post('/prjt/NbParticipant',function(request,response){
  var idEvent = request.body.id;
  var idUtil = +request.body.idUtil;
  var aParticipate = false;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Select codeu from participate where codee = $1",[idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          for(var i=0 ; i<table.rows.length;i++){

            var idLike= +table.rows[i].codeu.split(" ")[0];
            if(idLike == idUtil){
              aParticipate= true;
            }
          }
          response.status(200).send({nb : table.rows.length , ALike : aParticipate }  );
        }
      })
    }
  })
})

app.post('/prjt/JeParticipe',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Insert INTO participate  VALUES ($1,$2)",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : true}  );
        }
      })
    }
  })
})

app.post('/prjt/JeparticipePas',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Delete  from participate where codeu = $1 and codee =$2 ",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : false}  );
        }
      })
    }
  })
})

app.post('/prjt/NbComm',function(request,response){
  var EventId= request.body.id;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("select codec ,codeu from comevent where codee =$1; ",[EventId],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          for(var i=0 ; i<table.rows.length;i++){

            table.rows[i]= [table.rows[i].codeu.split(" ")[0], table.rows[i].codec.split(" ")[0]];
           
           
          }
          
          response.status(200).send({nbComment : table.rows.length , liste : table.rows}  );
        }
      })
    }
  })
})

app.post('/prjt/LeComm',function(request,response){
  var EventId= request.body.idEvent;
  var UtilId=request.body.idUtil ;
  var idCo=request.body.idComen ;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("select pseudo , commentaire,dateC,heureC  from (nguser inner join comevent on nguser.codeu=comevent.codeu)  inner join COM on COM.codec = comevent.codec where nguser.codeu=$1 and comevent.codee=$2 and COM.codec=$3 ;",[ UtilId,EventId,idCo],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({info : table.rows[0]}  );
        }
      })
    }
  })
})

app.post('/prjt/AjoutComm',function(request,response){
  var commentaire= request.body.write;
  
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Insert INTO COM  VALUES (nextval('incCodeC'),$1,DEFAULT,DEFAULT);",[ commentaire],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : 1}  );
        }
      })
    }
  })
})

app.post('/prjt/IdComm',function(request,response){
  
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("select codec from COM ORDER BY datec DESC , heurec DESC;",[ ],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : table.rows[0].codec}  );
        }
      })
    }
  })
})

app.post('/prjt/AjoutEventComm',function(request,response){
  var idUtil=request.body.idUtil;
  var idEvent=request.body.id;
  var idComment=request.body.newCommId;
  
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("INSERT INTO COMEVENT VALUES($1,$2,$3);",[ idEvent,idComment,idUtil],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : 1}  );
        }
      })
    }
  })
})

app.post('/prjt/ListNewfriend',function(request,response){
  var friends = request.body.friends;
  var requete = "select codeN from news where creatorN IN (";
  for (var i = 0;i<friends.length;i++){
      if( i == friends.length-1 ){
        requete=requete+"$"+(i+1)+");";
      }
      else{
        requete=requete+"$"+(i+1)+",";
      }   
  }
  
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query(requete,friends,(err,table)=>{
        done();
        if(err){
          console.log(err);
          return response.status(400).send(err);
        }
        else{
          if(table.rows.length == 0){
            return response.status(200).send({EvenPre : false} );
          }
          else{
            for(var i=0 ; i<table.rows.length;i++){
              table.rows[i]=table.rows[i].coden.split(" ")[0] 
            }
            response.status(200).send({newsPre : true , news : table.rows } );
          }
        }
      })
    }
    
  })
})

app.post('/prjt/newsParid',function(request,response){
  var id = request.body.id;
  
  pool.connect((err,db,done)=>{
    if(err){
      
      return response.status(400).send({error : err});
    }
    else{
      db.query("Select * from news where coden = $1",[id],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({Titre : table.rows[0] } );
        }
      })
    }
    
  })
})

app.post('/prjt/NblikeNew',function(request,response){
  var idEvent = request.body.id;
  var idUtil = +request.body.idUtil;
  var alike = false;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Select codeu from LIKEN where coden = $1  ",[idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          for(var i=0 ; i<table.rows.length;i++){

            var idLike= +table.rows[i].codeu.split(" ")[0];
            if(idLike == idUtil){
              alike = true;
            }
          }
          response.status(200).send({nb : table.rows.length , ALike : alike }  );
        }
      })
    }
  })
})

app.post('/prjt/DelikeNew',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Delete  from liken where codeu = $1 and coden =$2 ",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : false}  );
        }
      })
    }
  })
})

app.post('/prjt/DelikeNew2',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Delete  from aime where codeu = $1 and codeen =$2 and type='news' ",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : false}  );
        }
      })
    }
  })
})

app.post('/prjt/LikeNew',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Insert INTO liken  VALUES ($1,$2)",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : false}  );
        }
      })
    }
  })
})

app.post('/prjt/LikeNew2',function(request,response){
  var idEvent = request.body.id;
  var idUtil = request.body.idUtil;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("Insert INTO aime  VALUES ($1,$2,'news')",[idUtil,idEvent],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : false}  );
        }
      })
    }
  })
})

app.post('/prjt/NbCommNew',function(request,response){
  var EventId= request.body.id;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("select codec ,codeu from COMNEWS where coden =$1; ",[EventId],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          for(var i=0 ; i<table.rows.length;i++){

            table.rows[i]= [table.rows[i].codeu.split(" ")[0], table.rows[i].codec.split(" ")[0]];
           
           
          }
          
          response.status(200).send({nbComment : table.rows.length , liste : table.rows}  );
        }
      })
    }
  })
})



app.post('/prjt/AjoutNewComm',function(request,response){
  var idUtil=request.body.idUtil;
  var idEvent=request.body.id;
  var idComment=request.body.newCommId;
  
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
      return response.status(400).send({error : err});
    }
    else{
      db.query("INSERT INTO COMNEWS VALUES($1,$2,$3);",[ idEvent,idComment,idUtil],(err,table)=>{
        done();
        if(err){
          console.log(err);
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : 1}  );
        }
      })
    }
  })
})

app.post('/prjt/LeCommNew',function(request,response){
  var EventId= request.body.idEvent;
  var UtilId=request.body.idUtil ;
  var idCo=request.body.idComen ;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("select pseudo , commentaire,dateC,heureC  from (nguser inner join comnews on nguser.codeu=comnews.codeu)  inner join COM on COM.codec = comnews.codec where nguser.codeu=$1 and comnews.coden=$2 and COM.codec=$3 ;",[ UtilId,EventId,idCo],(err,table)=>{
        done();
        if(err){
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({info : table.rows[0]}  );
        }
      })
    }
  })
})

app.post('/prjt/ListEventParticipate',function(request,response){
  var id = request.body.id;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("select codee from participate where codeu=$1 ;",[id],(err,table)=>{
        done();
        if(err){
          
          return response.status(400).send(err);
        }
        else{
          if(table.rows.length == 0){
            return response.status(200).send({EvenPre : false,Event : []} );
          }
          else{
            for(var i=0 ; i<table.rows.length;i++){
              table.rows[i]=table.rows[i].codee.split(" ")[0] 
            }
            response.status(200).send({EvenPre : true , Event : table.rows } );
          }
        }
      })
    }  
  })
})

app.post('/prjt/UtilLike',function(request,response){
  var id = request.body.id;
  pool.connect((err,db,done)=>{
    if(err){
      return response.status(400).send({error : err});
    }
    else{
      db.query("select codeen , type from aime where codeu=$1 ; ",[id],(err,table)=>{
        done();
        if(err){
          
          return response.status(400).send(err);
        }
        else{
            const liste= [];
            for(var i =0;i<table.rows.length;i++){
              liste.push([i,table.rows[i].codeen.split(" ")[0],table.rows[i].type.split(" ")[0]])
            }
           
            response.status(200).send({liste : liste} );
          
        }
      })
    }  
  })
})

app.post('/prjt/AjoutEvent',function(request,response){
  var id=request.body.id;
  var nom = request.body.nom;
  var description = request.body.description;
  var  date =  request.body.date;
  var heure=request.body.heure;
  var lat=request.body.lat;
  var lng=request.body.long;
  console.log(lat);
  console.log(lng);
  pool.connect((err,db,done)=>{
    if(err){
      console.log(err);
      return response.status(400).send({error : err});
    }
    else{
      db.query("INSERT INTO EVENT VALUES(nextval('incCodeE'),$1,$2,DEFAULT,DEFAULT,$3,$4,NULL,TRUE,$5,$6,$7);",[ nom,description,date,heure,id,lat,lng],(err,table)=>{
        done();
        if(err){
          console.log(err);
          return response.status(400).send(err);
        }
        else{
          
          response.status(200).send({message : "Event ajoute"}  );
        }
      })
    }
  })
})



app.listen(port,()=> console.log("Port allume"));
