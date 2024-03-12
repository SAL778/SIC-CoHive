import React, { useState, useContext } from "react";
import Carousel from "../components/Carousel/Carousel.jsx";
import PortfolioModal from "./PortfolioModal.jsx";
import PortfolioCard from "./PortfolioCard.jsx";
import AboutMe from "./About.jsx";
import { HostContext, UserContext } from "../App.jsx";
import { getCookieValue } from "../utils.js";

export default Portfolio;

/**The rendered representation of the portfolio
 * @param {array} portfolio -- A portfolio object: {description: string, items: PortfolioItem[]}
 * @param {Boolean} isCurrentUser -- Whether or not the viewer of the profile is the owner of the profile
 * @returns {JSX.Element} - The rendered representation of the portfolio
 */
function Portfolio({ isCurrentUser, portfolio }) {
	const { host } = useContext(HostContext);
	const { currentUser: user } = useContext(UserContext);

	const [portfolioList, setPortfolioList] = useState(portfolio?.items);
	//Modal Support
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [clicked, setClicked] = useState(null);
	const [modeIsDel, setModeIsDel] = useState(null);

	const [aboutIsEdit, setAboutIsEdit] = useState(false); //Is the user editing their bio
	const [aboutText, setAboutText] = useState(portfolio?.description); //Text in the bio

	//Converts the portfolio list into a carousel-usable prop
	let renderPortfolio = portfolioList?.map((item) => (
		<PortfolioCard
			key={item.id}
			title={item.title}
			description={item.description}
			link={item.link}
			onClickEdit={() => {
				// console.log("Clicked item is:" + item)
				setClicked(item);
				setModalIsOpen(true);
				setModeIsDel(false);
			}}
			onClickDelete={() => {
				// console.log("Clicked item is:" + item)
				setClicked(item);
				setModalIsOpen(true);
				setModeIsDel(true);
			}}
		/>
	));

	//Modify the portfolio when an object has been changed
	const onDelete = (deleteItem) => {
		//TODO: Send DELETE to backend and GET the updated portfolio list
		console.log("delete");
		console.log(deleteItem);
		const accessToken = getCookieValue("access_token");
		fetch(`${host}/users/portfolio/items/${deleteItem.id}`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				Authorization: `Token ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(deleteItem),
		})
			.then((response) => {
				console.log(deleteItem);
				if (!response.ok) {
					console.log(response);
				} else {
					console.log("sent succesfully");
					setPortfolioList(
						portfolioList.filter((item) => item.id !== deleteItem.id)
					);
				}
			})
			.catch((error) => {
				console.error("Couldn't send...", error);
			});
	};

	const onEdit = (updatedItem) => {
		const accessToken = getCookieValue("access_token");
		fetch(`${host}/users/portfolio/items/${clicked.id}/`, {
			method: "PATCH",
			credentials: "include",
			headers: {
				Authorization: `Token ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				icon: updatedItem.icon,
				title: updatedItem.title,
				description: updatedItem.description,
				link: updatedItem.link,
			}),
		})
			.then((response) => {
				console.log(updatedItem);
				if (!response.ok) {
					console.log(response);
				} else {
					console.log("sent succesfully");
					fetchPortfolioItems(); // Refresh the portfolio items list
				}
			})
			.catch((error) => {
				console.error("Couldn't send...", error);
			});
	};

	const fetchPortfolioItems = async () => {
		try {
			const accessToken = getCookieValue("access_token");
			const response = await fetch(`${host}/users/${user.id}/portfolio/`, {
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Token ${accessToken}`,
				},
			});

			if (response.ok) {
				const updatedPortfolio = await response.json();
				setPortfolioList(updatedPortfolio.items);
			} else {
				console.error("Failed to fetch updated portfolio items.");
			}
		} catch (error) {
			console.error("Error fetching portfolio items:", error);
		}
	};

	const onAdd = async (addedItem) => {
		console.log("add");
		const accessToken = getCookieValue("access_token");
		try {
			const response = await fetch(
				`${host}/users/${user.id}/portfolio/items/`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						Authorization: `Token ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(addedItem),
				}
			);

			if (response.ok) {
				console.log("Item added successfully");
				fetchPortfolioItems(); // Refresh the portfolio items list
			} else {
				console.error("Failed to add the item:", response.statusText);
			}
		} catch (error) {
			console.error("Error adding item:", error);
		}
	};

	const onChangeAboutMe = async (updatedDescription) => {
		setAboutText(updatedDescription);
		try {
			console.log(updatedDescription);
			const accessToken = getCookieValue("access_token");
			const response = await fetch(`${host}/users/${user.id}/portfolio/`, {
				method: "PATCH",
				credentials: "include",
				headers: {
					Authorization: `Token ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ description: updatedDescription.toString() }),
			});
			if (response.ok) {
				console.log("Sent successfully");
			} else {
				console.log("Couldn't send", response.statusText);
			}
		} catch (error) {
			console.error("Error:", error);
		}

		setAboutIsEdit(false);
	};

	return (
		<div className="flex flex-col py-[16px] px-[20px] gap-4 grow-[1] overflow-hidden">
			<AboutMe
				isEditing={aboutIsEdit}
				portfolioDescriptionProp={aboutText}
				isCurrentUser={isCurrentUser}
				onEditSubmit={onChangeAboutMe}
			/>
			<section>
				<h2 className="text-navy-blue font-medium mb-[16px]">Portfolio</h2>
				<Carousel slides={renderPortfolio} options={{ align: "start" }} />

				<button
					className="button-orange"
					type="button"
					onClick={() => {
						setClicked(null);
						setModalIsOpen(true);
						setModeIsDel(false);
					}}
				>
					Add Item to Portfolio
				</button>
			</section>

			<PortfolioModal
				onEdit={clicked ? onEdit : onAdd}
				onDelete={onDelete}
				isDel={modeIsDel}
				clickedItem={clicked}
				isOpen={modalIsOpen}
				className="delete-modal flex justify-center items-center flex-col backdrop-brightness-50 backdrop-blur-sm w-[100%] max-w-[660px] max-h-[60vh] bg-white mx-auto shadow-custom rounded-lg"
				onRequestClose={() => setModalIsOpen(false)}
				contentLabel="Modification Modal"
			/>
		</div>
	);
}
