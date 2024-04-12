export default function EditThumbnail({ handleImageChange, thumbnail }) {
    return (
        <main className="min-h-screen relative text-[#092C48] pb-16">
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block mx-auto mb-4"
            />
            {thumbnail && (
                <div className="text-center">
                    <img
                        src={URL.createObjectURL(thumbnail)}
                        alt="Thumbnail"
                        className="block mx-auto w-32 h-32 rounded-full"
                    />
                </div>
            )}
        </main>
    );
}