import {useState} from "react";
import authenticator from "../utils/authenticator";
import {Redirect} from "react-router-dom";

const Navbar = () => {
  const [redirect, setRedirect] = useState(false);
  const logout = () => {
    authenticator.logout()
    setRedirect(true)
  }
  if(redirect) return <Redirect to="/login" />
  return (
    <div>
      <div>Navbar</div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
export default Navbar;