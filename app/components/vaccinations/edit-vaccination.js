import DateSelection from "./date-selection";

export default function EditVaccination({ vaccination, newDate, setNewDate, handleVaccinationChange, handleStatusChange, handleVaccinationDateChange, handleRemoveDate, handleAddDate, handleRemoveVaccination, showTakenDateSelection, setShowTakenDateSelection, showPlannedDateSelection, setShowPlannedDateSelection }) {
	return (
		<div key={vaccination.id} className="flex flex-col mb-4 bg-navbar-body-1 dark:bg-gray-300 m-2 drop-shadow-lg rounded-md p-2">
			<input
				type="text"
				name="name"
				placeholder={vaccination.name}
				value={vaccination.name}
				onChange={(e) => handleVaccinationChange(e, vaccination.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<input
				type="text"
				name="description"
				placeholder={vaccination.description}
				value={vaccination.description}
				onChange={(e) => handleVaccinationChange(e, vaccination.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<select
				name="completed"
				value={vaccination.completed ? "finished" : "inProgress"}
				onChange={(e) => handleStatusChange(e, vaccination.id)}
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
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
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<h4>Doses Taken Dates:</h4>
			<ul>
				{vaccination.datesTaken.map((date, index) => (
					<li key={index} className="font-normal">
						<input
							type="date"
							value={new Date(date.toDate()).toISOString().split('T')[0]}
							onChange={(e) => handleVaccinationDateChange(e, vaccination.id, index, 'datesTaken')}
							className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
						/>
						<button onClick={() => handleRemoveDate('datesTaken', vaccination.id, index)} className="bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0  drop-shadow-lg rounded-md p-2 m-2">Remove Date</button>
					</li>
				))}
				<button onClick={() => setShowTakenDateSelection(true)} className="bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0  drop-shadow-lg rounded-md p-2 mb-2">Add Date</button>
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
				className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
			/>
			<h4>Planned Dosage Dates:</h4>
			<ul>
				{vaccination.futureDates.map((date, index) => (
					<li key={index} className="font-normal">
						<input
							type="date"
							value={new Date(date.toDate()).toISOString().split('T')[0]}
							onChange={(e) => handleVaccinationDateChange(e, vaccination.id, index, 'futureDates')}
							className="bg-white drop-shadow-lg rounded-md p-2 mb-2"
						/>
						<button onClick={() => handleRemoveDate('futureDates', vaccination.id, index)} className="bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0  drop-shadow-lg rounded-md p-2 m-2">Remove Date</button>
					</li>
				))}
				<button onClick={() => setShowPlannedDateSelection(true)} className="bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0  drop-shadow-lg rounded-md p-2 mb-2">Add Date</button>
			</ul>
			{showPlannedDateSelection && (
				<DateSelection type="futureDates" setVisible={setShowPlannedDateSelection} vaccination={vaccination} newDate={newDate} setNewDate={setNewDate} handleAddDate={handleAddDate}/>
			)}
			<button onClick={() => handleRemoveVaccination(vaccination.id)} className="bg-gray-200 dark:bg-gray-400 dark:text-dark-header-text-0  drop-shadow-lg rounded-md p-2 mb-2">Remove Vaccination</button>
		</div>
	);
}