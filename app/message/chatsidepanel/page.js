import React, { Component } from "react";
import ForwardOutlinedIcon from '@mui/icons-material/ForwardOutlined';
import firebase from "../../../../firebase";
import { connect } from "react-redux";
import {
  setCurrentChatRoom,
  setPrivateChatRoom,
} from "../../../../Redux/Actions/chatRoom_action";
import { getDatabase, ref, onChildAdded, onValue } from "firebase/database";

export class DirectMessages extends Component {
  state = {
    usersRef: ref(getDatabase(), "users"),
    users: [],
    activeChatRoom: "",
  };

  componentDidMount() {
    if (this.props.user) {
      this.addUsersListeners(this.props.user.uid);
      this.setActiveChatRoom(this.props.user.uid);

      // Add the onValue listener here
      onValue(this.state.usersRef, (snapshot) => {
        const updatedUsers = [];

        snapshot.forEach((childSnapshot) => {
          const user = childSnapshot.val();
          user.uid = childSnapshot.key;

          
          user.status = "online"; // You need to get the actual status from your data

          updatedUsers.push(user);
        });

        this.setState({ users: updatedUsers }, () => {
          console.log("Users Array:", this.state.users);
        });
      });
    }
  }

  addUsersListeners = (currentUserId) => {
    const { usersRef } = this.state;
    let usersArray = [];

    onChildAdded(usersRef, (DataSnapshot) => {
      if (currentUserId !== DataSnapshot.key) {
        let user = DataSnapshot.val();
        user["uid"] = DataSnapshot.key;
        user["status"] = "offline";
        usersArray.push(user);
        this.setState({ users: usersArray }, () => {
          console.log("Users Array:", this.state.users);
        });
      }
    });
  };

  getChatRoomId = (userId) => {
    const currentUserId = this.props.user.uid;

    return userId > currentUserId
      ? `${currentUserId}/${userId}`
      : `${userId}/${currentUserId}`;
  };

  changeChatRoom = (user) => {
    const chatRoomId = this.getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: `${user.first} ${user.last}`, 
    };

    this.props.dispatch(setCurrentChatRoom(chatRoomData));
    this.props.dispatch(setPrivateChatRoom(true));
    this.setActiveChatRoom(user.uid);
  };

  setActiveChatRoom = (userId) => {
    this.setState({ activeChatRoom: userId });
  };


  renderDirectMessages = (users) =>
    users.length > 0 &&
    users.map((user) => (
      <li
        key={user.uid}
        style={{
          backgroundColor:
            user.uid === this.state.activeChatRoom && "#ffffff45",
        }}
        onClick={() => this.changeChatRoom(user)}
      >
        {user.first} {user.last}
      </li>
    ));

  render() {
    const { users } = this.state;
    return (
      <div>
        <span style={{ display: "flex", alignItems: "center", marginBottom: "8px", fontSize: "1.1em", }}>
          <ForwardOutlinedIcon style={{  fontSize: "1.7em" }} /> DIRECT MESSAGES ({users.length})
        </span>

        <ul style={{ listStyleType: "none", padding: 0 }}>
          {this.renderDirectMessages(users)}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
  };
};

export default connect(mapStateToProps)(DirectMessages);
