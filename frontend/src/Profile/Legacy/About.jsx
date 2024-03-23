import React, { useState, useRef, useEffect } from "react";
import useAutosizeTextArea from "./useAutosizeTextArea";

/**The rendered representation of the portfolio
 * @param {string} portfolioDescription -- A string to describe the portolio (About Me section)
 * @param {Boolean} isCurrentUser -- Whether or not the viewer of the profile is the owner of the profile
 * @param {Boolean} isEditing -- Whether or not the user is editing the bio
 * @param {function} onEditSubmit -- Callback function when an update in the bio occurs
 * @returns {JSX.Element} - The rendered representation of the portfolio
 */
function AboutMe({
	isCurrentUser,
	portfolioDescriptionProp,
	isEditing,
	onEditSubmit,
}) {
	//init with pre-filled fields based on portfolioItem if they exist, otherwise create new fields
	const [portfolioDescription, setPortfolioDescription] = useState(
		portfolioDescriptionProp ?? ""
	); //This is the displayed text
	const [isEditMode, setIsEditMode] = useState(isEditing);
	const [autoheight, setAutoheight] = useState("");

	//Used to set the focus on button click
	const textAreaRef = useRef(null);
	useEffect(() => {
		if (isEditMode) {
			textAreaRef.current.focus();
		}
	}, [isEditMode]);

	//Wrapper for useEffect hook
	useAutosizeTextArea(textAreaRef.current, autoheight);

	//update corresponding field on input
	const handleInput = (e) => {
		const { name, value } = e.target;
		setAutoheight(textAreaRef.current, value);
		setPortfolioDescription(value);
	};

	const handleSubmit = (e) => {
		onEditSubmit(portfolioDescription);
		setIsEditMode(false);
	};

	const handleCancel = () => {
		setPortfolioDescription(portfolioDescriptionProp); //Dump cache
		setIsEditMode(false);
	};

	const handleInit = () => {
		setAutoheight(textAreaRef.current, portfolioDescription);
		setIsEditMode(true);
	};

	return (
		<div className="aboutMeContainer relative max-w-full">
			<div>
				<h2 className="text-navy-blue font-medium">About</h2>
				<ButtonStack
					className="absolute"
					isEditing={isEditMode}
					onEditSubmit={() => handleSubmit()}
					onEditInit={() => handleInit()}
					onEditCancel={() => handleCancel()}
				/>
			</div>
			<div className="about-description min-h-40 rounded-md relative mt-[20px]">
				<textarea
					readOnly={!(isEditMode && isCurrentUser)}
					ref={textAreaRef}
					rows={1}
					maxLength={500}
					placeholder="Add a brief description to describe yourself and your works"
					className={
						"aboutText resize-none rounded-md w-full min-h-40 whitespace-pre-wrap p-x-8" +
						(!(isEditMode && isCurrentUser) ? "" : " description-edit")
					}
					value={portfolioDescription}
					onChange={handleInput}
				/>
			</div>
		</div>
	);
}

function ButtonStack({ isEditing, onEditInit, onEditCancel, onEditSubmit }) {
	return (
		<div className="button-stack flex flex-row absolute gap-3 right-0 top-0">
			{isEditing ? (
				<>
					<button
						type="button"
						className="aboutSubmitButton square-button button-orange"
						onClick={onEditSubmit}
					>
						<i className="fa fa-check" />
					</button>
					<button
						type="button"
						className="aboutCancelButton square-button button-orange"
						onClick={onEditCancel}
					>
						<i className="fa fa-times" />
					</button>
				</>
			) : (
				<button
					type="button"
					className="aboutEditButton square-button button-orange"
					onClick={onEditInit}
				>
					<i className="fa fa-pen" />
				</button>
			)}
		</div>
	);
}

export default AboutMe;
