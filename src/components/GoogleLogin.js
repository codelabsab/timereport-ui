import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";

const CLIENT_ID = process.env.REACT_APP_google_client_id;

class GoogleLoginButton extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
  }

  login(response) {
    // TODO: Proper security :)
    if (
      response.accessToken &&
      response.profileObj.email.endsWith("@codelabs.se")
    ) {
      this.props.onLogin();
    }
  }

  handleLoginFailure(r) {
    console.error(`Failed to log in ${r}`);
  }

  render() {
    return (
      <div className="login-container">
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="Login"
          onSuccess={this.login}
          onFailure={this.handleLoginFailure}
          cookiePolicy={"single_host_origin"}
          responseType="code,token"
        />
      </div>
    );
  }
}

export default GoogleLoginButton;
