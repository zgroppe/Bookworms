import '../Styles/Login.css';

import React, { useState } from 'react';

import auth from '../Components/Auth';
import Screens from '../Screens';
import { Card, Hyperlink, PrimaryButton, SubtitleText, TextInput, TitleText } from './../Styles/StyledComponents';

// This will be changed to david's login component when it is finished
export default function Login(props) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card>
      <div
        style={{
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          width: "35vw"
        }}
      >
        <TitleText>Login</TitleText>
        <SubtitleText>
          Clock-in with your username
          <br />
          Log-in with your username and password
        </SubtitleText>
      </div>
      <div
        style={{
          flexDirection: "column",
          padding: "4vh",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center"
        }}
      >
        <TextInput
          placeholder="username"
          type="text"
          value={userName}
          onChange={e => setUsername(e.target.value)}
        />
        <TextInput
          placeholder="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div
          style={{
            width: "20vw",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <Hyperlink href="https://styled-components.com/">
            forgot password
          </Hyperlink>
        </div>
        <PrimaryButton
          onClick={() => {
            auth.login(() => {
              props.history.push(Screens[0].path);
            });
          }}
        >
          Help
        </PrimaryButton>
      </div>
    </Card>
  );
}
