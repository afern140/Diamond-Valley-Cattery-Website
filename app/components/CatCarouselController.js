import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { doc, updateDoc } from "firebase/firestore";
import { imageDb, db } from "../_utils/firebase";

function CatCarouselController({ onImageUpload, cat }) {
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
        const imgRef = ref(imageDb, storagePath);
        const snapshot = await uploadBytes(imgRef, file);
        const url = await getDownloadURL(snapshot.ref);

        const imageInfo = { url, storagePath };

        if (!cat.carouselImage) {
          cat.carouselImage = [];
        }

        cat.carouselImage.push(imageInfo);
        await updateCatCarouselImage(cat.docId, cat.carouselImage);
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

  const updateCatCarouselImage = async (docId, carouselImage) => {
    try {
      const catDocRef = doc(db, 'cats', docId);
      await updateDoc(catDocRef, { carouselImage });
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
        const imgRef = ref(imageDb, imageInfo.storagePath);
        await deleteObject(imgRef);

        cat.carouselImage.splice(index, 1);
        await updateCatCarouselImage(cat.docId, cat.carouselImage);
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
    <div className="w-4/5 mx-auto bg-white rounded-xl drop-shadow-lg p-10 mt-6">
      <h1 className="text-center text-2xl font-bold">Cat Images</h1>
      <div className="mt-8 flex items-center">
        <label htmlFor="carouselDrop" className="h-[300px] w-auto min-w-[300px] m-4 rounded-xl border-4 border-dashed border-gray-300 hover:scale-105 hover:cursor-pointer transition duration-300">
          <input hidden id="carouselDrop" type="file" onChange={handleImageChange} className=" relative z-50 mr-4 py-2 px-4 rounded-full border-0 text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100" />
          <div className="w-1/2 h-1/2 relative flex mx-auto translate-y-1/2">
            <div className="bg-gray-300 w-full h-2 absolute top-1/2 -translate-y-1/2 rounded" />
            <div className="bg-gray-300 w-2 h-full absolute left-1/2 -translate-x-1/2 rounded" />
          </div>
        </label>
        {imgPreview && <img src={imgPreview} alt="Preview" className="h-[300px] w-auto object-cover rounded-lg drop-shadow-lg" />}
      </div>
      <div className="flex justify-center w-full">
        <button type="button" onClick={handleConfirmUpload} className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out transform hover:scale-105 focus:scale-95 focus:bg-blue-700">Confirm Upload</button>
        <button type="button" onClick={handleCancelUpload} className="bg-gray-300 text-gray-700 py-2 px-4 mt-4 ml-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-150 ease-in-out">Cancel Upload</button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {cat.carouselImage && cat.carouselImage.map((imageInfo, index) => (
          <div key={index} className="flex flex-col items-center">
            <img src={imageInfo.url} alt="Carousel" className="w-24 h-24 object-cover rounded-lg shadow-md" />
            <button onClick={() => handleDeleteImage(imageInfo, index)} className="bg-red-500 text-white py-1 px-2 mt-2 rounded-lg hover:bg-red-600 transition duration-150 ease-in-out">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatCarouselController;