export default function DateSelection({ type, setVisible, vaccination, newDate, setNewDate, handleAddDate }){
	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
			<div className="bg-white p-8 rounded-lg shadow-lg w-auto h-auto overflow-auto relative">
				<h2 className="text-lg font-bold mb-4">Select a New Date</h2>
				<button className="absolute top-2 right-4 font-bold" onClick={() => setVisible(false)}>X</button>
				<input
					type="date"
					value={newDate}
					onChange={(e) => setNewDate(e.target.value)}
					className="border boder-gray-300 rounded-md p-2 m-2"
				/>
				<button onClick={() => handleAddDate(type, vaccination.id)} className="bg-slate-200 border border-gray-300 rounded-md p-2 m-2">Submit</button>
			</div>
		</div>
	)
}