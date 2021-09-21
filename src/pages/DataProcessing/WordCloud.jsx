import React, {useEffect, useState} from "react";
import Navbar from "../Navbar";
import axios from "axios";

const WordCloud = () => {
  const [imageUrl, setImageUrl] = useState(null)
  useEffect(()=>{
    axios.get("http://dataprocessing-env.eba-e9sem9qp.us-east-1.elasticbeanstalk.com/fetch/word_cloud").then(async (response) => {
      const data = await response.data;
      setImageUrl(data.image_url)
    })
  }, [])
  return (
    <div>
      <Navbar/>
      <h1>Word Cloud</h1>
      <img src={imageUrl} alt="Word Cloud"/>
    </div>
  )
}
export default WordCloud;