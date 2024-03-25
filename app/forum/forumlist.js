import React, { useState, useEffect } from "react";
import Link from "next/link";
import ApiDataContext from "../_utils/api_context";

export default function ForumList() {
    const { forums } = React.useContext(ApiDataContext);
    const dbdata = React.useContext(ApiDataContext);

    useEffect(() => {
        console.log("ForumList page dbdata updated!");
        console.log("Forums are: ")
        console.log(forums);
        console.log("dbdata is: ");
        console.log(dbdata);    
    }, [forums]);

    return (
        <main className="flex flex-col items-center pt-10">
            <h1 className="text-5xl font-bold mb-4">Forums</h1>
            {!forums && <p>Loading...</p>}
            {forums &&
                forums.map((forum) => (
                    <Forum
                        key={forum.id}
                        forumID={forum.id}
                        forumName={forum.name}
                        forumDesc={forum.description}
                    />
                ))}
        </main>
    );
}

function Forum({ forumID, forumName, forumDesc}) {
    return (
        <div>
            <h2 className="text-2xl font-bold">
                <Link href={`/forum/${forumID}`}>{forumName}</Link>
            </h2>
            <p>{forumDesc}</p>
        </div>
    );
}