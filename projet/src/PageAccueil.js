import React from 'react';
import './PageAccueil.css';
import history from './history';/*MAX: J'ai créer un history.js, cela permet de changer de page sans utilisation de balise */
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom' /* Moyen de changer de page react*/ 
import PageConnecte from './PageConnecte';
import Cookies from 'universal-cookie';



class SeConnecter extends React.Component{ 

  state={
      pseudo : "",
      pwd : "",
      errors : []
      
  };

  showValidationErr(elm, msg) {
    this.setState((prevState) => ({
      errors: [
        ...prevState.errors, {
          elm,
          msg
        }
      ]
    }));
  }

  clearValidationErr(elm) {
    this.setState((prevState) => {
      let newArr = [];
      for (let err of prevState.errors) {
        if (elm != err.elm) {
          newArr.push(err);
        }
      }
      return {errors: newArr};
    });
  }

  change=e => {
    this.setState({
        [e.target.id] : e.target.value
    })
    this.clearValidationErr(e.target.id);
  }
  

  connect=(e) => {
    /*MAX: C'est ici que je  check que username et mdp soit bon, mais je vois pas trop comment faire encore (dans le sens: comment je cherche dans la bd si ok?) 
    /*MAX: voici une utilisation de history.js */
    e.preventDefault() ;

    var drap = true;
      if (this.state.pseudo.localeCompare("")==0) {
        drap = false;
        this.showValidationErr("pseudo", "Il manque le pseudo");
      }

      if (this.state.pwd.localeCompare("")==0) {
        drap = false;
        this.showValidationErr("pwd", "Insert password");
      }

      if (drap){
        var request = new Request ('http://localhost:2100/prjt/Connexion',{
          method:'POST',
          headers : new Headers({"Content-type" : "application/json"}),
          body : JSON.stringify(this.state)
        });

        fetch(request)
          .then(function(response){
              response.json()
              .then(function (data) {
                 
              
                  if ((data.message.localeCompare("Connexion etablie"))==0){   
                    const cookies = new Cookies();
                    cookies.set("user",data.pseudo+" "+data.id, { path: '/PageConnecte'});         
                    history.push("/PageConnecte");
                    window.location.reload();
                  } 
                  else{
                    var elem = document.getElementById(data.message);
                    elem.innerHTML = "Incorrect";
                
                  }
             
              })
              .catch(function (err){
                  console.log(err);
              });
            });
      
      }
  }

  render(){
    let pseudoErr = null,
        mdpErr = null
    
    for (let err of this.state.errors){
      if (err.elm == "pseudo") {
        pseudoErr = err.msg;
      }
      if (err.elm == "pwd") {
         mdpErr = err.msg;
      }
    }
    
    return (
      <div className="inner-container">
        <div className="header">
          Login
        </div>
        <div className="box">

          <div className="input-group">
            <label htmlFor="username">Identifiant</label>
            <input
              id="pseudo"
              type="text"
              name="username"
              className="login-input"
              placeholder="Username"
              onChange = {this.change}
              />
              <small id ="pseudoError" className="danger-error">{pseudoErr ? pseudoErr : "" } 
              </small>
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de Passe </label>
            <input
              id = "pwd"
              type="password"
              name="password"
              className="login-input"
              placeholder="Password"
              onChange = {this.change}
              />
              <small id ="pwdError" className="danger-error">{mdpErr ? mdpErr : "" } 
              </small>
          </div>

          <button
            type="button"
            className="login-btn"
            onClick={this
            .connect
            .bind(this)}>Login</button>
        </div>
      </div>
    )
  }
}

class Formulaire extends React.Component{
  state={
      pseudo : "",
      nom:"",
      prenom:"",
      email:"",
      pwd :"",
      cp :"",
      country : "",
      errors : []
  };

  showValidationErr(elm, msg) {
    this.setState((prevState) => ({
      errors: [
        ...prevState.errors, {
          elm,
          msg
        }
      ]
    }));
  }

  clearValidationErr(elm) {
    this.setState((prevState) => {
      let newArr = [];
      for (let err of prevState.errors) {
        if (elm != err.elm) {
          newArr.push(err);
        }
      }
      return {errors: newArr};
    });
  }

