import { createRoot } from 'react-dom/client';
import React, { useContext, createContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Base from './pages/Base';
import Home from './pages/Home';
import Auth from './pages/Auth';
import NoPage from './pages/NoPage';
import './index.css'

import reportWebVitals from './reportWebVitals';

import { UserService } from './services';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import { registerServiceWorker } from './serviceWorker';

export const UserContext = createContext()
const userService = new UserService()

const UserProvider = ({ children }) => {

  const [userLoggedIn, setUserLoggedIn] = useState(userService.isLoggedIn);
  const context = {
    userService,
    setUserLoggedIn,
    userLoggedIn
  }

  return (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  )
}

function PrivateRoute({ children }) {
  const context = useContext(UserContext)
  const { isLoggedIn } = context.userService

  if (!isLoggedIn) {
    return <Navigate to="/" replace />
  }

  return children
}

const api_uri = 'http://'  + process.env.REACT_APP_API_HOST + ':5002/graphql';
console.log(api_uri);

// TODO check for host first
const httpLink = createHttpLink({  
  uri: api_uri
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = sessionStorage.getItem('apiKey');
  const apiKey = JSON.parse(token); 
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${apiKey}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


export default function App() {
  return (
    <React.StrictMode>
      <UserProvider>
      <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Base />}>
            <Route index element={<Landing />} />
            <Route  path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </ApolloProvider>
      </UserProvider>
    </React.StrictMode>
  )
}

const root = createRoot(document.getElementById('root')); // createRoot(container!) if you use TypeScript
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

setTimeout(registerServiceWorker, 5000);
