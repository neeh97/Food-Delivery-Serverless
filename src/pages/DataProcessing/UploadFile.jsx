import React, {useState} from "react";
import Navbar from "../Navbar";
import axios from "axios";

const UploadFile = () => {
  const [file, setFile] = useState(null)

  const handleFileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    axios.post("http://dataprocessing-env.eba-e9sem9qp.us-east-1.elasticbeanstalk.com/upload_menu", formData).then(async (result)=> {
      alert("Successfully Uploaded")
    })
  }
  return (
    <div>
      <Navbar/>
      <h1>Menu Upload</h1>

      <input type="file" onChange={event => setFile(event.target.files[0])} />
      <button onClick={handleFileSubmit}>
        Upload!
      </button>
    </div>
  )
}
export default UploadFile;