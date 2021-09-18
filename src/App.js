import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import { Summary } from "./components/Summary";
import GoogleLoginButton from "./components/GoogleLogin";
import Timereport from "./components/Timereport";
import { Container } from "semantic-ui-react";

require("dotenv").config();

const LOGIN_STORAGE_KEY = "timereport-is-logged-in";
const ENV = process.env.NODE_ENV;

class App extends Component {
  constructor(props) {
    super(props);

    if (ENV === "development") {
      console.log(`Skip login in ${ENV} mode`)
      this.state = {
        loggedIn: true
      }
    } else {
      this.state = {
        loggedIn: localStorage.getItem(LOGIN_STORAGE_KEY),
      }
    }

    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogin() {
    this.setState({ loggedIn: true });
    localStorage.setItem(LOGIN_STORAGE_KEY, true);
  }

  onLogout() {
    this.setState({ loggedIn: false });
    localStorage.setItem(LOGIN_STORAGE_KEY, false);
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
                    <Redirect to="/" />
                  )
                }
              />
              <Route
                path="/summary"
                render={() =>
                  this.state.loggedIn ? (
                    <Summary backendUrl={process.env.REACT_APP_backend_url} />
                  ) : (
                    <Redirect to="/" />
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
