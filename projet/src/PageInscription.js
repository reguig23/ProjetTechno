import React from 'react';



class Formulaire extends React.Component{
    state={
        pseudo : null,
        nom:null,
        prenom:null,
        email:null,
        pwd : null,
        cp :null,
        country : null


    };

    change=e => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }
    submit = e => {
        e.preventDefault();
        console.log(this.state)
    }
    render(){
        return (
        
            <div class="col-md-12 mb-6">
                <div class="card">
                <div class="card-body">
                <form onSubmit={this.submit}>
                    <h1 class="text-center font-up font-bold deep-orange-text py-4">Inscription</h1>
                    <div class="md-form">
                        <label htmlFor="pseudo"> Identifiant</label>
                        <input type ="text" id="pseudo" onChange={this.change}/>
                    </div>
                    <div class="md-form">
                        <label htmlFor="pwd"> Mdp</label>
                        <input type ="password" id="pwd" onChange={this.change}/>
                    </div>
                    <div class="md-form">
                        <label htmlFor="nom"> Nom</label>
                        <input type ="text" id="nom" onChange={this.change}/>
                    </div>
                    <div class="md-form">
                        <label htmlFor="prenom"> Prenom</label>
                        <input type ="text" id="prenom" onChange={this.change}/>
                    </div>
                    <div class="md-form">
                        <label htmlFor="email"> Email</label>
                        <input type="email" id="email" onChange={this.change}/>
                    </div>
                    <div class="md-form">
                        <label htmlFor="cp"> Code Postal</label>
                        <input type ="text" id="cp" onChange={this.change}/>
                    </div>
                    <div class="md-form">
                        <label htmlFor="country"> Pays</label>
                        <input type ="text" id="country" onChange={this.change}/>
                    </div>
                    <div class="text-center">
                        <button class="btn btn-deep-orange">Suivant<i class="fa fa-angle-double-right pl-2" aria-hidden="true"></i></button>
                    </div>
                    
                    
                </form>
                </div>
            </div>
            </div>
            
            
        )
    }

}
export default Formulaire ;
