import React from 'react';
import './PageAccueil.css';
import Formulaire from './PageInscription';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom' /* Moyen de changer de page react*/ 

const Home = ()=>( /* Max tu ecrira la Page d'accueil ici avec une class pour ton formulaire pour les differents liens fait comme j'ai fait avec le link */
  <div>
    <Link className="btn" to={'/PageInscription'}>S'incrire</Link>
    
  </div>
  
)
/*Donc pour la Balise Link voici le lien où je l'ai trouve : https://openclassrooms.com/fr/courses/4555591-creer-un-petit-jeu-de-role-avec-reactjs/4555606-concevoir-le-layout-de-notre-application?status=waiting-for-publication
J'arrive jamais à explique les concepts desole !!! Normalement tu as besoin de rien rajouter car j'ai tous fait(j'ai installer les dependances liées au Link Route Routeur )  a part les balises bien evidemment */

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