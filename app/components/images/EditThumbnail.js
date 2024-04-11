export default function EditThumbnail({ handleImageChange, thumbnail }) {

	return (
		<div className="image-uploader">
			<input 
				type="file" 
				accept="image"
				onChange={handleImageChange} 
			/>
			{thumbnail && <img src={URL.createObjectURL(thumbnail)} alt="Preview" style={{ width: '100px', height: 'auto' }} />}
		</div>
	);
}