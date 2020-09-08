import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Timereport from './components/Timereport';
import { Container } from 'semantic-ui-react';

require('dotenv').config();


class App extends Component {
    
    render() {
        return (
            <div>
                <NavBar/>
                <Router>
                    <Container text style={{ marginTop: '7em' }}>
                        <Route path="/timereport" render={() => <Timereport backend_url={process.env.REACT_APP_backend_url} />} />
                    </Container>
                </Router>
            </div>
        );
    }
}

export default App;
