export default function EditCondition({ condition, handleConditionChange, handleTreatedChange, handleRemoveCondition }) {
	return (
		<div className="flex flex-col mb-4 bg-navbar-body-1 m-2 drop-shadow-lg rounded-md p-2">
			<input
				type="text"
				name="name"
				placeholder={condition.name}
				value={condition.name}
				onChange={(e) => handleConditionChange(e, condition.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<input
				type="text"
				name="description"
				placeholder={condition.description}
				value={condition.description}
				onChange={(e) => handleConditionChange(e, condition.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<input
				type="text"
				name="treatment"
				placeholder={condition.treatment}
				value={condition.treatment}
				onChange={(e) => handleConditionChange(e, condition.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<select
				value={condition.treated ? "finished" : "inProgress"}
				onChange={(e) => handleTreatedChange(e, condition.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			>
				<option value="finished">Finished</option>
				<option value="inProgress">In Progress</option>
			</select>
			<button onClick={() => handleRemoveCondition(condition.id)} className=" bg-white drop-shadow-lg rounded-md p-2 mb-2">Remove Condition</button>
		</div>
	)
}