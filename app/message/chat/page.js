import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import firebase from "../../../../firebase";
import { useSelector } from "react-redux";
import { getDatabase, ref, set, remove, push, child } from "firebase/database";
import {
  getStorage,
  ref as strRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function MessageForm() {
  const chatRoom = useSelector((state) => state.chatRoom.currentChatRoom);
  const user = useSelector((state) => state.user.currentUser);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const messagesRef = ref(getDatabase(), "messages");
  const inputOpenImageRef = useRef();
  const typingRef = ref(getDatabase(), "typing");
  const isPrivateChatRoom = useSelector(
    (state) => state.chatRoom.isPrivateChatRoom
  );

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const createMessage = (fileUrl = null) => {
    const message = {
      timestamp: new Date(),
      user: {
        id: user.uid,
        name: user.displayName,
        image: user.photoURL,
      },
    };

    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = content;
    }

    return message;
  };

  const handleSubmit = async () => {
    if (!content) {
      setErrors((prev) => prev.concat("Type contents first"));
      return;
    }
    setLoading(true);

    try {
      await set(push(child(messagesRef, chatRoom.id)), createMessage());
      await remove(child(typingRef, `${chatRoom.id}/${user.uid}`));
      setLoading(false);
      setContent("");
      setErrors([]);
    } catch (error) {
      setErrors((pre) => pre.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  const handleOpenImageRef = () => {
    inputOpenImageRef.current.click();
  };

  const getPath = () => {
    return isPrivateChatRoom
      ? `/message/private/${chatRoom.id}`
      : `/message/public`;
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    const storage = getStorage();
    const filePath = `${getPath()}/${file.name}`;
    const metadata = { contentType: file.type };
    setLoading(true);

    try {
      const storageRef = strRef(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(progress);
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
            default:
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            set(
              push(child(messagesRef, chatRoom.id)),
              createMessage(downloadURL)
            );
            setLoading(false);
            setPercentage(0);
          });
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
      handleSubmit();
    }

    const userUid = user.uid;
    if (content) {
      set(ref(getDatabase(), `typing/${chatRoom.id}/${user.uid}`), {
        userUid: user.displayName,
      });
    } else {
      remove(ref(getDatabase(), `typing/${chatRoom.id}/${user.uid}`));
    }
  };

  return (
    <div>
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="Type your message"
        value={content}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Prevents a new line on Enter press
            handleSubmit();
          }
          handleKeyDown(e);
        }}
      />

      {!(percentage === 0 || percentage === 100) && (
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{ marginTop: 1 }}
        />
      )}

      <div>
        {errors.map((errorMsg) => (
          <Typography key={errorMsg} color="error">
            {errorMsg}
          </Typography>
        ))}
      </div>

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Button
            onClick={handleOpenImageRef}
            fullWidth
            variant="contained"
            color="secondary"
            disabled={loading ? true : false}
            sx={{ backgroundColor: "grey" }}
          >
            UPLOAD
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={handleSubmit}
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading ? true : false}
            sx={{ backgroundColor: "#4B87C5" }}
          >
            SEND
          </Button>
        </Grid>
      </Grid>

      <input
        accept="image/jpeg, image/png"
        style={{ display: "none" }}
        type="file"
        ref={inputOpenImageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}

export default MessageForm;
