export default function AddCondition({ newCondition, handleConditionChange, handleTreatedChange, handleAddCondition }) {
	return (
		<div className="flex flex-col mb-4 bg-navbar-body-1 m-2 border-2 border-gray-300 border-dashed drop-shadow-lg rounded-md p-2">
			<input
				type="text"
				name="name"
				placeholder="Name"
				value={newCondition.name}
				onChange={(e) => handleConditionChange(e, newCondition.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<input
				type="text"
				name="description"
				placeholder="Description"
				value={newCondition.description}
				onChange={(e) => handleConditionChange(e, newCondition.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<input
				type="text"
				name="treatment"
				placeholder="Treatment"
				value={newCondition.treatment}
				onChange={(e) => handleConditionChange(e, newCondition.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<select
				value={newCondition.treated ? "finished" : "inProgress"}
				onChange={(e) => handleTreatedChange(e, newCondition.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			>
				<option value="finished">Finished</option>
				<option value="inProgress">In Progress</option>
			</select>
			<button onClick={() => handleAddCondition()} className=" bg-white drop-shadow-lg rounded-md p-2 mb-2">Add Condition</button>
		</div>
	)
}