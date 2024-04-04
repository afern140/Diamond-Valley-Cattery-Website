import Image from 'next/image'

const DisplayButton = () => {
    return (
        /*<button className=" max-w-[300px] rounded-2xl bg-[#F6DCE6] border-2 shadow-cat-default p-6 text-black align-middle content-center items-center container justify-center h-full">
            <div className="bg-red-500 size-full m-auto flex">
                <Image
                    alt="Placeholder"
                    src="/img/Placeholder.png"
                    width={128}
                    height={128}/>
            </div>
            <p className=" text-black font-normal mt-2.5">Announcements</p>
        </button>*/
        <button className="w-full bg-[#F6DCE6] border-2 shadow-cat-default p-6 rounded-2xl text-black">
            <div className="pb-6 relative size-full max-w-[200px] m-auto">
                <Image className=""
                       alt="Placeholder"
                       src="/img/Placeholder.png"
                       width={0}
                       height={0}
                       sizes="100vw"
                       style={{width: "100%", height: "auto"}}
                       />
            </div>

            <h3 className="">Announcement</h3>
            <p className=" text-sm">Description</p>
        </button>
    );
  };
export default DisplayButton;