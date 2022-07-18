import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider, InMemoryCache } from "@apollo/react-hooks";
import { CookiesProvider } from "react-cookie";

const client = new ApolloClient<InMemoryCache>({
  uri: "http://localhost:9000/graphql",
  cache: new InMemoryCache() as any,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);
