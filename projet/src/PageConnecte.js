import React from 'react';
import Sidebar from "react-sidebar";
import history from './history';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import PageAccueil from './PageAccueil';
import Cookies from 'universal-cookie';






class Menu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        sidebarOpen: true,
        name : this.props.name
      };
      this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }
   
    onSetSidebarOpen(open) {
      this.setState({ sidebarOpen: open });
    }
    
    deco = e=>{
      const cookies = new Cookies();
      cookies.remove("user",{ path: '/PageConnecte' });
      history.push("/PageAccueil");
      window.location.reload();

    }
   
    render() {
      return (
        <Sidebar
          sidebar={<div>
            <b>Bonjour , {this.state.name} </b>
            <button onClick={this.deco.bind(this)}>Deconnexion</button>

          </div>
                    }
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { background: "white" } }}
        >
          <button onClick={() => this.onSetSidebarOpen(true)}>
            Open sidebar
          </button>
        </Sidebar>
      );
    }
  }

  

class PageConnecte extends React.Component{
  constructor(props){
    super(props)
    try{
      const cookies = new Cookies();
      this.state={
        ident : cookies.get("user").split("_")[0],
        id :cookies.get("user").split("_")[1]
      }
    }
    catch(err){
      history.push("/PageAccueil");
      window.location.reload();

    }
    
  }
  render(){
    const affichemenu = ()=>{
      return (<Menu name={this.state.ident}/>)
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