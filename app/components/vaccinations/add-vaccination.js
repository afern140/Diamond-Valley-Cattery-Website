import DateSelection from "./date-selection"

export default function AddVaccination({ newVaccine, newDate, setNewDate, showTakenDateSelection, setShowTakenDateSelection, showPlannedDateSelection, setShowPlannedDateSelection, handleVaccinationChange, handleVaccinationDateChange, handleRemoveDate, handleAddDate, handleAddVaccine }) {
	return (
		<div className="flex flex-col mb-4 border border-black-300 rounded-md p-2">
			<input
				type="text"
				name="name"
				placeholder="Name"
				value={newVaccine.name}
				onChange={(e) => handleVaccinationChange(e, newVaccine.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<input
				type="text"
				name="description"
				placeholder="Description"
				value={newVaccine.description}
				onChange={(e) => handleVaccinationChange(e, newVaccine.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<select
				name="completed"
				value={newVaccine.completed ? "true" : "false"}
				onChange={(e) => handleVaccinationChange(e, newVaccine.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			>
				<option value="true">Finished</option>
				<option value="false">In Progress</option>
			</select>
			<input
				type="number"
				name="dosesTaken"
				placeholder="Doses Taken"
				value={newVaccine.dosesTaken}
				onChange={(e) => handleVaccinationChange(e, newVaccine.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<h4>Doses Taken Dates:</h4>
			<ul>
				{newVaccine.datesTaken.map((date, index) => (
					<li key={index} className="font-normal">
						<input
							type="date"
							value={new Date(date.toDate()).toISOString().split('T')[0]}
							onChange={(e) => handleVaccinationDateChange(e, newVaccine.id, index, 'datesTaken')}
							className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
						/>
						<button onClick={() => handleRemoveDate('datesTaken', newVaccine.id, index)} className=" border border-gray-300 rounded-md p-2 m-2">Remove Date</button>
					</li>
				))}
				<button onClick={() => setShowTakenDateSelection(true)} className="  drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">Add Date</button>
			</ul>
			{showTakenDateSelection && (
				<DateSelection type="datesTaken" setVisible={setShowTakenDateSelection} vaccination={newVaccine} newDate={newDate} setNewDate={setNewDate} handleAddDate={handleAddDate}/>
			)}
			<input
				type="number"
				name="dosesRemaining"
				placeholder="Doses Remaining"
				value={newVaccine.dosesRemaining}
				onChange={(e) => handleVaccinationChange(e, newVaccine.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<h4>Planned Dosage Dates:</h4>
			<ul>
				{newVaccine.futureDates.map((date, index) => (
					<li key={index} className="font-normal">
						<input
							type="date"
							value={new Date(date.toDate()).toISOString().split('T')[0]}
							onChange={(e) => handleVaccinationDateChange(e, newVaccine.id, index, 'futureDates')}
							className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
						/>
						<button onClick={() => handleRemoveDate('futureDates', newVaccine.id, index)} className=" border border-gray-300 rounded-md p-2 m-2">Remove Date</button>
					</li>
				))}
				<button onClick={() => setShowPlannedDateSelection(true)} className="  drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">Add Date</button>
			</ul>
			{showPlannedDateSelection && (
				<DateSelection type="futureDates" setVisible={setShowPlannedDateSelection} vaccination={newVaccine} newDate={newDate} setNewDate={setNewDate} handleAddDate={handleAddDate}/>
			)}
			<button onClick={handleAddVaccine} className="  drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">Add Vaccine</button>
		</div>
	)
}