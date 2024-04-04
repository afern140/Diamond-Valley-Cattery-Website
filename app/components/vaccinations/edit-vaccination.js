import DateSelection from "./date-selection";

export default function EditVaccination({ vaccination, newDate, setNewDate, handleVaccinationChange, handleStatusChange, handleVaccinationDateChange, handleRemoveDate, handleAddDate, handleRemoveVaccination, showTakenDateSelection, setShowTakenDateSelection, showPlannedDateSelection, setShowPlannedDateSelection }) {
	return (
		<div key={vaccination.id} className="flex flex-col mb-4 border border-black-300 rounded-md p-2">
			<input
				type="text"
				name="name"
				placeholder={vaccination.name}
				value={vaccination.name}
				onChange={(e) => handleVaccinationChange(e, vaccination.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<input
				type="text"
				name="description"
				placeholder={vaccination.description}
				value={vaccination.description}
				onChange={(e) => handleVaccinationChange(e, vaccination.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<select
				name="completed"
				value={vaccination.completed ? "finished" : "inProgress"}
				onChange={(e) => handleStatusChange(e, vaccination.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			>
				<option value="finished">Finished</option>
				<option value="inProgress">In Progress</option>
			</select>
			<input
				type="number"
				name="dosesTaken"
				placeholder={vaccination.dosesTaken}
				value={vaccination.dosesTaken}
				onChange={(e) => handleVaccinationChange(e, vaccination.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<h4>Doses Taken Dates:</h4>
			<ul>
				{vaccination.datesTaken.map((date, index) => (
					<li key={index} className="font-normal">
						<input
							type="date"
							value={new Date(date.toDate()).toISOString().split('T')[0]}
							onChange={(e) => handleVaccinationDateChange(e, vaccination.id, index, 'datesTaken')}
							className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
						/>
						<button onClick={() => handleRemoveDate('datesTaken', vaccination.id, index)} className=" border border-gray-300 rounded-md p-2 m-2">Remove Date</button>
					</li>
				))}
				<button onClick={() => setShowTakenDateSelection(true)} className="  drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">Add Date</button>
			</ul>	
			{showTakenDateSelection && (
				<DateSelection type="datesTaken" setVisible={setShowTakenDateSelection} vaccination={vaccination} newDate={newDate} setNewDate={setNewDate} handleAddDate={handleAddDate}/>
			)}
			<input
				type="number"
				name="dosesRemaining"
				placeholder={vaccination.dosesRemaining}
				value={vaccination.dosesRemaining}
				onChange={(e) => handleVaccinationChange(e, vaccination.id)}
				className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
			/>
			<h4>Planned Dosage Dates:</h4>
			<ul>
				{vaccination.futureDates.map((date, index) => (
					<li key={index} className="font-normal">
						<input
							type="date"
							value={new Date(date.toDate()).toISOString().split('T')[0]}
							onChange={(e) => handleVaccinationDateChange(e, vaccination.id, index, 'futureDates')}
							className=" drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300"
						/>
						<button onClick={() => handleRemoveDate('futureDates', vaccination.id, index)} className=" border border-gray-300 rounded-md p-2 m-2">Remove Date</button>
					</li>
				))}
				<button onClick={() => setShowPlannedDateSelection(true)} className="  drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">Add Date</button>
			</ul>
			{showPlannedDateSelection && (
				<DateSelection type="futureDates" setVisible={setShowPlannedDateSelection} vaccination={vaccination} newDate={newDate} setNewDate={setNewDate} handleAddDate={handleAddDate}/>
			)}
			<button onClick={() => handleRemoveVaccination(vaccination.id)} className="  drop-shadow-md rounded-xl text-xl pl-4 w-full h-10 bg-[#BDB2FF] text-gray-700 border border-gray-300">Remove Vaccination</button>
		</div>
	);
}