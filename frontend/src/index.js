import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Provider } from 'react-redux'
import store from './store'

import { positions, transitions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic'
import ChatProvider from "./Context/ChatProvider";
import { ConfigProvider } from 'antd';
import setAuthToken from './axios/setAuthToken';

const options = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE
}

if(localStorage.getItem("token")){
  setAuthToken(localStorage.getItem("token"));
}


ReactDOM.render(
    <Provider store={store} >
      <AlertProvider template={AlertTemplate} {...options}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#006241',
          },
        }}
      >
        <ChatProvider>
          <App />
        </ChatProvider>
     </ConfigProvider>

      </AlertProvider>
    </Provider>,
  document.getElementById('root')
);
