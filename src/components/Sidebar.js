import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import AddIcon from "@material-ui/icons/Add";
import db from "../firebase";
import { useStateValue } from "../StateProvider";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const unsubcribe = db.collection("rooms").onSnapshot((snapshot) => {
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return () => {
      unsubcribe();
    };
  }, []);

  const addChat = () => {
    alert("Sorry you are not authorized!");
    {
      /* 
    const roomName = prompt("Please Enter Chat Room Name");

    if (roomName) {
      //Database
      db.collection("rooms").add({
        name: roomName,
        seed: Math.floor(Math.random() * 5000),
      });
    }
    */
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__headerLeft">
          <Avatar src={user?.photoURL} alt="Profile Pic" />
          <h3>{user.displayName ? `Hi, ${user.displayName}` : `Hi`}</h3>
        </div>

        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <AddIcon onClick={addChat} />
          </IconButton>
          <IconButton>
            <MoreHorizIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        {rooms.map((room) => (
          <SidebarChat
            key={room.id}
            id={room.id}
            name={room.data.name}
            seed={room.data.seed}
          />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
