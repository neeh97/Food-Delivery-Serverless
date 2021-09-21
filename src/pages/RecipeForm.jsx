import axios from "axios";
import React from "react";
import { useState } from "react";

const RecipeForm = () => {
  const [recipeText, setRecipeText] = useState("");

  const submitRecipe = () => {
    axios
      .post("https://us-central1-intricate-grove-316621.cloudfunctions.net/get-recipe-similarity", {
        text: recipeText,
      })
      .then((data) => console.log(data))
      .catch((err) => console.log("Error"));
  };

  return (
    <div style={{ width: "70%", margin: "auto" }}>
      <h3 className="chat-header">Chat with representative</h3>
      <div>Enter recipe details</div>
      <textarea
        className="recipe-area"
        rows={7}
        value={recipeText}
        onChange={(e) => setRecipeText(e.target.value)}
      />{" "}
      <br />
      <button onClick={submitRecipe}>Submit</button>
    </div>
  );
};

export default RecipeForm;
