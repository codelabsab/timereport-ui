import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import GoogleLoginButton from "./components/GoogleLogin";
import Timereport from "./components/Timereport";
import { Container } from "semantic-ui-react";

require("dotenv").config();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogin() {
    this.setState({ loggedIn: true });
  }

  onLogout() {
    this.setState({ loggedIn: false });
  }

  render() {
    return (
      <div>
        <NavBar />
        <Router>
          <Container text style={{ marginTop: "7em" }}>
            <Switch>
              <Route
                path="/timereport"
                render={() =>
                  this.state.loggedIn ? (
                    <Timereport
                      backend_url={process.env.REACT_APP_backend_url}
                    />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
              <Route
                path="/"
                render={() =>
                  this.state.loggedIn ? (
                    <Redirect to="/timereport" />
                  ) : (
                    <GoogleLoginButton onLogin={this.onLogin} />
                  )
                }
              />
            </Switch>
          </Container>
        </Router>
      </div>
    );
  }
}

export default App;
