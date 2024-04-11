import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { doc, updateDoc } from "firebase/firestore";
import { strg, db } from "../_utils/firebase";

function LitterCarouselController({ onImageUpload, litter }) {
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
        const storagePath = `images/${uuidv4()}`;
        const imgRef = ref(strg, storagePath);
        const snapshot = await uploadBytes(imgRef, file);
        const url = await getDownloadURL(snapshot.ref);

        const imageInfo = { url, storagePath };

        if (!litter.carouselImage) {
            litter.carouselImage = [];
        }

        litter.carouselImage.push(imageInfo);
        await updateLitterCarouselImage(litter.docId, litter.carouselImage);
        setImgPreview('');
        setFile(null);
      } else {
        console.error("No file selected for upload.");
        alert("Please select an image to upload.");
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const updateLitterCarouselImage = async (docId, carouselImage) => {
    try {
      const litterDocRef = doc(db, 'litters', docId);
      await updateDoc(litterDocRef, { carouselImage });
      onImageUpload();
      alert("Image uploaded successfully.");
    } catch (error) {
      console.error("Error updating carouselImage field: ", error);
    }
  };

  const handleDeleteImage = async (imageInfo, index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (confirmDelete) {
      try {
        const imgRef = ref(strg, imageInfo.storagePath);
        await deleteObject(imgRef);

        litter.carouselImage.splice(index, 1);
        await updateLitterCarouselImage(litter.docId, litter.carouselImage);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const handleCancelUpload = () => {
    setImgPreview('');
    setFile(null);
  };

  useEffect(() => {
    return () => {
      if (imgPreview) {
        URL.revokeObjectURL(imgPreview);
      }
    };
  }, [imgPreview]);

  return (
    <>
      <div className="mt-8 flex flex-col items-center">
      <input type="file" onChange={handleImageChange} className="mb-2 mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100" />

        {imgPreview && <img src={imgPreview} alt="Preview" className="w-32 h-32 object-cover mt-4 rounded-lg shadow-lg" />}
      </div>
      <button type="button" onClick={handleConfirmUpload} className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-105">Confirm Upload</button>
      <button type="button" onClick={handleCancelUpload} className="bg-gray-300 text-gray-700 py-2 px-4 mt-4 ml-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-150 ease-in-out">Cancel Upload</button>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {litter.carouselImage && litter.carouselImage.map((imageInfo, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={imageInfo.url} alt="Carousel" className="w-24 h-24 object-cover rounded-lg shadow-md" />
            <button onClick={() => handleDeleteImage(imageInfo, index)} className="bg-red-500 text-white py-1 px-2 mt-2 rounded-lg hover:bg-red-600 transition duration-150 ease-in-out">Delete</button>
          </div>
        ))}
      </div>
    </>
  );
}

export default LitterCarouselController;