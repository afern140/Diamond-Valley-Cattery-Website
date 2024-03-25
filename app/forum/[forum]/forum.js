import ApiDataContext from "@/app/_utils/api_context";
import {useUserAuth} from "@/app/_utils/auth-context";
import { useEffect,useState } from "react";
import { db } from "@/app/_utils/firebase";


export default function Page({params}) {
    const [forum, setForum] = useState(null);
    
    useEffect(() => {
        console.log("Params are: ")
        console.log(params.forum);
        loadForum(params.forum);
    });

    return(
        <main>
            Hi testing
        </main>
    )
    

}

async function loadForum(forumID) {
    const forumRef = collection(db, "forums", );
	const forumQuery = query(forumRef);
	const forumListSnapshot = await getDocs(forumQuery);
	const forumList = [];
	forumListSnapshot.forEach((doc) => {
		const forumData = {id: doc.id, ...doc.data()};
		forumList.push(forumData);
	});
	setForum(forumList);
}