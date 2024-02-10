import Image from 'next/image'

const DisplayButton = () => {
    return (
        <button className="flex flex-col items-center justify-center p-6 rounded-lg bg-opacity-75 bg-slate-400 shadow-xl text-black mx-8 w-full">
            <div className="button-image">
                <Image
                    src="/img/Placeholder.png"
                    width={128}
                    height={128}/>
            </div>
            <p className="font-sans text-black font-normal mt-4 mb-2">Announcements</p>
        </button>
    );
  };
export default DisplayButton;