  change=e => {
      this.setState({
          [e.target.id] : e.target.value
          
      })
      this.clearValidationErr(e.target.id);
      
      
  }
  submit = e => {
      e.preventDefault();
      var drap = true;
      if (this.state.pseudo.localeCompare("")==0) {
        drap = false;
        this.showValidationErr("pseudo", "Il manque le pseudo");
      }
      if (this.state.email.localeCompare("")==0) {
        drap = false;
        this.showValidationErr("email", "Insere un email");
      }
      if (this.state.pwd.localeCompare("")==0) {
        drap = false;
        this.showValidationErr("pwd", "Insert password");
      }
      if (this.state.nom.localeCompare("")==0) {
        drap = false;
        this.showValidationErr("nom", "Insert nom");
      }
      if (this.state.prenom.localeCompare("")==0) {
        drap = false;
        this.showValidationErr("prenom", "Insert prenom");
      }
      if (this.state.cp.localeCompare("")==0) {
        drap = false;
        this.showValidationErr("cp", "Insert cp");
      }
      if (this.state.country.localeCompare("")==0) {
        drap = false;
        this.showValidationErr("country", "Insert pays");
      }
      if (drap){
          var request = new Request ('http://localhost:2100/prjt/AjoutCompte',{
            method:'POST',
            headers : new Headers({"Content-type" : "application/json"}),
            body : JSON.stringify(this.state)
      
          });

          fetch(request)
          .then(function(response){
              response.json()
              .then(function (data) {
  
                if (data.message == null){
                  var mess = data.constraint.split("_")[1];
                   var elem = document.getElementById(mess+"Error");
                   elem.innerHTML = "Il existe deja";
                  
                }
                
                
              })
          })
          .catch(function (err){
              console.log(err);
          });
      }
      
      
      


  }
  render(){
    let pseudoErr = null,
      mdpErr = null,
      emailErr = null,
      nomErr = null,
      prenErr = null,
      cpErr = null,
      countryErr = null;

      for (let err of this.state.errors){
        if (err.elm == "pseudo") {
          pseudoErr = err.msg;
        }
        if (err.elm == "pwd") {
          mdpErr = err.msg;
        }
        if (err.elm == "email") {
          emailErr = err.msg;
        }
        if (err.elm == "nom") {
          nomErr = err.msg;
        }
        if (err.elm == "prenom") {
          prenErr = err.msg;
        }
        if (err.elm == "cp") {
          cpErr = err.msg;
        }
        if (err.elm == "country") {
          countryErr = err.msg;
        }
      }

      return (
      
        <div className="inner-container">
        <div className="header">
          S'inscrire
        </div>
        <div className="box">

          <div className="input-group">
            <label htmlFor="username">Identifiant</label>
            <input
              id="pseudo"
              type="text"
              name="username"
              className="login-input"
              placeholder="Username"
              onChange = {this.change}
              />
               <small id ="pseudoError" className="danger-error">{pseudoErr ? pseudoErr : "" } 
              </small>
          </div>

          <div className="input-group">
            <label htmlFor="password">Mot de Passe</label>
            <input
              id="pwd"
              type="mdp"
              name="mdp"
              className="login-input"
              placeholder="mdp"
              onChange={this.change}
              />
              <small className="danger-error">{mdpErr ? mdpErr : "" } 
              </small>
          </div>

          <div className="input-group">
            <label htmlFor="nom">Nom</label>
            <input
              id="nom"
              type="text"
              name="nom"
              className="login-input"
              placeholder="nom"
              onChange = {this.change}
              />
               <small className="danger-error">{nomErr ? nomErr : "" } 
              </small>
          </div>

          <div className="input-group">
            <label htmlFor="prenom">Prenom</label>
            <input
              id="prenom"
              type="text"
              name="prenom"
              className="login-input"
              placeholder="prenom"
              onChange={this.change}
              />
               <small className="danger-error">{prenErr ? prenErr : "" } 
              </small>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
            id ="email" 
            type="text" 
            name="email" 
            className="login-input" 
            placeholder="email"
            onChange={this.change}
            />
            <small id="mailError" className="danger-error">{emailErr ? emailErr : "" } 
              </small>
          </div>

          <div className="input-group">
            <label htmlFor="cp">Code Postal</label>
            <input
              id="cp"
              type="text"
              name="cp"
              className="login-input"
              placeholder="cp"
              onChange={this.change}
              />
               <small className="danger-error">{cpErr ? cpErr : "" } 
              </small>

          </div>

          <div className="input-group">
            <label htmlFor="country">Pays</label>
            <input
              id="country"
              type="text"
              name="country"
              className="login-input"
              placeholder="pays"
              onChange={this.change}
              />
               <small className="danger-error">{countryErr ? countryErr : "" } 
              </small>
          </div>

          
          <button
            type="button"
            className="login-btn"
            onClick={this
            .submit
            .bind(this)}>S'inscrire</button>
        </div>
      </div>
          
      )
  }

}


class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: true,
      isRegisterOpen: false
    };
  }
  showLoginBox() {
    this.setState({isLoginOpen: true, isRegisterOpen: false});
  }

  showRegisterBox() {
    this.setState({isRegisterOpen: true, isLoginOpen: false});
  }

  render(){

    return (
      <div>
       
        <div className = "root-container">
        <h1> Nature Gathering </h1>
        <div  className ="box-controller">
        <div className={"controller " + (this.state.isLoginOpen
         ? "selected-controller"
         : "")}
         onClick={this
         .showLoginBox
         .bind(this)}>
              Se connecter 
          </div>
          <div className={"controller " + (this.state.isRegisterOpen
         ? "selected-controller"
         : "")}
         onClick={this
         .showRegisterBox
         .bind(this)}>
                S'inscrire
          </div>
        </div>
          
            <div className= "box-container">
            {this.state.isLoginOpen && <SeConnecter/>}
            {this.state.isRegisterOpen && <Formulaire/>}

            </div>

        </div>

      </div>
    );
  }
}

/*Donc pour la Balise Link voici le lien où je l'ai trouve : https://openclassrooms.com/fr/courses/4555591-creer-un-petit-jeu-de-role-avec-reactjs/4555606-concevoir-le-layout-de-notre-application?status=waiting-for-publication
J'arrive jamais à explique les concepts desole !!! Normalement tu as besoin de rien rajouter car j'ai tous fait(j'ai installer les dependances liées au Link Route Routeur )  a part les balises bien evidemment 
Et pour repondre a de futur question (React n'est pas sur une seul page?) ,la reponse est oui et non car on a besoin d'autre page car on la divise en plusieur app mais les modif ne se font que sur une page (celle ou on est sans modif les autres ) */

class PageAccueil extends React.Component{

    
  render(){
    
    
    return (
        <Router>
            <div>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/PageConnecte" component={PageConnecte}></Route>
          </div>
        </Router>
         
      
     
    )
  }
}

  export default PageAccueil;