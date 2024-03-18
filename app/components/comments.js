"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ApiDataProvider from "../_utils/api_provider";
import ApiDataContext from "../_utils/api_context";
import {db} from "../_utils/firebase";
import {auth} from "../_utils/firebase";
import {collection,addDoc} from "firebase/firestore";

export default function Comments() {
   const dbdata = React.useContext(ApiDataContext);
   const { comments } = React.useContext(ApiDataContext);

   useEffect(() => {
      console.log("Comments page dbdata updated!");
      console.log(comments);
   }, [dbdata]);

   return (
      <main>
         <h1 className="text-5xl font-bold">Comments</h1>
         Hello this is a test of the comments system.
         {!comments && <p>Loading...</p>}
         {comments &&
            comments.map((comment) => (
            <Comment 
            catName={comment.catName}
            message={comment.message}
            createName={comment.createName}
            />
            ))
            
         }
         <NewComment/>         
      </main>
   );
    
}

async function addComment(commentDoc){
   console.log("Entered addComment.")
   const itemsRef = collection(db, 'comments');
   const docRef = await addDoc(itemsRef, commentDoc);
   return docRef.id;
}

function NewComment() {
   const [message, setMessage] = useState("");
   
   async function handleAddComment(e){
      e.preventDefault();
      console.log("Adding comment.");
      const commentDoc = {
         message: message,
         createUID: auth.currentUser.uid,
         createName: auth.currentUser.displayName,
         catID: "666",
         catName: "Test Cat"         
      };
      await addComment(commentDoc);
      window.location.reload();
   }

   return(
      <div>
         <h2 className="text-3xl flex flex-col items-center">New Comment</h2>
         <form onSubmit={handleAddComment} className="mb-8 flex flex-col items-center">
            <input  
               type="text"
               placeholder="Comment Here"
               value = {message}
               onChange={(e) => setMessage(e.target.value)}
               className="border-s-4 border-slate-300 p-2 mb-4 text-black"
            />
            <button type="submit" className="bg-slate-400 active:bg-slate-600 rounded text-white p-2">
               Submit
            </button>
         </form>
      </div>
   );
}

function Comment({catName, message, createName}) {
   return (
      <div>
         <h2 className="text-3xl">{catName}</h2>
         <p>{message}</p>
         <p>Created by: {createName}</p>
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