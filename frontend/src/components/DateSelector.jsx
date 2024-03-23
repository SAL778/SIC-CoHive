import React from "react";
import { DatePicker } from "@mantine/dates";
import { Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "../components/Forms/form.css";

export default function DateSelector({ currentDate, onSetDate }) {
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<Popover position="bottom" trapFocus>
			<Popover.Target>
				{getDisplayDate({
					date: currentDate,
					onShow: open,
					isExpanded: opened,
				})}
			</Popover.Target>
			<Popover.Dropdown>
				<DatePicker value={currentDate} onChange={onSetDate} />
			</Popover.Dropdown>
		</Popover>
	);
}

//
function getDisplayDate({ date, onShow, isExpanded }) {
	return (
		<button type="button" onClick={onShow}>
			<label className="block text-left">
				{isToday(date) ? "Today" : "Date"}
			</label>
			<div className="flex flex-start items-center gap-3">
				<h1 className="inline">
					<span className=" text-3xl font-bold text-orange-600 mr-2">
						{`${date.toLocaleString("default", {
							month: "long",
						})} ${date.getDate()}`}
					</span>
					<span className="text-3xl font-light">{`${date.getFullYear()}`}</span>
				</h1>
				<i
					className={`text-blue-950 fa ${
						isExpanded ? "fa-caret-up" : "fa-caret-down"
					}`}
				/>
			</div>
		</button>
	);
}

const isToday = (date) => {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
};
