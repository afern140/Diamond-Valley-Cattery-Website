"use client"

import { useState, React } from "react";
//import cats from "@/app/cats/[cat]/cat.json"

function Dropdown({queryType, callback, cats}) {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")

    const [dropSelectClassname, setDropSelectClassname] = useState(" text-gray-500 italic font-normal text-base");

	if (cats === undefined || cats === null) {
		cats = [];
	}
	const breedQuery = cats.map(i => i.breed);
	const genderQuery = cats.map(i => i.gender);
	const ageQuery = cats.map(i => i.age);
	const colorQuery = cats.map(i => i.color);

	const breedFiltered = cats.filter(({ breed }, index) => !breedQuery.includes(breed, index + 1));
	const genderFiltered = cats.filter(({ gender }, index) => !genderQuery.includes(gender, index + 1));
	const ageFiltered = cats.filter(({ age }, index) => !ageQuery.includes(age, index + 1));
	const colorFiltered = cats.filter(({ color }, index) => !colorQuery.includes(color, index + 1));
	const sortFilters = ["None", "Name", "Breed", "Gender", "Age", "Color"];

    let dropdownValue;
    const handleCallback = (selected) => {
        callback(queryType + " " + selected);
        setDropdownValue(selected);
        setIsOpen(false);
        console.log("[Dropdown] Value: " + dropdownValue + " QueryType: " + queryType);
        setDropSelectClassname("text-sm");
    }

    let list;
    if (queryType === "breed") {
        list = breedFiltered;
    } else if (queryType === "gender") {
        list = genderFiltered;
    } else if (queryType === "age") {
        list = ageFiltered;
    } else if (queryType === "color") {
        list = colorFiltered;
    } else if (queryType === "sort") {
        list = sortFilters;
    } else {
        list = genderFiltered;
    }


    return (
    <div className="relative flex flex-col items-center w-full h-auto rounded-lg">
        <button onClick={() => setIsOpen((prev) => !prev)}
                className="bg-white text-black h-10 p-4 w-full flex items-center justify-between font-bold text-lg rounded-lg tracking-wider border border-black duration-300 active:text-white">
                    <span className={"text-sm"}>{(dropdownValue === "" ? "Select..." : dropdownValue)}</span>
                </button>
            
            { /* When we press the dropdown button, we change the state to 'Open' and populate the list with the appropriate values. */}
            { isOpen && (
                <div className=" bg-slate-200 absolute top-10 right-0 flex flex-col items-start rounded-lg p-2 w-full z-20">
                    {list.map((item, index) => (
                        <div className=" flex w-full justify-between hover:bg-slate-100 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-slate-400 border-l-4 pl-1" 
                             key={index}>
                            
                            {queryType === "breed" && (<button onClick={(e) => handleCallback(item.breed)} className="font-bold w-full flex">{item.breed}</button>)}
                            {queryType === "gender" && (<button onClick={(e) => handleCallback(item.gender)} className="font-bold w-full flex">{item.gender}</button>)}
                            {queryType === "age" && (<button onClick={(e) => handleCallback(item.age)} className="font-bold w-full flex">{item.age}</button>)}
                            {queryType === "color" && (<button onClick={(e) => handleCallback(item.color)} className="font-bold w-full flex">{item.color}</button>)}
                            {queryType === "sort" && (<button onClick={(e) => handleCallback(item)} className="font-bold w-full flex">{item}</button>)}

                        </div>
                    ))}
                </div>
            )}
    </div>
    );
}

export default Dropdown;