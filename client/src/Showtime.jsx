import { useParams } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Seat from './components/Seat'
import { TicketIcon } from '@heroicons/react/24/solid'

const Showtime = () => {
	const { id } = useParams()
	const [showtime, setShowtime] = useState({})
	const [selectedSeats, setSelectedSeats] = useState([])

	const fetchShowtime = async (data) => {
		try {
			const response = await axios.get(`/showtime/${id}`)
			console.log(response.data.data)
			setShowtime(response.data.data)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchShowtime()
	}, [])

	const row = showtime?.theater?.seatPlan?.row
	let rowLetters = []
	if (row) {
		for (let k = 64; k <= (row.length === 2 ? row.charCodeAt(0) : 64); k++) {
			for (
				let i = 65;
				i <= (k === row.charCodeAt(0) || row.length === 1 ? row.charCodeAt(row.length - 1) : 90);
				i++
			) {
				const letter = k === 64 ? String.fromCharCode(i) : String.fromCharCode(k) + String.fromCharCode(i)
				rowLetters.push(letter)
			}
		}
	}

	const column = showtime?.theater?.seatPlan.column
	let colNumber = []
	for (let k = 1; k <= column; k++) {
		colNumber.push(k)
	}

	return (
		<div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 sm:gap-8">
			<Navbar />
			<div className="mx-4 h-fit rounded-lg bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
				<div className="flex justify-between">
					<div className="flex flex-col rounded-tl-lg bg-gradient-to-br from-gray-800 to-gray-700 px-4 py-0.5 text-center font-bold text-white sm:px-8">
						<p className="text-sm">Theater</p>
						<p className="text-3xl">{showtime?.theater?.number}</p>
					</div>
					<div className="flex w-fit grow items-center justify-center rounded-tr-lg bg-gradient-to-br from-indigo-800 to-blue-700 px-4 py-0.5 text-center text-xl font-bold text-white sm:text-3xl">
						<p>{showtime?.theater?.cinema.name}</p>
					</div>
				</div>
				<div className="flex flex-col gap-y-2 md:flex-row">
					<div className="flex grow flex-col gap-4 rounded-b-lg bg-gradient-to-br from-indigo-100 to-white py-4 drop-shadow-lg md:rounded-none md:rounded-bl-lg">
						<div className="flex items-center">
							<img src={showtime?.movie?.img} className="w-32 px-4 drop-shadow-md" />
							<div className="flex flex-col">
								<h4 className="mr-4 text-xl font-semibold sm:text-2xl md:text-3xl">
									{showtime?.movie?.name}
								</h4>
								<p className="font-medium sm:text-lg">length : {showtime?.movie?.length || '-'} min</p>
							</div>
						</div>
					</div>
					<div className="flex min-w-fit flex-col items-center justify-center gap-y-1 rounded-lg bg-gradient-to-br from-indigo-100 to-white py-4 text-center text-2xl font-semibold drop-shadow-lg md:rounded-none md:rounded-br-lg">
						<p className="mx-4">
							{showtime?.showtime
								? `${new Date(showtime?.showtime).toLocaleString('default', { weekday: 'long' })}
							${new Date(showtime?.showtime).getDate()}
							${new Date(showtime?.showtime).toLocaleString('default', { month: 'long' })}
							${new Date(showtime?.showtime).getFullYear()}
							`
								: ''}
						</p>
						<p className="mx-4 bg-gradient-to-r from-indigo-800 to-blue-700 bg-clip-text text-5xl font-bold text-transparent">
							{showtime?.showtime
								? `${new Date(showtime?.showtime).getHours().toString().padStart(2, '0')} : ${new Date(
										showtime?.showtime
								  )
										.getMinutes()
										.toString()
										.padStart(2, '0')}`
								: ''}
						</p>
					</div>
				</div>
				{!!selectedSeats.length && (
					<div className="mt-4 flex flex-col justify-between rounded-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
						<div className="flex flex-col gap-x-2 py-2 px-4 md:flex-row">
							<p className="font-semibold">Selected Seats : </p>
							<p>{selectedSeats.sort().join(', ')}</p>
							<p>({selectedSeats.length} seats)</p>
						</div>
						<button className="flex items-center justify-center gap-2 rounded-b-lg bg-gradient-to-br from-indigo-600 to-blue-500 py-1 px-4 font-semibold text-white hover:from-indigo-500 hover:to-blue-500 md:rounded-none md:rounded-r-lg">
							<p>Purchase</p>
							<TicketIcon className="h-7 w-7 text-white" />
						</button>
					</div>
				)}
				<div className="mx-auto mt-4 flex flex-col items-center rounded-lg bg-gradient-to-br from-indigo-100 to-white p-4 text-center drop-shadow-lg">
					<div className="w-full rounded-lg bg-white">
						<div className="bg-gradient-to-r from-indigo-800 to-blue-700 bg-clip-text text-xl font-bold text-transparent">
							Screen
						</div>
					</div>
					<div className="flex w-full flex-col overflow-x-auto overflow-y-hidden">
						<div className="m-auto my-2">
							<div className="flex flex-col">
								<div className="flex items-center">
									<div className="flex h-8 w-8 items-center">
										<p className="w-8"></p>
									</div>
									{colNumber.map((col, index) => {
										return (
											<div key={index} className="flex h-8 w-8 items-center">
												<p className="w-8 font-semibold">{col}</p>
											</div>
										)
									})}
								</div>
								{rowLetters.map((rowLetter, index) => {
									return (
										<div key={index} className="flex">
											<div className="flex h-8 w-8 items-center">
												<p className="w-8 text-xl font-semibold">{rowLetter}</p>
											</div>
											{showtime?.seats
												.filter((seat) => seat.row === rowLetter)
												.map((seat, index) => {
													return (
														<Seat
															key={index}
															seat={seat}
															setSelectedSeats={setSelectedSeats}
														/>
													)
												})}
											<div className="flex h-8 w-8 items-center">
												<p className="w-8 text-xl font-semibold">{rowLetter}</p>
											</div>
										</div>
									)
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Showtime
