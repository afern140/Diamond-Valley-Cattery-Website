import Image from 'next/image'

export default function CatParentButton({ docid, id, name, breed,imgUrl, onSelect}) {
	const handleSelect = (docid) => {
		onSelect(id);
	}

    return (
        <button className="flex-col font-bold p-2 text-black place-items-center" onClick={() => handleSelect(docid)}>
            <div className="max-w-[140px] xl:max-w-[300px]">
            <Image
                alt="Kitty"
                src={ imgUrl }
                width={0}
                height={0}
                sizes="100vw"
                style={{width: "100%", height: "auto"}}
                className="justify-center align-center place-items-center"/>
            </div>
            <p className=" mt-1">{name}</p>
            <p className=" text-sm font-medium">{breed}</p>
        </button>
    );
  };