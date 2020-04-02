import React from 'react';
import './PageAccueil.css';
import Formulaire from './PageInscription';
import history from './history';/*MAX: J'ai créer un history.js, cela permet de changer de page sans utilisation de balise */
import { BrowserRouter as Router, Route, Link } from 'react-router-dom' /* Moyen de changer de page react*/ 



class SeConnecter extends React.Component{ 
  
state={
    pseudo : null,
    pwd : null,
    
  };

  change=e => {
    this.setState({
        [e.target.id] : e.target.value
        
    })
  }

  connect=e => {
    /*MAX: C'est ici que je  check que username et mdp soit bon, mais je vois pas trop comment faire encore (dans le sens: comment je cherche dans la bd si ok?) */
    /*history.push('/PageInscription')MAX: voici une utilisation de history.js */
    e.preventDefault();
     
    var request = new Request ('http://localhost:2100/prjt/Connexion',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)

    });
    fetch(request)
      .then(function(response){
          response.json()
          .then(function (data) {
            console.log(data);
            var mess = document.getElementById("message"); 
             mess.innerHTML = data.message;    
      })
      .catch(function (err){
        console.log(err);
      });
      
  });
}

  render(){
    return (
      <div class="col-md-12 mb-6" >
      <div class="card">
      <div class="card-body">
        <form onSubmit={this.connect.bind(this)}>
            <h1 class="text-center font-up font-bold deep-orange-text py-4">Connexion</h1>
            <div class="md-form">
                <label htmlFor="pseudo"> Identifiant</label>
                <input type ="text" id="pseudo" onChange={this.change}/>
            </div>
            <div class="md-form">
                <label htmlFor="pwd"> Mdp</label>
                <input type ="password" id="pwd" onChange={this.change}/>
            </div>
            <div class="md-form" id = "message">
              
            </div>
            <div class="text-center">
                <button class="btn btn-deep-orange" >Se Connecter<i class="fa fa-angle-double-right pl-2" aria-hidden="true"></i></button>
            </div>
            
            
        </form>
      </div>
      </div>
      </div>
     
    )
  }
}
const Home = ()=>( /* Max tu ecrira la Page d'accueil ici avec une class pour ton formulaire pour les differents liens fait comme j'ai fait avec le link */
  <div>
    <h1>Je sais c'est pas très beau pour l'instant :(</h1>

    <SeConnecter/>
    
    <Link className="btn" to={'/PageInscription'}>S'incrire</Link>
    
  </div>
  
)

/*Donc pour la Balise Link voici le lien où je l'ai trouve : https://openclassrooms.com/fr/courses/4555591-creer-un-petit-jeu-de-role-avec-reactjs/4555606-concevoir-le-layout-de-notre-application?status=waiting-for-publication
J'arrive jamais à explique les concepts desole !!! Normalement tu as besoin de rien rajouter car j'ai tous fait(j'ai installer les dependances liées au Link Route Routeur )  a part les balises bien evidemment 
Et pour repondre a de futur question (React n'est pas sur une seul page?) ,la reponse est oui et non car on a besoin d'autre page car on la divise en plusieur app mais les modif ne se font que sur une page (celle ou on est sans modif les autres ) */

class PageAccueil extends React.Component{
  
  render(){
    return (
      <Router>
      <div>
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/PageInscription" component={Formulaire}></Route>
      </div>
    </Router>
    )
  }
}

  export default PageAccueil;