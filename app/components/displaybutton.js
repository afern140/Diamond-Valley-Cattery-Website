import Image from 'next/image'

const DisplayButton = () => {
    return (
        <button className=" rounded-2xl bg-cat-gray-0 shadow-cat-default p-6 text-black mx-8 align-middle content-center items-center flex-col justify-center flex h-full grow">
            <div>
                <Image
                    alt="Placeholder"
                    src="/img/Placeholder.png"
                    width={128}
                    height={128}/>
            </div>
            <p className=" font-sans text-black font-normal mt-2.5">Announcements</p>
        </button>
    );
  };
export default DisplayButton;