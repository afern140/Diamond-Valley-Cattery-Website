export default function EditThumbnail({ handleThumbnailChange, thumbnail }) {
    return (
        <main className="min-h-screen relative text-[#092C48] pb-16">
            <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block mx-auto mb-4"
            />
            {thumbnail ? (
                <div className="text-center">
                    <img
                        src={thumbnail}
                        alt="Thumbnail"
                        className="block mx-auto w-32 h-32 rounded-full"
                    />
                </div>
            ) : null}
        </main>
    );
}