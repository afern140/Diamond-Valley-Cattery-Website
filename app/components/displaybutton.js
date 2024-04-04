import Image from 'next/image'

const DisplayButton = () => {
    return (
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