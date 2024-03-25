import React, { useState, useEffect } from 'react';

function ImageUploader({ onImageSelected, inputKey }) { 
  const [imgPreview, setImgPreview] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImgPreview(previewUrl);
      if (onImageSelected) {
        onImageSelected(file); 
      }
    }
  };

  useEffect(() => {
    setImgPreview('');
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
      {imgPreview && <img src={imgPreview} alt="Preview" style={{ width: '100%', height: 'auto' }} />}
    </div>
  );
}

export default ImageUploader;