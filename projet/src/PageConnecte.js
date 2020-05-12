import React from 'react';
import history from './history';
import PageAccueil from './PageAccueil';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from 'react-google-maps';
import Geocode from 'react-geocode';

class LisComEvent extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      idUtil : this.props.idUtil,
      idEvent : this.props.idevent,
      idComen : this.props.idCom,
      pseudo : "",
      decription : "",
      date:"",
      heure:""
    }
  }

  componentDidMount(){
    var request = new Request ('http://localhost:2100/prjt/LeComm',{
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
          pseudo : data.info.pseudo,
          description : data.info.commentaire,
          date : data.info.datec.substring(0, 10).split(":")[0],
          heure: data.info.heurec.split(".")[0]
        }) 
          
        })
    })

  }

  render(){
    return (
      <div className="media">
          
        
          <div className="media-body">
            <h4 className="media-heading user_name">{this.state.pseudo}</h4>
              {this.state.description}
              
          </div>
          <p className="pull-left"><small>{this.state.date}:{this.state.heure}</small></p>
      </div>
    )
  }
}

class CommEvent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      idUtil:this.props.idUtil,
      id: this.props.id,
      Commentaire : [],
      nbCom : null,
      write:"",
      newCommId:""
    }
    
  }
  componentDidMount(){
    var request = new Request ('http://localhost:2100/prjt/NbComm',{
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
            nbCom : data.nbComment,
            Commentaire: data.liste
          }) 
        })
    })
}

  

AjoutComm= e=>{
  e.preventDefault() ;
  var request = new Request ('http://localhost:2100/prjt/AjoutComm',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
    });
    const self = this;
    fetch(request)
        .then(function(response){
          response.json()
        .then(function(data){
          if(data.message==1){
            var request = new Request ('http://localhost:2100/prjt/IdComm',{
              method:'POST',
              headers : new Headers({"Content-type" : "application/json"}),
              body : JSON.stringify(self.state)
            });
            fetch(request)
                .then(function(response){
                  response.json()
                .then(function(data){
                  self.setState({
                    newCommId : data.message,
                    
                  }) 
                  var request = new Request ('http://localhost:2100/prjt/AjoutEventComm',{
                      method:'POST',
                      headers : new Headers({"Content-type" : "application/json"}),
                      body : JSON.stringify(self.state)
                  });
                  fetch(request)
                      .then(function(response){
                          response.json()
                          .then(function(data){
                            console.log(data);
                            var request = new Request ('http://localhost:2100/prjt/NbComm',{
                                method:'POST',
                                headers : new Headers({"Content-type" : "application/json"}),
                                body : JSON.stringify(self.state)
                            });
    
                              fetch(request)
                                .then(function(response){
                                  response.json()
                                  .then(function(data){
                                    self.setState({
                                        nbCom : data.nbComment,
                                        Commentaire: data.liste
                                    }) 
                                  })
                                })
                          })
                      })
                    })
                  })
          }
        })
    })
}

