import React from 'react';
import history from './history';
import PageAccueil from './PageAccueil';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

class Event extends React.Component{
  constructor(props){
    super(props);
    this.state={
      liste:[]
    }
  }
  render(){
    return(<h1>Liste Event</h1>);
  }
}

class Carte extends React.Component{
  constructor(props){
    super(props);
    this.state={
      liste:[]
    }
  }
  render(){
    return(<h1>Carte</h1>);
  }
  
}

class Aime extends React.Component{
  constructor(props){
    super(props);
    this.state={
      liste:[]
    }
  }
  render(){
    return(<h1>Liste Aime</h1>);
  }
}

class Article extends React.Component{
  constructor(props){
    super(props);
    this.state={
      liste:[]
    }
  }
  render(){
    return(<h1>Liste Article</h1>);
  }
}

class Participe extends React.Component{
  constructor(props){
    super(props);
    this.state={
      liste:[]
    }
  }
  render(){
    return(<h1>Liste Participe</h1>);
  }
}

class Accueil extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id:this.props.id,
      estEvent:true,
      estCarte:false,
      estAime:false,
      estArticle:false,
      estParticpe:false
    }
  }

  passEvent (){
      this.setState({
        estEvent:true,
        estCarte:false,
        estAime:false,
        estArticle:false,
        estParticpe:false
      });
  }
  passCarte (){
    this.setState({
      estEvent:false,
      estCarte:true,
      estAime:false,
      estArticle:false,
      estParticpe:false
    });
  }
  passAime (){
    this.setState({
      estEvent:false,
      estCarte:false,
      estAime:true,
      estArticle:false,
      estParticpe:false
    });
  }
  passArticle (){
    this.setState({
      estEvent:false,
      estCarte:false,
      estAime:false,
      estArticle:true,
      estParticpe:false
    });
  }

  passParticipe(){
    this.setState({
      estEvent:false,
      estCarte:false,
      estAime:false,
      estArticle:false,
      estParticpe:true
    });
  }

  render(){
   

    return (
    <div>
        <h1>Accueil</h1>
        <input type="text" placeholder="Recherche tag"/>
        <nav class="navbar navbar-inverse">
          <ul class="nav navbar-nav">
              <div class="container-fluid">
              <button class="btn btn-primary navbar-btn" onClick={this.passEvent.bind(this)}>Crée Event</button>
                <button class="btn btn-primary navbar-btn" onClick={this.passArticle.bind(this)}> Crée Article</button>
                <button class="btn btn-link navbar-btn" onClick={this.passEvent.bind(this)}>Event</button>
                <button class="btn btn-link navbar-btn" onClick={this.passArticle.bind(this)}>Article</button>
                <button class="btn btn-link navbar-btn" onClick={this.passParticipe.bind(this)}>Je participe</button>
                <button class="btn btn-link navbar-btn" onClick={this.passAime.bind(this)}>J'aime</button>
                <button class="btn btn-link navbar-btn" onClick={this.passCarte.bind(this)}>Carte</button>
              </div>
          </ul>
        </nav>

        <div>
              {this.state.estEvent&& <Event id={this.state.id} />}
              {this.state.estCarte && <Carte/>}
              {this.state.estAime&& <Aime/>}
              {this.state.estArticle && <Article/>}
              {this.state.estParticpe && <Participe/>}
        </div>
    </div>);
  }
}

class Stat extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (<h1>Mes Statistique</h1>);
  }
}

class Param extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (<h1>Parametre</h1>);
  }
}

class Menu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        EstStatistique : false,
        EstAccueil : true,
        EstParametre: false,
        name : this.props.name,
        id:this.props.id
      };
      
    }
   
    
    passAcc (){
      this.setState({
        EstAccueil : true,
        EstStatistique : false,
        EstParametre: false
    });
    }

    passStat (){
      this.setState({
        EstAccueil : false,
        EstStatistique : true,
        EstParametre: false
      });
    }

    passPara (){
      this.setState({
        EstAccueil : false,
        EstStatistique : false,
        EstParametre: true
      });
    }
    
    deco = e=>{
      const cookies = new Cookies();
      cookies.remove("user",{ path: '/PageConnecte' });
      history.push("/PageAccueil");
      window.location.reload();

    }
   
    render() {
      return (
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-3" >
              <nav class="nav flex-column">
                <button type="button" class="btn btn-link" onClick={this.passAcc.bind(this)}>Accueil</button>
                <button type="button" class="btn btn-link" onClick={this.passStat.bind(this)}>Statistique</button>
                <button type="button" class="btn btn-link" onClick={this.passPara.bind(this)}>Parametre</button>
                <button type="button" class="btn btn-link" onClick={this.deco.bind(this)}>deconnexion</button>
              </nav>
            </div>
            <div class = "col-md-6">
              {this.state.EstAccueil && <Accueil id={this.state.id} />}
              {this.state.EstStatistique && <Stat/>}
              {this.state.EstParametre && <Param/>}
            </div>
            <div class="col-sm-3">
                <h1>Profil</h1>
            </div>
          </div>
        </div>
       
      );
    }
  }

  

class PageConnecte extends React.Component{
  constructor(props){
    super(props)
    try{
      const cookies = new Cookies();
      this.state={
        ident : cookies.get("user").split(" ")[0],
        id :cookies.get("user").split(" ")[1]
      }
      
    }
    catch(err){
      history.push("/PageAccueil");
      window.location.reload();

    }
    
  }
  render(){
    const affichemenu = ()=>{
      return (<Menu name={this.state.ident} id={this.state.id}/>)
    }
    return(
      <Router>
      <div>
        <Route exact path="/PageConnecte" component={affichemenu}></Route>
        <Route exact path="/PageAccueil" component={PageAccueil}></Route>
      </div>
    </Router>
      
    );
      
    
  }
}


   
  export default PageConnecte;