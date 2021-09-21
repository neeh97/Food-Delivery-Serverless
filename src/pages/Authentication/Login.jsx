import {useState} from "react";
import {Redirect} from "react-router-dom";
import authenticator from "../../utils/authenticator";


const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const handleOnChange = (event) => {
    setUser({...user, [event.target.name]: event.target.value});
  }

  const onLogin = (event) => {
    event.preventDefault();
    setError(null);
    authenticator.login(user).then(() => {
      localStorage.setItem('mfaAuthenticate', user.email);
      localStorage.setItem("hotel", "fern")
      setRedirect(true)
    }).catch((err) => {
      setError(err.message);
    })
  }


  if (redirect) {
    return <Redirect to="/mfa" />
  }

  return (
    <div>
      <div>Login</div>
      <form onSubmit={onLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input required onChange={handleOnChange} name="email" type="text"/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input required onChange={handleOnChange} name="password" type="password"/>
        </div>
        <div style={{visibility: error? 'visible': 'hidden', color: "red"}} >
          {error}
        </div>
        <button type="submit">Login</button>
      </form>
      <a href="/registration">Register</a>
    </div>
  );
}

export default Login;