import React, { useState, useContext } from "react";
import Carousel from "../components/Carousel/Carousel.jsx";
import PortfolioModal from "./PortfolioModal.jsx";
import PortfolioCard from "./PortfolioCard.jsx";
import AboutMe from "./About.jsx";
import { HostContext, UserContext } from "../App.jsx";

export default Portfolio;

/**The rendered representation of the portfolio
 * @param {array} portfolio -- A portfolio object: {description: string, items: PortfolioItem[]}
 * @param {Boolean} isCurrentUser -- Whether or not the viewer of the profile is the owner of the profile
 * @returns {JSX.Element} - The rendered representation of the portfolio
 */
function Portfolio({ isCurrentUser, portfolio }) {

    const {host} = useContext(HostContext)
    const {user} = useContext(UserContext)

	const [portfolioList, setPortfolioList] = useState(portfolio?.items);
	//Modal Support
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [clicked, setClicked] = useState(null);
	const [modeIsDel, setModeIsDel] = useState(null);

	const [aboutIsEdit, setAboutIsEdit] = useState(false); //Is the user editing their bio
	const [aboutText, setAboutText] = useState(portfolio?.description); //Text in the bio

    //Converts the portfolio list into a carousel-usable prop
    let renderPortfolio = portfolioList?.map(item => (
        <PortfolioCard 
            key = {item.id} 
            title = {item.title}
            description = {item.description}
            link = {item.link}
            onClickEdit = {() => {
                // console.log("Clicked item is:" + item)
                setClicked(item);
                setModalIsOpen(true);
                setModeIsDel(false);
            }}
            onClickDelete = {() => {
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
        setPortfolioList(portfolioList.filter((item) => item.id !== deleteItem.id));

    }
    
    const onEdit = (updatedItem) => {
        //TODO: Send PATCH, just send all field and let the backend update whatever changed to backend and GET the updated portfolio list
    }

    const onAdd = (updatedItem) => {
        //TODO: Send PUT to portfolio items
        console.log("add");
        console.log(updatedItem);
        fetch(`${host}/users/${user.id}/portfolio/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem)
        }).then(response => {
            console.log(updatedItem)
            if(!response.ok) {
                console.log(response)
            }
            console.log("sent succesfully")
        }).catch(error => {
            console.error("Couldn't send...", error)
        });
    }

    const onChangeAboutMe = (updatedDescription) => {
        setAboutText(updatedDescription)
        //TODO: Send the updated description to the backend
        fetch(`${host}/users/${user.id}/portfolio/`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDescription)
        }).then(response => {
            console.log(updatedDescription)
            if(!response.ok) {
                console.log(response)
            }
            else {
                console.log("sent succesfully")
            }
        }).catch(error => {
            console.error("Couldn't send...", error)
        });

        setAboutIsEdit(false)
    }

    return (    
        <div className="flex flex-col py-[16px] px-[20px] gap-4 grow-[1] overflow-hidden">
            <AboutMe 
                isEditing = {aboutIsEdit} 
                portfolioDescriptionProp = {aboutText}
                isCurrentUser = {isCurrentUser}
                onEditSubmit = {onChangeAboutMe}
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
