"use client"
import React, { useEffect, useState } from "react";
import { strg, db } from "@/app/_utils/firebase";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { v4 } from "uuid";

function FirebaseImageUpload() {
    const [img, setImg] = useState('');
    const [tag, setTag] = useState('');
    const [imgUrl, setImgUrl] = useState([]);
    const [inputKey, setInputKey] = useState(Date.now());
    const [searchTag, setSearchTag] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const getAllImg = () => {
        listAll(ref(strg, "temp")).then(imgs => {
            const newUrls = [];
            imgs.items.forEach(val => {
                getDownloadURL(val).then(url => {
                    if (!newUrls.some(item => item === url)) {
                        newUrls.push(url);
                    }
                    if (newUrls.length === imgs.items.length) {
                        setImgUrl(newUrls);
                    }
                });
            });
        });
    }

    useEffect(() => {
        getAllImg();
    }, []);

    const handleClick = () => {
        if (img && tag !== undefined && tag !== '') {
            const imgRef = ref(strg, `temp/${v4()}`);
            uploadBytes(imgRef, img).then((snapshot) => {
                getDownloadURL(snapshot.ref).then(url => {
                    setImgUrl(data => [...data, url]);
                    const imgDocRef = doc(db, "img", v4());
                    setDoc(imgDocRef, { url: url, uploaded: new Date(), tag: tag })
                        .then(() => {
                            alert("Image URL saved to Firestore successfully.");
                        }).catch((error) => {
                            console.error("Error saving image URL to Firestore:", error);
                        });
                    setImg(null);
                    setTag('');
                    setInputKey(Date.now());
                })
            }).catch(error => {
                alert('Upload failed!');
                console.error('Upload error:', error);
            });
        } else {
            alert('img Or Tag is Empty', { autoClose: 1000 });
        }
    };

    const handleSearch = async () => {
        if (searchTag.trim() !== '') {
            const q = query(collection(db, "img"), where("tag", "==", searchTag.trim()));
            const querySnapshot = await getDocs(q);
            const results = [];
            querySnapshot.forEach((doc) => {
                results.push(doc.data().url);
            });
            setSearchResults(results);
            if (results.length == 0) {
                alert('No this Tag！', { autoClose: 1000 })
            }
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div className="p-5">
            
            <div className="mb-5">
                <input key={inputKey} type="file" onChange={(e) => setImg(e.target.files[0])} className="mr-2.5" />
                <input type="text" placeholder="Enter tag" value={tag} onChange={(e) => setTag(e.target.value)} className="mr-2.5" />
                <button onClick={handleClick} type="button">Upload</button>
            </div>
            <div className="mb-5">
                <input type="text" placeholder="Search by tag" value={searchTag} onChange={(e) => setSearchTag(e.target.value)} className="mr-2.5" />
                <button onClick={handleSearch}>Search</button>
            </div>
            {searchResults.length > 0 && (
                <>
                    <h2>Search Results:</h2>
                    <div className="flex flex-wrap gap-2.5">
                        {searchResults.map((url, index) => (
                            <img key={index} src={url} alt="Search Result" className="w-40 h-40" />
                        ))}
                    </div>
                </>
            )}
            <h2>All Images:</h2>
            <div className="flex flex-wrap gap-2.5">
                {imgUrl.map((dataVal, index) => (
                    <img key={index} src={dataVal} alt="Uploaded Image" className="w-40 h-40" />
                ))}
            </div>
        </div>

    )
}
export default FirebaseImageUpload;

//reference: https://www.youtube.com/watch?v=5986IgwaVKE