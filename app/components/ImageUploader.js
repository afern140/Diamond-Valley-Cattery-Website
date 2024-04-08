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

  return (
    <div className="image-uploader">
      <input key={inputKey} type="file" onChange={handleImageChange} />
      {imgPreview && <img src={imgPreview} alt="Preview" style={{ width: '100px', height: 'auto' }} />}
    </div>
  );
}

export default ImageUploader;