import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Timereport from './components/Timereport';
import { Container } from 'semantic-ui-react';

require('dotenv').config();

function onAuthRequired({history}) {
    history.push('/');
  }

class App extends Component {
    
    render() {
        return (
            <div>
                <Router>
                    <Security
                        issuer={process.env.REACT_APP_okta_baseurl + '/oauth2/default'}
                        client_id={process.env.REACT_APP_okta_client_id}
                        redirect_uri={window.location.origin + '/implicit/callback'}
                        onAuthRequired={onAuthRequired}
                    >
                        <NavBar/>
                        <Container text style={{ marginTop: '7em' }}>   
                            <Route path="/" exact={true} render={() => <Login baseUrl={process.env.REACT_APP_okta_baseurl} />} />
                            <SecureRoute path="/timereport" render={() => <Timereport backend_url={process.env.REACT_APP_backend_url} />} />
                            <Route path="/implicit/callback" component={ImplicitCallback} />
                        </Container>
                    </Security>
                </Router>
            </div>
        );
    }
}

export default App;