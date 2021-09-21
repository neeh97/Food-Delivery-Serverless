import {useEffect} from "react";
import authenticator from "../../utils/authenticator";
import axios from "axios";
import {Redirect} from "react-router-dom";

const {useState} = require("react");

const Mfa = () => {
  const [mfaDetails, setMfaDetails] = useState({
    question: '',
    answer: ''
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [redirect, setRedirect] = useState(null);

  const handleOnChange = (event) => {
    setMfaDetails({...mfaDetails, [event.target.name]: event.target.value});
    console.log(mfaDetails)
  }

  const resetError = () => {
    setError(false);
    setErrorMessage('')
  }

  const onSubmit = (event) => {
    resetError();
    event.preventDefault();
    const email = localStorage !== undefined? localStorage.getItem('mfaAuthenticate') : null;
    axios.post("https://cbljdyxpil.execute-api.us-east-1.amazonaws.com/verify_mfa", {email:email, answer:mfaDetails.answer}).then(async (response) => {
      const data = await response;
      if (response.status === 412) {
        setError(true)
        setErrorMessage(data.message)
      } else {
        console.log(data)
        localStorage.setItem("userType", data.data.type)
        localStorage.setItem("userId", data.data.id)
        setRedirect('/dashboard')
      }
    }).catch((err) => {
      setError(true)
      console.log(err)
      setErrorMessage("Ivalid answer")
    })
  }

  useEffect(()=> {
    const email = localStorage !== undefined? localStorage.getItem('mfaAuthenticate') : null;
    if(!email) {
      setRedirect('/')
    } else {
      axios.post("https://cbljdyxpil.execute-api.us-east-1.amazonaws.com/fetch_user_question", {email:email}).then(async (response) => {
        const data = await response.data;
        if (response.status === 404) {
          authenticator.logout();
          setRedirect('/login');
        } else {
          setMfaDetails({question: data.question});
        }
        setLoading(false)
      }).catch(() => {
        authenticator.logout();
        setRedirect('/login')
        setLoading(false)
      })
    }
  }, [])

  if(redirect) return <Redirect to={redirect} />

  if(loading) return <div>Loading MFA question</div>

  return (
    <div>
      <div>MFA Authentication</div>
      <form onSubmit={onSubmit}>
        <div>{mfaDetails.question}</div>
        <div>
          <label htmlFor="answer">Answer</label>
          <input type="text" name="answer" required onChange={handleOnChange}/>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
        <div>{errorMessage}</div>
      </form>
    </div>
  )
}

export default Mfa;