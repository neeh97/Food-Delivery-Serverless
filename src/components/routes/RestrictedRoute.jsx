import {Redirect, Route} from "react-router-dom";
import {Component} from "react";
import authenticator from "../../utils/authenticator";

const RestrictedRoute = ({component: Component, ...attributes}) => {
  console.log(authenticator.isLogin())
  return (
    <Route {...attributes} render={props => (
      authenticator.isLogin() ? <Redirect to="/"/>: <Component {...props}/>
    )} />
  )
}

export default RestrictedRoute;
