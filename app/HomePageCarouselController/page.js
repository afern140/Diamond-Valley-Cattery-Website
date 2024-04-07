"use client"
import React, { useEffect, useState } from "react";
import { imageDb, db } from "@/app/_utils/firebase";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { doc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function HomePageCarouselController() {
    const [img, setImg] = useState(null);
    const [imgData, setImgData] = useState([]);
    const [inputKey, setInputKey] = useState(Date.now());
    const [previewUrl, setPreviewUrl] = useState(null);

    const getAllImg = () => {
        const imgCollectionRef = collection(db, 'HomeCarousel');
        getDocs(imgCollectionRef).then(querySnapshot => {
            const newData = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                newData.push({ ...data, id: doc.id });
            });
            setImgData(newData);
        }).catch(error => {
            console.error('Error getting images from Firestore:', error);
        });
    };

    useEffect(() => {
        getAllImg();
    }, []);

    useEffect(() => {
        if (img) {
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setPreviewUrl(fileReader.result);
            };
            fileReader.readAsDataURL(img);
        }
    }, [img]);

    const handleClick = () => {
        if (img) {
            const storagePath = `temp/${uuidv4()}`;
            const imgRef = ref(imageDb, storagePath);
            uploadBytes(imgRef, img).then((snapshot) => {
                getDownloadURL(snapshot.ref).then(url => {
                    const imgDocRef = doc(db, "HomeCarousel", uuidv4());
                    setDoc(imgDocRef, { url, storagePath })
                        .then(() => {
                            alert("Image uploaded and URL saved to Firestore successfully.");
                            getAllImg();
                            setPreviewUrl(null); // Clear preview after upload
                        }).catch((error) => {
                            console.error("Error saving image URL to Firestore:", error);
                        });
                    setImg(null);
                    setInputKey(Date.now());
                })
            }).catch(error => {
                alert('Upload failed!');
                console.error('Upload error:', error);
            });
        } else {
            alert('Image or Tag is Empty');
        }
    };

    const handleDelete = async (id, storagePath) => {
        if (!storagePath) {
            console.error("Storage path is not defined.");
            return;
        }
        const fullPath = storagePath.startsWith('temp/') ? storagePath : `temp/${storagePath}`;
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (confirmDelete) {
            await deleteDoc(doc(db, "HomeCarousel", id));
            const imgRef = ref(imageDb, fullPath);
            deleteObject(imgRef).then(() => {
                alert("Image deleted successfully.");
                getAllImg();
            }).catch(error => {
                console.error("Error deleting image:", error);
            });
        }
    };

    return (
        <div className="p-5 space-y-10">
            <h2 className="text-2xl font-bold">Add Home Carousel Images</h2>
            <div className="flex items-center space-x-2">
                {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm" />
                )}
                <input key={inputKey} type="file" onChange={(e) => setImg(e.target.files[0])} className="file:mr-4 file:border-0 file:py-2 file:px-4 file:rounded file:bg-blue-500 file:text-white" />
                <button onClick={handleClick} type="button" className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">Upload</button>
            </div>
            <h2 className="text-2xl font-bold">All Home Carousel Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imgData.map(({ url, id, storagePath }) => (
                    <div key={id} className="relative">
                        <img src={url} alt="Uploaded Image" className="w-full h-40 object-cover rounded-lg shadow" />
                        <button onClick={() => handleDelete(id, storagePath)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default HomePageCarouselController;