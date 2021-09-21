import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import authenticator from "../utils/authenticator";

let timerVariable;
const Chat = (props) => {
  const [message, setMessage] = useState("");
  const [incomingMessage, setIncomingMessage] = useState([]);
  useEffect(() => {
    // timerVariable = setInterval(getMessage, 15000)
    getMessage();
  }, []);

  const getMessage = () => {
    axios
      .post(
        "https://us-central1-intricate-grove-316621.cloudfunctions.net/get-message",
        {
          topic: "interact1",
          sub: `${localStorage.getItem("hotel")}_user`,
        }
      )
      .then((data) => {
        console.log(data);
        data?.data?.data?.message &&
          setIncomingMessage((value) => [
            ...value,
            { message: data?.data?.data?.message, isRemote: true },
          ]);
      })
      .catch((err) => {
        console.log(err);
        clearInterval(timerVariable);
        timerVariable = null;
      });
  };

  const sendMessage = () => {
    axios
      .post(
        "https://us-central1-intricate-grove-316621.cloudfunctions.net/send-message",
        {
          message: message,
          topic: "interact1",
        }
      )
      .then(() => {
        setIncomingMessage((val) => [
          ...val,
          { message: message, isRemote: false },
        ]);
        setMessage("");
      })
      .catch((err) => console.log(err));
  };

  const goBack = () => props.history.push("/")

  return (
    <div style={{ width: "70%", margin: "auto" }}>
      <p onClick={goBack}>Go Back</p>
      <h3 className="chat-header">Chat with representative</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {incomingMessage.length > 0 ? (
          incomingMessage.map((ele) => (
            <div
              className={`chat-message ${
                ele.isRemote ? "remote-message" : "my-message"
              }`}
            >
              {ele.message}
            </div>
          ))
        ) : (
          <div className="no-message-container">No new messages</div>
        )}
        <div>
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button onClick={sendMessage}>Send Message</button>
          <button onClick={getMessage}>Pull message</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
