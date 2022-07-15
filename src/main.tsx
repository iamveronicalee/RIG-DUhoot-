import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloClient from "apollo-boost";
import {
  ApolloProvider,
  InMemoryCache,
} from "@apollo/react-hooks";

const client = new ApolloClient<InMemoryCache>({
  uri: "http://localhost:9000/graphql",
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);
