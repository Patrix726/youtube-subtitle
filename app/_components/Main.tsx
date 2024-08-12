"use client";
import React, { useRef, useState } from "react";

const Form = () => {
	const link = useRef<string>();
	const [subtitle, setSubtitle] = useState<string[]>();
	const [timestamp, setTimestamp] = useState<string[]>();
	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		//@ts-ignore
		link.current = e.target.link.value;
		const res = await fetch("http://localhost:3000/api/subtitle", {
			body: JSON.stringify(link.current),
			method: "POST",
		});
		const data: string = await res.json();
		let text = "";
		for (let i = 0; i < data.length; i++) {
			//@ts-ignore
			if (!isNaN(data.charAt(i)) && !isNaN(parseFloat(data.charAt(i)))) {
				text = data.slice(i);
				break;
			}
		}
		console.log(text.split("\n"));
		//@ts-ignore
		const obj: { timestamp: string[]; subtitle: string[] } = text
			.split("\n")
			.reduce(
				//@ts-ignore
				(prev, cur, ind) => {
					if (ind % 3 === 0) {
						const newVal = {
							...prev,
							timestamp: [...prev.timestamp, cur],
						};
						return newVal;
					}
					if (ind % 3 === 1) {
						const newVal = {
							...prev,
							subtitle: [...prev.subtitle, cur],
						};
						return newVal;
					}
					return prev;
				},
				{ timestamp: [], subtitle: [] }
			);
		setSubtitle(obj.subtitle);
		setTimestamp(obj.timestamp);
	}
	return (
		<>
			<form onSubmit={handleSubmit} className="w-3/4 flex gap-4">
				<input
					type="text"
					name="link"
					id="link"
					className="border rounded-lg p-2 w-full"
				/>
				<button
					type="submit"
					className="py-5 px-9 bg-blue-900 text-white rounded-md"
				>
					Submit
				</button>
			</form>
			{Array.isArray(subtitle) && subtitle?.length > 0 && (
				<div className="flex justify-between w-full h-1/2 overflow-scroll">
					<div className="w-1/2 flex flex-col items-center">
						<h1>Subs</h1>
						{subtitle?.map((val, ind) => (
							<p key={ind}>{val}</p>
						))}
					</div>
					<div className="w-1/2 flex flex-col items-center">
						<h1>Timestamps</h1>
						{timestamp?.map((val, ind) => (
							<p key={ind}>{val}</p>
						))}
					</div>
				</div>
			)}
		</>
	);
};
export default Form;
