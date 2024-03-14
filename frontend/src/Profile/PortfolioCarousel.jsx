import React, { useState, useEffect, useContext } from "react";
import VerticalCarousel from "../components/Carousel/VerticalCarousel";

export default PortfolioCarousel

/** A function that returns a render of all portfolio items in a carousel, and handles all events
 * including addition, edit, deletion via trigger of modals
 * 
 * @param {portfolio[]} portfolioItems: An array of portfolio items, including link, name, description and icon
 * @param {Boolean} isEditable - Whether the porfolio is modifiable.
 */

//TODO: Rename this to portfolio
function PortfolioCarousel({ portfolioItems, isEditable = false }) {
    
    const defaultIcon = 'fa fa-lightbulb' //Class name for a font-awesome icon

    const [clickedItem, setClickedItem] = useState(null)
    const [currentPortfolioList, setCurrentPortfolioList] = useState(portfolioItems)

    const [openedModal, setOpenedModal] = useState(null) 

    return (
        <>
            <VerticalCarousel>
            {currentPortfolioList.map((portfolioItem) => {
                <PortfolioCard>
                    title = {portfolioItem.title}
                    description = {portfolioItem.description}
                    link = {portfolioItem.link}
                    icon = {portfolioItem?.icon || defaultIcon}
                    onClickEdit = {openEditModal}
                    onClickDelete = {openDeleteModal}
                </PortfolioCard>
            })}

            {  isEditable &&
                <button
                type = "button"
                className = "portfolio-card p-5 rounded-3xl h-64 w-56"
                onClick = {() => openEditModal()}
                >
                    <i className="fa fa-plus"/>
                </button>
            }
            </VerticalCarousel>

            {/* Edit Portfolio Item Modal*/}
            <Modal
            opened = {!!openedModal}
            onClose= {onModalClose}
            centered
            size="auto"
            transitionProps={{
                transition: "slide-up",
                duration: 200,
                timingFunction: "ease-in-out",
            }}
            >   
                { openedModal == "edit" &&
                    <PortfolioForm 
                    currentPortfolioItem = {clickedItem} 
                    onClose = {setOpenedModal(null)}
                    onSubmit = {onModalSubmitPortfolioEdit(clickedItem)}
                    />
                }
                { openedModal == "redirect" &&
                    <p>{`You are being redirected to an external site. ${clickedItem.link} Continue?`}</p>
                }
                { openedModal == "delete" &&
                    <p>{`Are you sure you want to delete ${clickedItem.title}?`}</p>

                }
            </Modal>
        </>
    )
}

function PortfolioCard({title, description, link, icon, isEditable = false, onClickEdit, onClickDelete}) {
    return (
        <div className="portfolio-card p-5 rounded-3xl h-64 w-56 flex flex-col place-content-between ease-out duration-200 shadow-custom hover:cursor-pointer">
            <i className= {`card-icon ${icon}`} aria-label="Portfolio icon" />
            <section>
                <h3 className="text-[18px]">{title}</h3>
                <p>{description}</p>
            </section>
            <div className="portfolio-button-wrap flex flex-row place-content-between text-[20px]">
                { isEditable && 
                    <div className="edit-buttons flex flex-row justify-between gap-[26px]">
                        <button
                            type="button"
                            aria-label="Delete button"
                            onClick={onClickDelete}
                        >
                            <i className="fa fa-trash" aria-hidden="true" />
                        </button>
                        <button type="button" aria-label="Edit button" onClick={onClickEdit}>
                            <i className="fa fa-pen" />
                        </button>
                    </div>
                }
                <a href={link}>
                    <i className="fa fa-arrow-right" />
                </a>
            </div>
        </div>
    )
}