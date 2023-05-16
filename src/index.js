import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserDataProvider } from "./Context/UserDataContext";
import { HubConnectionProvider } from "./Context/hubConnectionContext";

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <UserDataProvider>
      <HubConnectionProvider>
        <App />
      </HubConnectionProvider>
    </UserDataProvider>
  </BrowserRouter>
);
