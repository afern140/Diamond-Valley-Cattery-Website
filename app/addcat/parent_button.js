import Image from 'next/image'

export default function CatParentButton({ docid, id, name, breed, onSelect}) {
	const handleSelect = (docid) => {
		console.log("Selected: ", docid);
		onSelect(id);
	}

    return (
        <button className="flex-col font-bold p-2 text-black place-items-center" onClick={() => handleSelect(docid)}>
            <Image
                alt="Kitty"
                src={ id % 2 == 0 ? "/img/Kitty_1.png" : "/img/Kitty_2.png" }
                width={"300"}
                height={"300"}
                className="justify-center align-center place-items-center"
                objectFit="contain"/>
            <p className=" mt-1">{name}</p>
            <p className=" text-sm font-medium">{breed}</p>
        </button>
    );
  };