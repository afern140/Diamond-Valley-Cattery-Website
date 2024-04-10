import React, { useState, useEffect } from 'react';

function ImageUploader({ onImageSelected, inputKey }) {
  const [imgPreview, setImgPreview] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);


      const img = new Image();
      img.src = previewUrl;
      img.onload = () => {

        if (img.width !== img.height) {

          alert('The uploaded image must be a square。');
          setImgPreview(''); 
          if (onImageSelected) {
            onImageSelected(null); 
          }
          URL.revokeObjectURL(previewUrl);
        } else {

          setImgPreview(previewUrl);
          if (onImageSelected) {
            onImageSelected(file);
          }

        }
      };
    }
  };

  useEffect(() => {

    if (imgPreview) {
      URL.revokeObjectURL(imgPreview);
      setImgPreview('');
    }
  }, [inputKey]); 

  useEffect(() => {

    return () => {
      if (imgPreview) {
        URL.revokeObjectURL(imgPreview);
      }
    };
  }, [imgPreview]);

  // -- F -- Drag and Drop

  return (
    <div className="image-uploader relative max-w-[300px] max-h-[300px] size-full">
      {imgPreview ? 
        <label className="relative z-10 rounded-xl overflow-hidden" onChange={handleImageChange} htmlFor="pfpDrop">
            <img htmlFor="pfpDrop"  className="-z-10" src={imgPreview} alt="Preview" style={{ width: '300px', height: 'auto' }} />
            <input hidden className="size-full opacity-0 relative z-50" id="pfpDrop" key={inputKey} type="file" onChange={handleImageChange} />
            <div htmlFor="pfpDrop"  className="absolute size-full bg-gray-700 top-0 rounded-xl bg-opacity-0 hover:bg-opacity-70 border-4 border-dashed border-gray-100 border-opacity-0 hover:border-opacity-70 opacity-0 hover:opacity-100 transition duration-300">
              <div htmlFor="pfpDrop"  className="absolute w-48 top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2">
                <p htmlFor="pfpDrop"  className=" px-4 relative py-2 mx-auto w-fit border-2 bg-gray-900 rounded-xl bg-opacity-90">Edit Picture</p>
              </div>
            </div>
        </label>
        : <div htmlFor="pfpDrop"  className="relative size-full border-4 border-dashed rounded-xl">
            <label htmlFor="pfpDrop"  className="relative z-10 rounded-xl overflow-hidden" onChange={handleImageChange}>
                <input className="size-full opacity-0 relative z-10" id="pfpDrop" key={inputKey} type="file" onChange={handleImageChange} />
                <div htmlFor="pfpDrop" className="relative size-full -z-10">
                  <div htmlFor="pfpDrop" className="absolute bg-gray-200 w-1/2 h-2 ml-[25%] -mt-[50%] -translate-y-1/2 rounded" />
                  <div htmlFor="pfpDrop" className="absolute bg-gray-200 h-1/2 w-2 ml-[50%] -mt-[75%] -translate-x-1/2 rounded" />
                </div>
                <div htmlFor="pfpDrop"  className="absolute z-20 -translate-y-[3px] w-full h-1/2 bg-gray-700 top-0 rounded-lg bg-opacity-0 hover:bg-opacity-70 opacity-0 hover:opacity-100 transition duration-300">
                  <div htmlFor="pfpDrop"  className="absolute w-48 top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2">
                    <p htmlFor="pfpDrop"  className=" px-4 relative py-2 mx-auto w-fit border-2 bg-gray-900 rounded-xl bg-opacity-90">Upload Picture</p>
                  </div>
                </div>
            </label>
          </div>}
    </div>
  );
}

export default ImageUploader;