change = e=>{
  this.setState({
    [e.target.id] : e.target.value
})
}
  render(){
    const listCommentaire =  this.state.Commentaire.map((number) =>
        

      <LisComEvent key ={+number[1]} idCom={number[1]} idUtil = {number[0]}  idevent={this.state.id} estUtil={(+number[0])==(+this.props.idUtil)} />
    );
    
  
    return ( 
      <div >
          <div >
          <div >
          <div className="page-header">
          <h1> <small className="pull-right">{this.state.nbCom} comments</small> Comments </h1>
          </div>
          <div className="comments-list">
            {listCommentaire}
          </div>
          <input id="write" type="text" name="Ecrire un commentaire" className="login-input" placeholder="Ecrire un commentaire" onChange={this.change.bind(this)} />
          <button className="btn btn-link navbar-btn" onClick={this.AjoutComm.bind(this)}> Ajoute Commentaire</button>
          </div>

          </div>

      </div>

    )
  }
}
class ListEvent extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      idUtil : this.props.name,
      id :  this.props.id,
      titre : "",
      description : "",
      date :"",
      jour : "",
      mois:"",
      annee:"",
      heure : "",
      aime : 0,
      aLike : null,
      pasLike :null,
      nbParticipe :null,
      participe : null,
      nbCom : null,
      lescomm: null,
      afficherComm:false
    }
  }
  
  componentDidMount(){
    
    var request = new Request ('http://localhost:2100/prjt/EvenParid',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
    });

    const self = this;
    fetch(request)
      .then(function(response){
        response.json()
        .then(function(data){
          var Tabmois = ["Jan","Fev","Mar","Avr","Mai","Juin","Jui","Aout","Sep","Oct","Nov","Dec"];
          var debut = data.Titre.datee.substring(0, 10).split(":")[0];
          var day=debut.split("-")[2];
          var month = Tabmois[+debut.split("-")[1]-1];
          var year = debut.split("-")[0];
          var request = new Request ('http://localhost:2100/prjt/Nblike',{
            method:'POST',
            headers : new Headers({"Content-type" : "application/json"}),
            body : JSON.stringify(self.state)
          });
          fetch(request)
            .then(function(response){
              response.json()
                .then(function(data){
                 self.setState({
                   aime : data.nb,
                   aLike : data.ALike,
                   pasLike : ! data.ALike
                 }) 
                 var request = new Request ('http://localhost:2100/prjt/NbParticipant',{
                    method:'POST',
                    headers : new Headers({"Content-type" : "application/json"}),
                    body : JSON.stringify(self.state)
                  });
                  fetch(request)
                .then(function(response){
                  response.json()
                    .then(function(data){
                     self.setState({
                       nbParticipe:data.nb,
                       participe : data.ALike
                     }) 
                     var request = new Request ('http://localhost:2100/prjt/NbComm',{
                        method:'POST',
                        headers : new Headers({"Content-type" : "application/json"}),
                        body : JSON.stringify(self.state)
                      });
                      fetch(request)
                          .then(function(response){
                            response.json()
                          .then(function(data){
                            self.setState({
                              nbCom : data.nbComment,
                              lescomm : data.liste
                            }) 
                          })
                      })
                  })
                })

              })
            })
          self.setState({
            titre : data.Titre.nome,
            description : data.Titre.descriptione,  
            jour : day,
            mois : month,
            date : debut,
            annee:year,
            date : debut
          })
            
          
        })
      })
      
      
  }

  DislikeThis (){

      var request = new Request ('http://localhost:2100/prjt/Delike',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
      });
      const self = this;
      fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
              
              var request = new Request ('http://localhost:2100/prjt/Nblike',{
                method:'POST',
                headers : new Headers({"Content-type" : "application/json"}),
                body : JSON.stringify(self.state)
              });
              
              fetch(request)
                .then(function(response){
                  response.json()
                    .then(function(data){
                      var request = new Request ('http://localhost:2100/prjt/Delike2',{
                        method:'POST',
                        headers : new Headers({"Content-type" : "application/json"}),
                        body : JSON.stringify(self.state)
                        });
                        fetch(request)
                                .then(function(response){
                                  response.json()
                                  .then(function(data){
                                    console.log(data); 
                                  })
                                })
                     self.setState({
                       aime : data.nb,
                       aLike : false,
                       pasLike : true
                     }) 
                  })
                })
                
            })
        }) 
  }

  likeThis(){
    var request = new Request ('http://localhost:2100/prjt/Like',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
      });
      const self = this;
      fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
              
              var request = new Request ('http://localhost:2100/prjt/Nblike',{
                method:'POST',
                headers : new Headers({"Content-type" : "application/json"}),
                body : JSON.stringify(self.state)
              });
              
              fetch(request)
                .then(function(response){
                  response.json()
                    .then(function(data){
                      var request = new Request ('http://localhost:2100/prjt/Like2',{
                        method:'POST',
                        headers : new Headers({"Content-type" : "application/json"}),
                        body : JSON.stringify(self.state)
                        });
                        fetch(request)
                                .then(function(response){
                                  response.json()
                                  .then(function(data){
                                    console.log(data); 
                                  })
                                })
                     self.setState({
                       aime : data.nb,
                       aLike : true,
                       pasLike : false
                      
                     }) 
                  })
                })
                
            })
        }) 

  }
  affichelesComm(){
    this.setState({
      afficherComm: ! this.state.afficherComm
    })
  }
  Participethis(){
    if(this.state.participe){
      var request = new Request ('http://localhost:2100/prjt/JeparticipePas',{
        method:'POST',
        headers : new Headers({"Content-type" : "application/json"}),
        body : JSON.stringify(this.state)
        });
        const self = this;
        fetch(request)
          .then(function(response){
              response.json()
              .then(function(data){
                
                var request = new Request ('http://localhost:2100/prjt/NbParticipant',{
                  method:'POST',
                  headers : new Headers({"Content-type" : "application/json"}),
                  body : JSON.stringify(self.state)
                });
                
                fetch(request)
                  .then(function(response){
                    response.json()
                      .then(function(data){
                       self.setState({
                         nbParticipe : data.nb,
                         participe : false
                       }) 
                    })
                    
                  })
                  
              })
          }) 
    }
    else{
      var request = new Request ('http://localhost:2100/prjt/JeParticipe',{
        method:'POST',
        headers : new Headers({"Content-type" : "application/json"}),
        body : JSON.stringify(this.state)
        });
        const self = this;
        fetch(request)
          .then(function(response){
              response.json()
              .then(function(data){
                
                var request = new Request ('http://localhost:2100/prjt/NbParticipant',{
                  method:'POST',
                  headers : new Headers({"Content-type" : "application/json"}),
                  body : JSON.stringify(self.state)
                });
                
                fetch(request)
                  .then(function(response){
                    response.json()
                      .then(function(data){
                       self.setState({
                         nbParticipe : data.nb,
                         participe : true
                       }) 
                    })
                  })
                  
              })
          }) 
    }
    

  }

  render(){
    return (
      
      <li> 
          <time dateTime={this.state.date}>
            <span className="day">{this.state.jour}</span>
            <span className="month">{this.state.mois}</span>
            <span className="year">{this.state.annee}</span>
            <span className="time">ALL DAY</span>
          </time>
 
          <div className="info">
            <h2 className="title">{this.state.titre}</h2>
            <p className="desc">{this.state.description}</p>
            <ul>
              {this.state.aLike && <li style={ {width : "33%"} }  >{this.state.aime} <span className="fa fa-heart" aria-hidden="true" onClick={this.DislikeThis.bind(this)} ></span></li>}
              { this.state.pasLike && <li style={ {width : "33%"} }  >{this.state.aime} <span className="fa fa-heart-o" aria-hidden="true" onClick={this.likeThis.bind(this)} ></span></li>}
              <li style={ {width : "34%"} }> {this.state.nbParticipe} <span className="fa fa-user" aria-hidden="true" onClick={this.Participethis.bind(this)} ></span></li>
              <li style={ {width : "33%"}}> {this.state.nbCom} <span className="fa fa-comment"  aria-hidden="true" onClick={this.affichelesComm.bind(this)}></span></li>
            </ul>
          </div> 
         {this.state.afficherComm && <CommEvent id= {this.state.id} idUtil= {this.state.idUtil}/> } 
      </li>
       
      
      
      
    );
  }
}
class Event extends React.Component{
  constructor(props){
    super(props);
    this.state={
      friends:[],
      id:this.props.id,
      EventPre : false,
      event : []
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
        var request = new Request ('http://localhost:2100/prjt/ListEventfriend',{
          method:'POST',
          headers : new Headers({"Content-type" : "application/json"}),
          body : JSON.stringify(data)
        });
        fetch(request)
            .then(function(response){
              response.json()
                .then(function(data){
                  self.setState({
                  EventPre : data.EventPre,
                  event : data.Event
                  })
          
                 })
              })
        
      })

    });
  }

  render(){
    const listItems = this.state.event.map((number) =>
    <ListEvent name = {this.props.id} key = {number} id={number}/>
  );
    return( 
            <ul className="event-list">
                {listItems}
            </ul>
      
            
    );
  }
}
function Map() {
  return (
    <GoogleMap 
      defaultZoom={10}
      defaultCenter={{ lat: 43.927479, lng: 2.148060 }}
    >

      <Marker position={{ lat: 43.90000, lng: 2.0000 }} />
    </GoogleMap>

  );
}
const WrappedMap = withScriptjs(withGoogleMap(Map));
class Carte extends React.Component{
  constructor(props){
    super(props);
    this.state={
      liste:[]
    }
  }
   

  render(){
   
    
    return(<div className="box-controller" style={{width: '100vw', height: '100vh'}} >
<div style={{ width: "100%", height: "100%" }}>
            <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCUtqzInZ_IlYg8kFoATjV5tjNtzrVtiEs`}
            loadingElement={<div style={{height: '100%'}} />}
            containerElement={<div style={{height: '100%'}} />}
            mapElement={<div style={{height: '100%'}} />}

            />
        </div>
    </div>
    );
  }
  
}

class Aime extends React.Component{
  constructor(props){
    super(props);
    this.state={
      id : this.props.id,
      liste:[]
    }
    
  }
  componentDidMount(){
    var request = new Request ('http://localhost:2100/prjt/UtilLike',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
    });

    const self = this;
    fetch(request)
        .then(function(response){
          response.json()
        .then(function(data){
         console.log(data.liste);
          self.setState({
            liste : data.liste
          })
        })
    })

  }
  eventornews(elem){
    if((elem[2].localeCompare("event"))==0){
      return(<ListEvent name = {this.props.id} key = {+elem[0]} id={elem[1]}/>);
    }
    else{
      return(<ListNews name = {this.props.id} key = {+elem[0]} id={elem[1]}/>);
    }

  }
  render(){
    const listItems = this.state.liste.map((number) =>
    
      this.eventornews(number)
    
  );
    return( <ul className="event-list">
          {listItems}
        </ul>);
  }
}

class LisComNew extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      idUtil : this.props.idUtil,
      idEvent : this.props.idevent,
      idComen : this.props.idCom,
      pseudo : "",
      decription : "",
      date:"",
      heure:""
    }
  }

  componentDidMount(){
    var request = new Request ('http://localhost:2100/prjt/LeCommNew',{
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
          pseudo : data.info.pseudo,
          description : data.info.commentaire,
          date : data.info.datec.substring(0, 10).split(":")[0],
          heure: data.info.heurec.split(".")[0]
        }) 
          
        })
    })

  }

  render(){
    return (
      <div className="media">
          
        
          <div className="media-body">
            <h4 className="media-heading user_name">{this.state.pseudo}</h4>
              {this.state.description}
              
          </div>
          <p className="pull-left"><small>{this.state.date}:{this.state.heure}</small></p>
      </div>
    )
  }
}

class CommNew extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      idUtil:this.props.idUtil,
      id: this.props.id,
      Commentaire : [],
      nbCom : null,
      write:"",
      newCommId:""
    }
    
  }
  componentDidMount(){
    var request = new Request ('http://localhost:2100/prjt/NbCommNew',{
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
            nbCom : data.nbComment,
            Commentaire: data.liste
          }) 
        })
    })
}

  

AjoutComm= e=>{
  e.preventDefault() ;
  var request = new Request ('http://localhost:2100/prjt/AjoutComm',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
    });
    const self = this;
    fetch(request)
        .then(function(response){
          response.json()
        .then(function(data){
          if(data.message==1){
            var request = new Request ('http://localhost:2100/prjt/IdComm',{
              method:'POST',
              headers : new Headers({"Content-type" : "application/json"}),
              body : JSON.stringify(self.state)
            });
            fetch(request)
                .then(function(response){
                  response.json()
                .then(function(data){
                  console.log(data);
                  self.setState({
                    newCommId : data.message,
                    
                  }) 
                  var request = new Request ('http://localhost:2100/prjt/AjoutNewComm',{
                      method:'POST',
                      headers : new Headers({"Content-type" : "application/json"}),
                      body : JSON.stringify(self.state)
                  });
                  fetch(request)
                      .then(function(response){
                          response.json()
                          .then(function(data){
                            console.log(data);
                            var request = new Request ('http://localhost:2100/prjt/NbCommNew',{
                                method:'POST',
                                headers : new Headers({"Content-type" : "application/json"}),
                                body : JSON.stringify(self.state)
                            });
    
                              fetch(request)
                                .then(function(response){
                                  response.json()
                                  .then(function(data){
                                    self.setState({
                                        nbCom : data.nbComment,
                                        Commentaire: data.liste
                                    }) 
                                  })
                                })
                          })
                      })
                    })
                  })
          }
        })
    })
}

change = e=>{
  this.setState({
    [e.target.id] : e.target.value
})
}
  render(){
    const listCommentaire =  this.state.Commentaire.map((number) =>
        

      <LisComNew key ={+number[1]} idCom={number[1]} idUtil = {number[0]}  idevent={this.state.id} estUtil={(+number[0])==(+this.props.idUtil)} />
    );
    
  
    return ( 
      <div >
          <div >
          <div >
          <div className="page-header">
          <h1> <small className="pull-right">{this.state.nbCom} comments</small> Comments </h1>
          </div>
          <div className="comments-list">
            {listCommentaire}
          </div>
          <input id="write" type="text" name="Ecrire un commentaire" className="login-input" placeholder="Ecrire un commentaire" onChange={this.change.bind(this)} />
          <button className="btn btn-link navbar-btn" onClick={this.AjoutComm.bind(this)}> Ajoute Commentaire</button>
          </div>

          </div>

      </div>

    )
  }
}
class ListNews extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      idUtil : this.props.name,
      id :  this.props.id,
      titre : "",
      description : "",
      date :"",
      jour : "",
      mois:"",
      annee:"",
      heure : "",
      aime : 0,
      aLike : null,
      pasLike :null,
      nbCom : null,
      lescomm: null,
      afficherComm:false
    }
  }
  
  componentDidMount(){
    
    var request = new Request ('http://localhost:2100/prjt/newsParid',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
    });

    const self = this;
    fetch(request)
      .then(function(response){
        response.json()
        .then(function(data){
          var Tabmois = ["Jan","Fev","Mar","Avr","Mai","Juin","Jui","Aout","Sep","Oct","Nov","Dec"];
          var debut = data.Titre.datep.substring(0, 10).split(":")[0];
          var day=debut.split("-")[2];
          var month = Tabmois[+debut.split("-")[1]-1];
          var year = debut.split("-")[0];
          var request = new Request ('http://localhost:2100/prjt/NblikeNew',{
            method:'POST',
            headers : new Headers({"Content-type" : "application/json"}),
            body : JSON.stringify(self.state)
          });
          fetch(request)
            .then(function(response){
              response.json()
                .then(function(data){
                 self.setState({
                   aime : data.nb,
                   aLike : data.ALike,
                   pasLike : ! data.ALike
                 }) 
                
                 var request = new Request ('http://localhost:2100/prjt/NbCommNew',{
                        method:'POST',
                        headers : new Headers({"Content-type" : "application/json"}),
                        body : JSON.stringify(self.state)
                      });
                      fetch(request)
                          .then(function(response){
                            response.json()
                          .then(function(data){
                            self.setState({
                              nbCom : data.nbComment,
                              lescomm : data.liste
                            }) 
                          })
                      })

              })
            })
          self.setState({
            titre : data.Titre.nomn,
            description : data.Titre.descriptionn,  
            jour : day,
            mois : month,
            date : debut,
            annee:year,
            date : debut
          })
            
          
        })
      })
      
      
  }

  DislikeThis (){

      var request = new Request ('http://localhost:2100/prjt/DelikeNew',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
      });
      const self = this;
      fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
              
              var request = new Request ('http://localhost:2100/prjt/NblikeNew',{
                method:'POST',
                headers : new Headers({"Content-type" : "application/json"}),
                body : JSON.stringify(self.state)
              });
              
              fetch(request)
                .then(function(response){
                  response.json()
                    .then(function(data){
                      var request = new Request ('http://localhost:2100/prjt/DelikeNew2',{
                        method:'POST',
                        headers : new Headers({"Content-type" : "application/json"}),
                        body : JSON.stringify(self.state)
                        });
                        fetch(request)
                                .then(function(response){
                                  response.json()
                                  .then(function(data){
                                    console.log(data); 
                                  })
                                })
                     self.setState({
                       aime : data.nb,
                       aLike : false,
                       pasLike : true
                     }) 
                  })
                })
                
            })
        }) 
  }

  likeThis(){
    var request = new Request ('http://localhost:2100/prjt/LikeNew',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
      });
      const self = this;
      fetch(request)
        .then(function(response){
            response.json()
            .then(function(data){
              
              var request = new Request ('http://localhost:2100/prjt/NblikeNew',{
                method:'POST',
                headers : new Headers({"Content-type" : "application/json"}),
                body : JSON.stringify(self.state)
              });
              
              fetch(request)
                .then(function(response){
                  response.json()
                    .then(function(data){
                      var request = new Request ('http://localhost:2100/prjt/LikeNew2',{
                        method:'POST',
                        headers : new Headers({"Content-type" : "application/json"}),
                        body : JSON.stringify(self.state)
                        });
                        fetch(request)
                                .then(function(response){
                                  response.json()
                                  .then(function(data){
                                    console.log(data); 
                                  })
                                })
                     self.setState({
                       aime : data.nb,
                       aLike : true,
                       pasLike : false
                      
                     }) 
                  })
                })
                
            })
        }) 

  }
  affichelesComm(){
    this.setState({
      afficherComm: ! this.state.afficherComm
    })
  }
 

  render(){
    return (
      
      <li> 
          <time dateTime={this.state.date}>
            <span className="day">{this.state.jour}</span>
            <span className="month">{this.state.mois}</span>
            <span className="year">{this.state.annee}</span>
            <span className="time">ALL DAY</span>
          </time>
 
          <div className="info">
            <h2 className="title">{this.state.titre}</h2>
            <p className="desc">{this.state.description}</p>
            <ul>
              {this.state.aLike && <li style={ {width : "33%"} }  >{this.state.aime} <span className="fa fa-heart" aria-hidden="true" onClick={this.DislikeThis.bind(this)} ></span></li>}
              { this.state.pasLike && <li style={ {width : "33%"} }  >{this.state.aime} <span className="fa fa-heart-o" aria-hidden="true" onClick={this.likeThis.bind(this)} ></span></li>}
              <li style={ {width : "33%"}}> {this.state.nbCom} <span className="fa fa-comment"  aria-hidden="true" onClick={this.affichelesComm.bind(this)}></span></li>
            </ul>
          </div> 
         {this.state.afficherComm && <CommNew id= {this.state.id} idUtil= {this.state.idUtil}/> } 
      </li>
    );
  }
}

class Article extends React.Component{
constructor(props){
    super(props);
    this.state={
      friends:[],
      id:this.props.id,
      newsPre : false,
      news : []
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
        var request = new Request ('http://localhost:2100/prjt/ListNewfriend',{
          method:'POST',
          headers : new Headers({"Content-type" : "application/json"}),
          body : JSON.stringify(data)
        });
        fetch(request)
            .then(function(response){
              response.json()
                .then(function(data){
                  self.setState({
                  newsPre : data.newsPre,
                  news : data.news
                  })
          
                 })
              })
            })
      });
  }
  render(){
    const listItems = this.state.news.map((number) =>
    <ListNews name = {this.props.id} key = {number} id={number}/>
  );
    return( 
            <ul className="event-list">
                {listItems}
            </ul>
      
            
    );
  }
}

class Participe extends React.Component{
  constructor(props){
    super(props);
    this.state={
      id:this.props.id,
      liste:[]
    }
  }
  componentDidMount(){
    var request = new Request ('http://localhost:2100/prjt/ListEventParticipate',{
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
                  liste : data.Event,
                  })
          
                 })
              })
  }
  render(){
    const listItems = this.state.liste.map((number) =>
    <ListEvent name = {this.props.id} key = {number} id={number}/>
  );
    return( 
            <ul className="event-list">
                {listItems}
            </ul>
      
            
    );
  }
}
Geocode.setApiKey( "AIzaSyAvHPTZu_MEeaSjDXq9N6jQbqAntnkUzhM" );
Geocode.enableDebug();

class CreeEvent extends React.Component{
  constructor(props){
    super(props);
    this.state={
      id: this.props.id,
      nom : "",
      description : "",
      date : "",
      heure:"",
      adresse:"",
      lat:"",
      long:""

    }
  }

  change = e=>{
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  ajout = e=>{
    e.preventDefault();
    Geocode.fromAddress(this.state.adresse).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat,lng);
        this.setState({
          lat:lat,
          long:lng
        })
        console.log(this.state.lat);
      },
      error => {
        console.error(error);
      }
    );
    var request = new Request ('http://localhost:2100/prjt/AjoutEvent',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
    });
    const self = this;
    fetch(request)
            .then(function(response){
              response.json()
                .then(function(data){
                  console.log(data.message)
          
                 })
              })
  }

  render(){
    return(
      
            <form className="well span8">
        <div className="row">
          <div className="span3">
            <label>Nom Event</label> <input id="nom" className="span3" placeholder=
                "Name Event" type="text" onChange={this.change} /> <label>Date</label>
                <input id="date" className="span3" placeholder="Quand" type="date" onChange={this.change}/>
                <label>heure</label> <input id="heure" className="span3" placeholder=
                "A quelle heure" type="time" onChange={this.change}/> 
                <label>Adresse</label> <input id="adresse" className="span3" placeholder=
                "Lieu" type="text" onChange={this.change}/> 
          </div>
          <div className="span12">
                <label>Description</label> 
                <textarea id="description" className="input-xlarge span5"  name="description"
                rows="5" onChange={this.change}>
                </textarea>
          </div>
          <button className="btn btn-primary pull-right" onClick={this.ajout.bind(this)}>Send</button>
        </div>
    </form>

    
    );
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
      friend : [],
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
        
        self.setState({friend: data.friends,estEvent:true,
          estCarte:false,
          estAime:false,
          estArticle:false,
          estParticpe:false});
        
      })
  
  })
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
        <nav className="navbar navbar-dark bg-dark">
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
              {this.state.estCreeArticle && <CreeArticle id={this.state.id} />}
        </div>
        <div>
              {this.state.estEvent&& <Event id={this.state.id} friend = {this.state.friend} />}
              {this.state.estCarte && <Carte/>}
              {this.state.estAime&& <Aime id={this.state.id}/>}
              {this.state.estArticle && <Article id={this.state.id}/>}
              {this.state.estParticpe && <Participe id={this.state.id}/>}
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
class Modif extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id : this.props.code,
      table : this.props.name,
      quelmodif : this.props.id,
      new : "",
      err : false

    }
  }
  change = e=>{
    this.setState({
      new : e.target.value
    })
  }

  changement = e=>{
    e.preventDefault() ;
    var request = new Request ('http://localhost:2100/prjt/ModifTable',{
      method:'POST',
      headers : new Headers({"Content-type" : "application/json"}),
      body : JSON.stringify(this.state)
    });
    const self = this;
    fetch(request)
      .then(function(response){
        response.json()
        .then(function(data){
          
          if(data.message){
            window.location.reload();
          }
          else{
            var code = +data.code;
            if(code == 23505){
              self.setState({
                err : true
              })

            }
          }
        
        })

      })

    
  }

  render(){
    return (<tr>
              <td>
              <input
              id="new"
              type="text"
              name={this.state.quelmodif}
              className="login-input"
              placeholder={this.state.quelmodif}
              onChange={this.change} />
              </td>
              {this.state.err && <p>Il existe déjà</p> }
              <td className="text-right text-nowrap">
                                    <button id="modifpseud" className="btn btn-xs btn-warning" onClick={this.changement.bind(this)}>
                                      <span className="glyphicon glyphicon-trash"></span>
                                      Modifier
                                    </button>
              </td>
              <td>
              
              </td>
              
            
            </tr>);
  }
}
class Param extends React.Component{
  constructor(props){
    super(props);
    this.state={
      id:this.props.id,
      pseudo: "",
      pwd : "",
      nom  : "",
      prenom : "",
      mail : "",
      country : "",
      cp : "",
      modifpseud:false,
      modifpwd:false,
      modifnom:false,
      modifprenom:false,
      modifmail:false,
      modifcountry:false,
      modifcp:false
      

    }
  }
  modifPseudo=e => {
      if(this.state.modifpseud){
        this.setState({[e.target.id] :  false })
      }
      else{
        this.setState({ [e.target.id] : true })
      }
  }

  modifPwd=e => {
    if(this.state.modifpwd){
      this.setState({[e.target.id] :  false })
    }
    else{
      this.setState({ [e.target.id] : true })
    }
  }
  modifNom=e => {
    if(this.state.modifnom){
      this.setState({[e.target.id] :  false })
    }
    else{
      this.setState({ [e.target.id] : true })
    }
  }
  modifPrenom=e => {
    if(this.state.modifPrenom){
      this.setState({[e.target.id] :  false })
    }
    else{
      this.setState({ [e.target.id] : true })
    }
  }
  modifEmail=e => {
    if(this.state.modifmail){
      this.setState({[e.target.id] :  false })
    }
    else{
      this.setState({ [e.target.id] : true })
    }
  }
  modifCp=e => {
    if(this.state.modifcp){
      this.setState({[e.target.id] :  false })
    }
    else{
      this.setState({ [e.target.id] : true })
    }
  }
  modifPays=e => {
    if(this.state.modifcountry){
      this.setState({[e.target.id] :  false })
    }
    else{
      this.setState({ [e.target.id] : true })
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
    return (
            <div>
            <h1>Parametre</h1>
              <div className="container">
                    <div className="panel panel-default">
                          <table className="table table-hover">
                              <tbody>
                                <tr>
                                  <td>
                                    <span className="glyphicon glyphicon-file"></span>
                                      Identifiant : {this.state.pseudo}
                                  </td>
                                  <td className="text-right text-nowrap">
                                    <button id="modifpseud" className="btn btn-xs btn-warning" onClick={this.modifPseudo.bind(this)}>
                                      <span className="glyphicon glyphicon-trash"></span>
                                      Modifier
                                    </button>
                                  </td>
                                  
                                </tr>
                                {this.state.modifpseud && <Modif code = {this.state.id} name="pseudo" id="Identifiant" />}
                                <tr>
                                  <td>
                                    <span className="glyphicon glyphicon-file"></span>
                                      Password : *******
                                  </td>
                                  <td className="text-right text-nowrap">
                                    <button id = "modifpwd"className="btn btn-xs btn-warning" onClick={this.modifPwd.bind(this)}>
                                      <span className="glyphicon glyphicon-trash"></span>
                                      Modifier
                                    </button>
                                  </td>
                                </tr>
                                {this.state.modifpwd && <Modif code = {this.state.id} name="pwd" id="Password" />}
                                <tr>
                                  <td>
                                    <span className="glyphicon glyphicon-file"></span>
                                      Nom : {this.state.nom}
                                  </td>
                                  <td className="text-right text-nowrap">
                                    <button id="modifnom" className="btn btn-xs btn-warning" onClick={this.modifNom.bind(this)}>
                                      <span className="glyphicon glyphicon-trash"></span>
                                      Modifier
                                    </button>
                                  </td>
                                </tr>
                                {this.state.modifnom && <Modif code = {this.state.id} name="nom" id="Nom" />}
                                <tr>
                                  <td>
                                    <span className="glyphicon glyphicon-file" ></span>
                                      Prenom : {this.state.prenom}
                                  </td>
                                  <td className="text-right text-nowrap">
                                    <button id = "modifprenom" className="btn btn-xs btn-warning" onClick={this.modifPrenom.bind(this)}>
                                      <span className="glyphicon glyphicon-trash"></span>
                                      Modifier 
                                    </button>
                                  </td>
                                </tr>
                                {this.state.modifprenom && <Modif code = {this.state.id} name="prenom" id="Prenom" />}
                                <tr>
                                  <td>
                                    <span className="glyphicon glyphicon-file" ></span>
                                      Email : {this.state.mail}
                                  </td>
                                  <td className="text-right text-nowrap">
                                    <button id="modifmail" className="btn btn-xs btn-warning" onClick={this.modifEmail.bind(this)}>
                                      <span className="glyphicon glyphicon-trash"></span>
                                      Modifier
                                    </button>
                                  </td>
                                </tr>
                                {this.state.modifmail && <Modif code = {this.state.id} name="mail" id="Email" />}
                                <tr>
                                  <td>
                                    <span className="glyphicon glyphicon-file"></span>
                                      Code Postal : {this.state.cp}
                                  </td>
                                  <td className="text-right text-nowrap">
                                    <button id="modifcp" className="btn btn-xs btn-warning" onClick={this.modifCp.bind(this)}>
                                      <span className="glyphicon glyphicon-trash"></span>
                                      Modifier
                                    </button>
                                  </td>
                                </tr> 
                                {this.state.modifcp && <Modif code = {this.state.id} name="cp" id="Code Postal" />}
                                <tr>
                                  <td>
                                    <span className="glyphicon glyphicon-file"></span>
                                      Pays : {this.state.country}
                                  </td>
                                  <td className="text-right text-nowrap">
                                    <button id="modifcountry" className="btn btn-xs btn-warning" onClick={this.modifPays.bind(this)}>
                                      <span className="glyphicon glyphicon-trash"></span>
                                      Modifier
                                    </button>
                                  </td>
                                </tr>
                                {this.state.modifcountry && <Modif code = {this.state.id} name="country" id="Pays" />}
                              </tbody>
                           </table>
                     </div>
                </div>

              </div>
      
      );
  }
}

class Profil extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (<div>
        <h1>Profil</h1>
        <div >
        </div>
        
    </div>)
  }
}

class Menu extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        EstStatistique : false,
        EstAccueil : true,
        EstParametre: false,
        
      };
      
    }
   
    
    passAcc (){
      const cookies = new Cookies();
      this.setState({
        EstAccueil : true,
        EstStatistique : false,
        EstParametre: false
    });
    cookies.remove("Pgm",{ path: '/PageConnecte' });
    cookies.set("Pgm","estAccueil", { path: '/PageConnecte'});
    }

    passStat (){
      const cookies = new Cookies();
      this.setState({
        EstAccueil : false,
        EstStatistique : true,
        EstParametre: false
      });
      cookies.remove("Pgm",{ path: '/PageConnecte' });
      cookies.set("Pgm","estStat", { path: '/PageConnecte'});
    }

    passPara (){
      const cookies = new Cookies();
      this.setState({
        EstAccueil : false,
        EstStatistique : false,
        EstParametre: true
      });
      cookies.remove("Pgm",{ path: '/PageConnecte' });
      cookies.set("Pgm","estParam", { path: '/PageConnecte'});
    }
    
    deco = e=>{
      const cookies = new Cookies();
      cookies.remove("user",{ path: '/PageConnecte' });
      cookies.remove("Pgm",{ path: '/PageConnecte' });
      history.push("/PageAccueil");
      window.location.reload();

    }
   
    render() {
      const cookies = new Cookies();
      let EstAccueil = (cookies.get("Pgm").localeCompare("estAccueil") )== 0,
          EstStatistique= (cookies.get("Pgm").localeCompare("estStat") )== 0,
          EstParametre = (cookies.get("Pgm").localeCompare("estParam") )== 0

      

      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-2" >
              <nav className="nav flex-column">
                <button type="button" className="btn btn-link" onClick={this.passAcc.bind(this)}>Accueil</button>
                <button type="button" className="btn btn-link" onClick={this.passStat.bind(this)}>Statistique</button>
                <button type="button" className="btn btn-link" onClick={this.passPara.bind(this)}>Parametre</button>
                <button type="button" className="btn btn-link" onClick={this.deco.bind(this)}>Deconnexion</button>
              </nav>
            </div>
            <div className = "col-md-6">
              {EstAccueil && <Accueil id={this.props.id} friend = { this.props.friend} />}
              {EstStatistique && <Stat id={this.props.id} />}
              {EstParametre && <Param id = {this.props.id} />}
            </div>
            <div className="col-sm-3">
                <Profil name = {this.props.name} id = {this.props.id}/>
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
        id :cookies.get("user").split(" ")[1],
        
      }
      if(cookies.get("Pgm") == undefined){
        cookies.set("Pgm","estAccueil", { path: '/PageConnecte'});
      }
      
      
      
    }
    catch(err){
      history.push("/PageAccueil");
      window.location.reload();

    }
    
  }


  render(){
    
    const affichemenu = ()=>{
      return (<Menu friend = {this.state.liste} name={this.state.ident} id={this.state.id}/>)
    }
    return(
      <Router>
      <div>
        <Route exact path="/PageConnecte" component={affichemenu}></Route>
        <Route exact path="/" component={PageAccueil}></Route>
      </div>
    </Router>
      
    );
      
    
  }
}


   
  export default PageConnecte;