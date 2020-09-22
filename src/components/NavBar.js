import React, { Component } from "react";
import "../App.css";
import { Container, Icon, Image, Menu } from "semantic-ui-react";
import logo from "../assets/images/logos/CodeLabs_Logo2_White.png";

export default class NavBar extends Component {
  render() {
    return (
      <div>
        <Menu fixed="top" inverted>
          <Container>
            <Menu.Item as="a" header href="/">
              <Image size="tiny" src={logo} />
              &nbsp; Timereport UI
            </Menu.Item>
            <Menu.Item id="timereport-button" as="a" href="/timereport">
              <Icon name="calendar alternate outline" />
              Timereport
            </Menu.Item>
            <Menu.Item id="timereport-button" as="a" href="/summary">
              <Icon name="calendar alternate outline" />
              Summary
            </Menu.Item>
          </Container>
        </Menu>
      </div>
    );
  }
}
