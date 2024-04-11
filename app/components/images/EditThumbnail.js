export default function EditThumbnail({ handleImageChange }) {

	return (
		<div className="image-uploader">
			<input 
				type="file" 
				accept="image"
				onChange={handleImageChange} 
			/>
			{imgPreview && <img src={imgPreview} alt="Preview" style={{ width: '100px', height: 'auto' }} />}
		</div>
	);
}