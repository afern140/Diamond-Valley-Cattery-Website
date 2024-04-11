"use client"
import React, { useState, useEffect } from "react";
import {db} from "../_utils/firebase";
import {auth} from "../_utils/firebase";
import {collection,addDoc,query,getDocs,Timestamp} from "firebase/firestore";

export default function Comments(cat) {
   const [comments, setComments] = useState([]);

   useEffect(() => {
    console.log("No cats are good cats.")
      try {
         getComments(cat).then((comments) => {
            const sortedComments = comments.sort((a, b) => b.createTime - a.createTime);
            setComments(sortedComments);
         });
      }
      catch (error) {
         console.error("Error getting comments: ", error);
      }
   }, [] );


   return (
      <section className="text-gray-800 pt-4 ">
         <h1 className="text-5xl font-bold text-center text-gray-700 dark:text-dark-header-text-0 drop-shadow">Comments</h1>
         <div className="mx-40 m-auto flex-col justify-center bg-white dark:bg-gray-500 bg-opacity-100 mt-10 p-4 drop-shadow-lg rounded-xl  overflow-hidden">
            {comments.map((comment) => (
            <Comment 
            key={comment.id}
            createTime={comment.createTime ? new Date(comment.createTime.toDate().toISOString().split('T'[0])) : new Date() }
            catName={comment.catName}
            message={comment.message}
            createName={comment.createName}
            />
            ))}
            <NewComment cat={cat.cat} setComments={setComments}/>
         </div>
      </section>
   );
}

async function getComments(cat){
   const itemsRef = collection(db, 'cats', cat.cat.docId, 'comments');
   const q = query(itemsRef);
   const snapshot = await getDocs(q);
   const itemsList = snapshot.docs.map((doc) => {
      return {id: doc.id, ...doc.data()};
   });
   return itemsList;
}

async function addComment(commentDoc,cat){
   //console.log("Entered addComment.")
   const itemsRef = collection(db, 'cats', cat.cat.docId, 'comments');
   console.log("Cat in add comment is: ");
   console.log(cat.cat.docId);
   const docRef = await addDoc(itemsRef, commentDoc);
   return docRef.id;
}

function NewComment(cat, setComments) {
   const [message, setMessage] = useState("");
   const currentCat = cat.cat;
   
   async function handleAddComment(e){
      e.preventDefault();

      // Validate the message
      if(typeof message !== "string" || !message.trim()){
        alert("Please enter a valid message.")
        return;
      }

      // Check message length
      if(message.length > 1024){
        alert("Your comments is too long. Please limit it to 1024 characters.");
        return;
      }

      const date = new Date();
      const timestamp = Timestamp.fromDate(date);
      const commentDoc = {
         message: message,
         createUID: auth.currentUser.uid,
         createName: auth.currentUser.displayName,
         catID: currentCat.id,
         catName: currentCat.name,
         createTime: timestamp
      };
      await addComment(commentDoc,cat);
      setMessage("");
      setComments((prevComments) => [...prevComments, commentDoc]);
      //window.location.reload();
   }

   return(
      <div className="text-black mt-8">
         <h2 className="text-3xl flex flex-col items-center pb-4">New Comment</h2>
         <form onSubmit={handleAddComment} className="mb-8 flex flex-col items-center">
            <input  
               type="text"
               placeholder="Comment Here"
               value = {message}
               onChange={(e) => setMessage(e.target.value)}
               className="border-s-4 border-[#c7c7e1] p-2 mb-16 w-[400px] drop-shadow-lg text-black bg-navbar-body-1"
            />
            <button type="submit" className=" drop-shadow-lg bg-[#e5e5ff] rounded text-black py-4 text-2xl px-6 transition duration-300 hover:scale-110">
               Submit
            </button>
         </form>
      </div>
   );
}

function Comment({catName, message, createName,createTime}) {
    console.log("Entered Comment.");
    console.log(createTime);
   return (
      <div className="text-black">
         <h2 className="text-3xl">{catName}</h2>
         <p>{message}</p>
         <p>Created by: {createName}</p>
         <p>Posted on: {createTime.toISOString()}</p>
      </div>
   );
}

/**
 * References for page:
 * 

    **Possible for Firestore**
    
    I would suggest that you create a sub-collection of posts called comments and put the comments for each post, inside the post document. You can do the same with comments of comments. You can create a sub-collection of the comments sub-collection, also called comments. When it becomes possible to query for comments in all sub-collections, you'll easily be able to get all of this data in a single query.

    In your likes collection documents, I would change the userId field and replace it with createdUserId and likedUserId. Then you can query for all likes by a particular user's posts or all likes by a user.

    This is entirely a good fit for Cloud Firestore

    You should have a collection of hashtags. You will also need to store the hashtags used in a post, in a map of values, to allow querying.

    From https://stackoverflow.com/questions/48820787/getting-list-of-all-posts-with-user-like-and-total-likes-for-each-post-in-firest?rq=1

    **Possible for Implementation**
    Use Firestore to make comment collection
    each comment is a document in the collection containing:
    message: which holds the message
    createuid: which holds the user id of the user who created the comment
    date: which holds the date the comment was created
    catid: which holds the id of the cat the comment is for

    Todo: implement a method to get all comments for a cat
 */