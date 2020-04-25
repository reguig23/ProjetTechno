import React from 'react';
import history from './history';
import PageAccueil from './PageAccueil';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

class Event extends React.Component{
  constructor(props){
    super(props);
    this.state={
      friends:this.props.friend,
      id:this.props.id
    }
  }

  
   
  render(){
    
    return(<div>
      <h1>Liste Event</h1>
    </div>);
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

class CreeEvent extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(<h1>Cree un Event</h1>);
  }
}

class CreeArticle extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(<h1>Cree un Article</h1>);
  }
}

class Accueil extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      friend : this.props.friend,
      id:this.props.id,
      estEvent:true,
      estCarte:false,
      estAime:false,
      estArticle:false,
      estParticpe:false,
      estCreeEvent:false,
      estCreeArticle:false
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

  passCev(){
    if (this.state.estCreeEvent){
      this.setState({
        estCreeEvent:false
      });
    }
    else{
      this.setState({
        estCreeEvent:true,
        estCreeArticle:false
      });
    }

  }

  passCAr(){
    if (this.state.estCreeArticle){
      this.setState({
        estCreeArticle:false
      });
    }
    else{
      this.setState({
        estCreeEvent:false,
        estCreeArticle:true
      });
    }
  }

  render(){
   

    return (
    <div>
        <h1>Accueil</h1>
        <input type="text" placeholder="Recherche tag"/>
        <nav className="navbar navbar-inverse">
          <ul className="nav navbar-nav">
              <div className="container-fluid">
              <button className="btn btn-primary navbar-btn" onClick={this.passCev.bind(this)}>Crée Event</button>
                <button className="btn btn-primary navbar-btn" onClick={this.passCAr.bind(this)}> Crée Article</button>
                <button className="btn btn-link navbar-btn" onClick={this.passEvent.bind(this)}>Event</button>
                <button className="btn btn-link navbar-btn" onClick={this.passArticle.bind(this)}>Article</button>
                <button className="btn btn-link navbar-btn" onClick={this.passParticipe.bind(this)}>Je participe</button>
                <button className="btn btn-link navbar-btn" onClick={this.passAime.bind(this)}>J'aime</button>
                <button className="btn btn-link navbar-btn" onClick={this.passCarte.bind(this)}>Carte</button>
              </div>
          </ul>
        </nav>
        <div>
              {this.state.estCreeEvent&& <CreeEvent id={this.state.id} />}
              {this.state.estCreeArticle && <CreeArticle/>}
        </div>
        <div>
              {this.state.estEvent&& <Event id={this.state.id} friend = {this.state.friend} />}
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
    this.state={
      id:this.props.id,
      pseudo: null,
      pwd : null,
      nom  : null,
      prenom : null,
      mail : null,
      country : null,
      cp : null

    }
  }

  componentDidMount() {
    var request = new Request ('http://localhost:2100/prjt/Informationuser',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
    });
    const self = this;
     fetch(request)
    .then(function(response){
      response.json()
      .then(function(data){
        self.setState({
          pseudo: data.info[0].pseudo,
          pwd : data.info[0].pwd,
          nom  : data.info[0].nom,
          prenom : data.info[0].prenom,
          mail : data.info[0].mail,
          country : data.info[0].country,
          cp : data.info[0].cp
          
        });
        
      })

    });
   
  }



  render(){
    return (<div>
        <h1>Parametre</h1>
        <p>{this.state.pseudo}</p>
    </div>);
  }
}

class Menu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        friend : this.props.friend,
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
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-3" >
              <nav className="nav flex-column">
                <button type="button" className="btn btn-link" onClick={this.passAcc.bind(this)}>Accueil</button>
                <button type="button" className="btn btn-link" onClick={this.passStat.bind(this)}>Statistique</button>
                <button type="button" className="btn btn-link" onClick={this.passPara.bind(this)}>Parametre</button>
                <button type="button" className="btn btn-link" onClick={this.deco.bind(this)}>deconnexion</button>
              </nav>
            </div>
            <div className = "col-md-6">
              {this.state.EstAccueil && <Accueil id={this.state.id} friend = {this.state.friend} />}
              {this.state.EstStatistique && <Stat id={this.state.id} />}
              {this.state.EstParametre && <Param id = {this.state.id} />}
            </div>
            <div className="col-sm-3">
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
        liste:[],
        ident : cookies.get("user").split(" ")[0],
        id :cookies.get("user").split(" ")[1]
      }
      
    }
    catch(err){
      history.push("/PageAccueil");
      window.location.reload();

    }
    
  }

  componentDidMount() {
    var request = new Request ('http://localhost:2100/prjt/Listeami',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
    });
    const self = this;
     fetch(request)
    .then(function(response){
      response.json()
      .then(function(data){
        console.log(data.friends);
        self.setState({liste: data.friends});
        
      })

    });
   
  }

  render(){
    const affichemenu = ()=>{
      return (<Menu friend = {this.state.liste} name={this.state.ident} id={this.state.id}/>)
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