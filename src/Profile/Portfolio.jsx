import React, { useState } from "react";
import Carousel from "../components/Carousel/Carousel.jsx";
import PortfolioModal from "./PortfolioModal.jsx";
import PortfolioCard from "./PortfolioCard.jsx";

export default Portfolio;

/**The rendered representation of the portfolio 
 * @param {array} portfolio -- A portfolio object: {description: string, items: PortfolioItem[]}
 * @param {Boolean} isActive -- Whether or not the viewer of the profile is the owner of the profile
 * @returns {JSX.Element} - The rendered representation of the portfolio
 */
function Portfolio({isActive, portfolio}) {

    const [portfolioList, setPortfolioList] = useState(portfolio.items)
    //Modal Support
    const [modalIsOpen, setModalIsOpen] = useState(false);
	const [clicked, setClicked] = useState(null);
    const [modeIsDel, setModeIsDel] = useState(null);

    //Converts the portfolio list into a carousel-usable prop
    let renderPortfolio = portfolioList.map(item => (
        <PortfolioCard 
            key = {item.id} 
            title = {item.title}
            description = {item.description}
            link = {item.link}
            onClickEdit = {() => {
                console.log("Clicked item is:" + item)
                setClicked(item)
                setModalIsOpen(true);
                setModeIsDel(false);
            }}
            onClickDelete = {() => {
                console.log("Clicked item is:" + item)
                setClicked(item)
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

    return (    
        <div className="flex flex-col py-[16px] px-3 gap-[100px] grow-[1] overflow-hidden">
            <section>
                <h1>About</h1>
                <p>{portfolio.description}</p>
            </section>

            <section>
                <h1>Portfolio</h1>
                <Carousel
                slides = {renderPortfolio}
                options = {{ align: 'start'}}
                />

                <button className="p-3 bg-orange-600 text-white rounded-md "
                    type = "button" 
                    onClick = {() => {
                        setClicked(null)
                        setModalIsOpen(true);
                        setModeIsDel(false);}
                    }>Add Item to Portfolio
                </button>

            </section>

            <PortfolioModal
                onEdit = {onEdit}
                onDelete = {onDelete}
                isDel = {modeIsDel}
                clickedItem = {clicked}
                isOpen={modalIsOpen}
                className = "delete-modal flex justify-center items-center flex-col backdrop-brightness-50 backdrop-blur-sm w-[100%] max-w-[660px] max-h-[60vh] bg-white mx-auto shadow-lg rounded-lg"
				onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Modification Modal"
            />
		</div>
    )
}
