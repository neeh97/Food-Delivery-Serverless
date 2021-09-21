import {useState} from "react";
import  { Redirect } from 'react-router-dom'
import axios from "axios";
import authenticator from "../../utils/authenticator";


const Registration = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    type: 'User',
    question: '',
    answer: ''
  })

  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const onRegistration= async (event) => {
    event.preventDefault();
    setError(null);
    if(user.rePassword !== user.password ){
      setError("Password Mismatch");
    } else {
      const {password, rePassword, ...registrationAPIPayload} = user;
      const response = await axios.put('https://cbljdyxpil.execute-api.us-east-1.amazonaws.com/registration', registrationAPIPayload)
      if (response.status === 412) {
        setError("User Already Exists");
      } else {
        authenticator.signup(user).then(()=>{
          setRedirect(true);
        }).catch((err) => {
          setError(err.message);
        })
      }
    }
  }
  const handleOnChange = (event) => {
    setUser({...user, [event.target.name]: event.target.value});
  }

  if (redirect) {
    return <Redirect to="/login" />
  }

  return (
    <div>
      <div>Registration</div>
      <form onSubmit={onRegistration}>
        <div>
          <label htmlFor="name">Name</label>
          <input required onChange={handleOnChange} name="name" type="text"/>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input required onChange={handleOnChange} name="email" type="text"/>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input required onChange={handleOnChange} name="password" type="password"/>
        </div>
        <div>
          <label htmlFor="rePassword">Re Enter Password</label>
          <input onChange={handleOnChange} name="rePassword" type="password" required/>
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <select name="type" onChange={handleOnChange}>
            <option value="User">User</option>
            <option value="Restaurant">Restaurant</option>
          </select>
        </div>
        <div>
          <label htmlFor="question">Security Question</label>
          <input required onChange={handleOnChange} name="question" type="text"/>
        </div>
        <div>
          <label htmlFor="Answer">Answer</label>
          <input required onChange={handleOnChange} name="answer" type="text"/>
        </div>
        <div style={{visibility: error? 'visible': 'hidden', color: "red"}} >
          {error}
        </div>
        <button type="submit">Register</button>
      </form>
      <div>Note: Once Registered, verify the email and login.</div>
    </div>
  );
}

export default Registration;