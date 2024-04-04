export default function EditCondition({ condition, handleConditionChange, handleTreatedChange, handleRemoveCondition }) {
	return (
		<div className="flex flex-col mb-4 border border-black-300 rounded-md p-2">
			<input
				type="text"
				name="name"
				placeholder={condition.name}
				value={condition.name}
				onChange={(e) => handleConditionChange(e, condition.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<input
				type="text"
				name="description"
				placeholder={condition.description}
				value={condition.description}
				onChange={(e) => handleConditionChange(e, condition.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<input
				type="text"
				name="treatment"
				placeholder={condition.treatment}
				value={condition.treatment}
				onChange={(e) => handleConditionChange(e, condition.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<select
				value={condition.treated ? "finished" : "inProgress"}
				onChange={(e) => handleTreatedChange(e, condition.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			>
				<option value="finished">Finished</option>
				<option value="inProgress">In Progress</option>
			</select>
			<button onClick={() => handleRemoveCondition(condition.id)} className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">Remove Condition</button>
		</div>
	)
}