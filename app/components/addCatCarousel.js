import React, { useState, useEffect } from 'react';
import { ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { getDownloadURL } from "firebase/storage";
import { imageDb,db } from "../_utils/firebase";
import { updateDoc, doc } from "firebase/firestore";

function AddCatCarousel({ onImageUpload, cat }) {
  const [imgPreview, setImgPreview] = useState('');
  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImgPreview(previewUrl);
      setFile(file);
    }
  };

  const handleConfirmUpload = async () => {
    try {
      if (file) {
        const imgRef = ref(imageDb, `images/${v4()}`);
        const snapshot = await uploadBytes(imgRef, file);
        const url = await getDownloadURL(snapshot.ref);
        
        if (!cat.carouselImage) {
          cat.carouselImage = [];
        }
        
        cat.carouselImage.push(url);
        await updateCatCarouselImage(cat.docId, cat.carouselImage);
        onImageUpload(url);
        setImgPreview('');
        setFile(null);
      } else {
        console.error("No file selected for upload.");
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const updateCatCarouselImage = async (docId, carouselImage) => {
    try {
      const catDocRef = doc(db, 'cats', docId);
      await updateDoc(catDocRef, { carouselImage });
    } catch (error) {
      console.error("Error updating carouselImage field: ", error);
    }
  };
  

  useEffect(() => {
    return () => {
      if (imgPreview) {
        URL.revokeObjectURL(imgPreview);
      }
    };
  }, [imgPreview]);

  return (
    <div>
      <div className="mt-8">
        <input type="file" onChange={handleImageChange} className="mb-2" />
        {imgPreview && <img src={imgPreview} alt="Preview" className="w-24 h-auto" />}
      </div>
      <button type="button" onClick={handleConfirmUpload} className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer">Confirm Upload</button>
    </div>
  );
}

export default AddCatCarousel;