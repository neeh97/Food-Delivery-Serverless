import {Redirect, Route} from "react-router-dom";
import {Component} from "react";
import authenticator from "../../utils/authenticator";

const PrivateRoute = ({component: Component, ...attributes}) => {
  return (
    <Route {...attributes} render={props => (
      authenticator.isLogin() ? <Component {...props}/> : <Redirect to={authenticator.getRedirectURI()}/>
    )} />
  )
};

export default PrivateRoute;

