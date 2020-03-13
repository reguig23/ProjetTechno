import React from 'react';
import './PageAccueil.css';
import Formulaire from './PageInscription';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom' /* Moyen de changer de page react*/ 

class SeConnecter extends React.Component{ /* Regarde mon formulaire est fait pareil et trouve un moyen pour la fonction submit si c'est bon alors on change de page et si c'est faux alors on rajoute un texte en rouge iden ou mdp incorrect  */

}
const Home = ()=>( /* Max tu ecrira la Page d'accueil ici avec une class pour ton formulaire pour les differents liens fait comme j'ai fait avec le link */
  <div>
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