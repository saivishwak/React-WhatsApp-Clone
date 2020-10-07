import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { IconButton } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import EmojiEmotionsOutlinedIcon from "@material-ui/icons/EmojiEmotionsOutlined";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import MicNoneOutlinedIcon from "@material-ui/icons/MicNoneOutlined";
import axios from "../axios.js";
import { useParams } from "react-router-dom";
import db from "../firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function Chat() {
  const [{ user }, dispatch] = useStateValue();
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [showemojis, setShowEmojis] = useState(false);
  const [roomDetails, setRoomDetails] = useState({ name: "", seed: "" });
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomDetails(snapshot.data()));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  console.log(roomDetails);
  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    // For MERN stack Implementation
    //axios.post("/api/v1/messages/new", {
      //message: input,
     // name: "John",
     // timestamp: "demo time stamp",
     // received: true,
    //});

    setInput("");
  };
  const myFunction = () => {
    document.querySelector(".chat__dropdown").classList.toggle("show");
  };

  const addEmoji = (e) => {
    setInput(input + e.native);
  };

  const showEmojis = () => {
    if (showemojis) {
      setShowEmojis(false);
    } else {
      setShowEmojis(true);
    }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          src={`https://avatars.dicebear.com/api/bottts/${roomDetails.seed}.svg`}
        />
        <div className="chat__headerInfo">
          <h3>{roomDetails.name}</h3>
          <p>
            Last Message at{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <SearchOutlinedIcon />
          <MoreHorizIcon onClick={myFunction} />
          <div className="chat__dropdown">
            <a>Welcom to FullStack Message App 🔥</a>
          </div>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__sent"
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat__footer">
        {showemojis ? (
          <span className="chat__Picker">
            <Picker
              onSelect={addEmoji}
              emojiTooltip={true}
              title="Emojis"
              style={{
                position: "absolute",
                bottom: "12%",
                right: "40%",
              }}
            />
            <EmojiEmotionsOutlinedIcon
              onClick={showEmojis}
              className="chat__emojiButton"
            />
          </span>
        ) : (
          <EmojiEmotionsOutlinedIcon
            onClick={showEmojis}
            className="chat__emojiButton"
          />
        )}

        <AttachFileOutlinedIcon />
        <form>
          <input
            placeholder="Type a message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            Send Message
          </button>
        </form>
        <MicNoneOutlinedIcon />
      </div>
    </div>
  );
}

export default Chat;
