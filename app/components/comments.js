"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ApiDataProvider from "../_utils/api_provider";
import ApiDataContext from "../_utils/api_context";

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
            
            
         </main>
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