import Image from 'next/image'

export default function CatParentButton({ docid, id, name, breed,imgUrl, onSelect}) {
	const handleSelect = (docid) => {
		onSelect(id);
	}

    return (
        <button className="flex-col font-bold p-2 text-black place-items-center" onClick={() => handleSelect(docid)}>
            <img
                alt="Kitty"
                src={ imgUrl }
                width={"300"}
                height={"300"}
                className="justify-center align-center place-items-center"
                objectFit="contain"/>
            <p className=" mt-1">{name}</p>
            <p className=" text-sm font-medium">{breed}</p>
        </button>
    );
  };