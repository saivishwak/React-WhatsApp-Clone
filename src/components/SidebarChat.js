import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import db from "../firebase";

function SearchCard({ id, name, seed }) {
  const [messages, setMessages] = useState("");

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  return (
    <Link to={`/rooms/${id}`} style={{ textDecoration: "none" }}>
      <div className="SidebarChat">
        <div className="sidebarChat__container">
          <Avatar src={`https://avatars.dicebear.com/api/bottts/${seed}.svg`} />
          <div className="SidebarChat__info">
            <h3>{name}</h3>
            <p>
              {messages[0]
                ? `Last message: ${messages[0].message}`
                : `Last message:`}
            </p>
          </div>
        </div>

        <hr />
      </div>
    </Link>
  );
}

export default SearchCard;
