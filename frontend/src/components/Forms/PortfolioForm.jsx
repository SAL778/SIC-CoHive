import React, { useState, useEffect, useContext } from "react";
import { UserContext, HostContext } from "../../App.jsx";
import { useForm } from "@mantine/form";
import { TextInput } from "@mantine/core";
import IconPicker from "./IconPicker.jsx";
import "./form.css";

export default PortfolioForm;

/**
 * A component function that returns the render of the booking form, and handles values changes.
 * @param {Object|null} portfolioItem - A portfolio Item, if one exists.
 * @param {Array[Object]} availableIcons - A list of icons available to be used.

 */
function PortfolioForm({ portfolioItem, onSubmit, onClose }) {
	const defaultIcon = "fa fa-lightbulb";
	const [availableIcons, setAvailableIcons] = useState([]); //To be retrieved from the backend eventually

	const matchesHttpPattern = (string) =>
		/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(
			string
		);
	const matchesWwwPattern = (string) => /^www\.\w+(\.\w+)+$/.test(string);
	const matchesDomainPattern = (string) => /^(\w+\.)+\w+$/.test(string);

	useEffect(() => {
		setAvailableIcons(getIcons());
	}, []);

	const form = useForm({
		initialValues: {
			title: portfolioItem?.title ?? "",
			description: portfolioItem?.description ?? "",
			link: portfolioItem?.link ?? "",
			icon: portfolioItem?.icon ?? defaultIcon, //The fontawesome icon className(s)
		},
		validate: {
			title: (value) =>
				value.length > 15 || value.length < 1
					? "Title must be between 1 and 15 characters"
					: null,
			description: (value) =>
				value.length > 50 || value.length < 1
					? "Title must be between 1 and 50 characters"
					: null,
			link: (value) =>
				!(
					matchesHttpPattern(value) ||
					matchesWwwPattern(value) ||
					matchesDomainPattern(value)
				) || value.length == 0
					? "The link must be a valid url"
					: null,
		},
		transformValues: (values) => {
			//Transfrom links to match the expected src for an <a> tag
			const normalized = values;
			if (matchesDomainPattern(normalized.link)) {
				normalized.link = "www." + normalized.link;
			}

			if (matchesWwwPattern(normalized.link)) {
				normalized.link = "http://" + normalized.link;
			}
			return normalized;
		},
	});

	return (
		<form
			onSubmit={form.onSubmit((values) => {
				onSubmit(values);
			})}
		>
			<IconPicker
				data={availableIcons}
				value={form.values.icon}
				{...form.getInputProps("icon")}
			/>
			<TextInput
				label="Title"
				placeholder="Enter a title"
				{...form.getInputProps("title")} //Binds the event listener and values
			/>
			<TextInput
				label="Description"
				placeholder="Enter a brief description"
				{...form.getInputProps("description")}
			/>
			<TextInput
				label="Link"
				placeholder="Enter a link"
				{...form.getInputProps("link")}
			/>
			<div className="flex gap-3 pt-3 justify-end">
				<button
					type="button"
					className="button-grey-hover modal-button"
					onClick={onClose}
				>
					Close
				</button>
				<button type="submit" className="button-orange modal-button">
					Submit
				</button>
			</div>
		</form>
	);
}

const getIcons = () => {
	//TODO: Get icons from backend
	return [
		//General
		"fa fa-lightbulb",
		"fa fa-link",
		"fa fa-camera",
		"fa fa-music",
		"fa fa-palette",
		"fa fa-code",
		"fa fa-flask",
		"fa fa-clapperboard",
		"fa fa-podcast",

		//Brands
		"fa-brands fa-google-drive",
		"fa-brands fa-github",
		"fa-brands fa-youtube",
		"fa-brands fa-discord",
		"fa-brands fa-linkedin",
		"fa-brands fa-dribbble",
		"fa-brands fa-figma",
		"fa-brands fa-codepen",
		"fa-brands fa-instagram",
		"fa-brands fa-pinterest",
		"fa-brands fa-soundcloud",
	];
};
