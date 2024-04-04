export default function AddCondition({ newCondition, handleConditionChange, handleTreatedChange, handleAddCondition }) {
	return (
		<div className="flex flex-col mb-4 border border-black-300 rounded-md p-2">
			<input
				type="text"
				name="name"
				placeholder="Name"
				value={newCondition.name}
				onChange={(e) => handleConditionChange(e, newCondition.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<input
				type="text"
				name="description"
				placeholder="Description"
				value={newCondition.description}
				onChange={(e) => handleConditionChange(e, newCondition.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<input
				type="text"
				name="treatment"
				placeholder="Treatment"
				value={newCondition.treatment}
				onChange={(e) => handleConditionChange(e, newCondition.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<select
				value={newCondition.treated ? "finished" : "inProgress"}
				onChange={(e) => handleTreatedChange(e, newCondition.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			>
				<option value="finished">Finished</option>
				<option value="inProgress">In Progress</option>
			</select>
			<button onClick={() => handleAddCondition()} className="  drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">Add Condition</button>
		</div>
	)
}