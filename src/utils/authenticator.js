import UserPool from "./UserPool";
import {AuthenticationDetails, CognitoUser} from "amazon-cognito-identity-js";

const authenticator = {
  signup: (user) => {
    return new Promise((resolve, reject) => {
      UserPool.signUp(user.email, user.password, [], null, (err, result) => {
        if(err) {
          reject(err)
        }
        resolve(result)
      })
    })
  },

  login: (userDetails) => {
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username: userDetails.email,
        Pool: UserPool
      });
      let authenticationDetails = new AuthenticationDetails({
        Username: userDetails.email,
        Password: userDetails.password
      });
      user.authenticateUser(authenticationDetails, {
        onSuccess: async ()=> {
          resolve();
        },
        onFailure: (err)=> {
          reject(err);
        }
      });
    })
  },

  getSession: () => {
    return new Promise((resolve, reject) => {
      const currentUser = UserPool.getCurrentUser();
      currentUser.getSession((error, session) => {
        if(error) reject(error);
        resolve(session);
      })
    })
  },

  isLogin: () => {
    const currentUser = UserPool.getCurrentUser();
    if (!currentUser) return false;
    return true;
  },

  getRedirectURI: () => {
    const email = localStorage !== undefined ? localStorage.getItem('mfaAuthenticate') : null;
    if (!email) return '/login';
    return '/mfa'
  },

  logout: () => {
    const currentUser = UserPool.getCurrentUser();
    currentUser.signOut();
  }
}

export default authenticator;