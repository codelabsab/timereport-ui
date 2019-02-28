import { withAuth } from '@okta/okta-react';
import React, { Component } from 'react'
import "../App.css";
import { checkAuthentication } from '../helpers';
import { Container, Icon, Image, Menu } from 'semantic-ui-react';
import logo from '../assets/images/logos/CodeLabs_Logo2_White.png';


export default withAuth(class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: null };
    this.checkAuthentication = checkAuthentication.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  async componentDidMount() {
    this.checkAuthentication();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async login() {
    this.props.auth.login('/');
  }

  async logout() {
    this.props.auth.logout('/');
  }

  render() {
    return (
    <div>
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item as="a" header href="/">
          <Image size="tiny" src={logo} />
          &nbsp;
          Timereport UI
        </Menu.Item>
        <Menu.Item id="timereport-button" as="a" href="/timereport"><Icon name="calendar alternate outline" />Timereport</Menu.Item>}
        {this.state.authenticated === true && <Menu.Item id="logout-button" as="a" onClick={this.logout}>Logout</Menu.Item>}
      </Container>
    </Menu>
  </div>
);
}
});
