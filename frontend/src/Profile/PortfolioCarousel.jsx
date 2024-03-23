import React, { useState, useEffect, useContext } from "react";
import PortfolioForm from "../components/Forms/PortfolioForm.jsx";
import { httpRequest } from "../utils.js";
import { HostContext, UserContext } from "../App.jsx";
import MantineCarousel from "../components/Carousel/MantineCarousel.jsx";
import {ErrorNotification, SuccessNotification} from "../components/notificationFunctions.js";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

export default PortfolioCarousel

/** A function that returns a render of all portfolio items in a carousel, and handles all events
 * including addition, edit, deletion via trigger of modals
 * 
 * @param {portfolio[]} portfolioItems: An array of portfolio items, including link, name, description and icon
 * @param {Boolean} isEditable - Whether the porfolio is modifiable.
 */

//TODO: Rename this to portfolio
function PortfolioCarousel({ portfolioItems, isEditable}) {

    const {host} = useContext(HostContext);
    const {currentUser} = useContext(UserContext);
    const [opened, {open, close}] = useDisclosure(false);

    const [openedModal, setOpenedModal] = useState(null) 
    const [clickedItem, setClickedItem] = useState(null)
    const [currentPortfolioList, setCurrentPortfolioList] = useState(portfolioItems)

    //Delete portfolio item
    const onSubmitModalDelete = () => {
        //Send to backend
        httpRequest({
            endpoint: `${host}/users/portfolio/items/${clickedItem.id}`,
            method: 'DELETE',
            onSuccess: () => {
                console.log('deleted')
                new SuccessNotification(
                    "Item deleted",
                    `${clickedItem.title} was succesfully deleted!`
                ).show();
                setCurrentPortfolioList(currentPortfolioList.filter(item => item.id !== clickedItem.id));
                setClickedItem(null)
            },
            onFailure: () => {
                new ErrorNotification(
                    "Item not deleted",
                    `${clickedItem.title} could not be deleted`
                )
                setClickedItem(null)
            }
        })
        setCurrentPortfolioList(currentPortfolioList.filter(item => item.id !== clickedItem.id));
        modalClose()
    }

    //Edit portfolio item
    const onSubmitModalEdit = (updatedItem) => { //Updated item != Clicked item
        //Send to backend
        httpRequest({
            endpoint: `${host}/users/portfolio/items/${clickedItem.id}/`,
            method: 'PATCH',
            body: JSON.stringify(updatedItem),
            onSuccess: () => {
                new SuccessNotification(
                    "Item edited",
                    `${clickedItem.title} was succesfully edited!`
                ).show();
                const updatedItemList = currentPortfolioList;
                updatedItemList[currentPortfolioList.findIndex(_ => _.id == clickedItem.id)] = updatedItem;
                setCurrentPortfolioList(updatedItemList)
                modalClose()
            },
            onFailure: () => {
                new ErrorNotification(
                    "Item not edited",
                    `${clickedItem.title} could not be edited!`
                )
                modalClose()
            }
        })
    }

    //Add porfolio item
    const onSubmitModalAdd = (addedItem) => {
        httpRequest({
            endpoint: `${host}/users/${currentUser.id}/portfolio/items/`,
            method: 'POST',
            body: JSON.stringify(addedItem),
            onSuccess: () => {
                new SuccessNotification(
                    "Item added",
                    `${addedItem.title} was succesfully added!`
                ).show();
                setCurrentPortfolioList([...currentPortfolioList, addedItem])
                modalClose()
            },
            onFailure: () => {
                new ErrorNotification(
                    "Item not edited",
                    `${addedItem.title} could not be edited!`
                )
                modalClose()
            }
        })
    }

    //Close the modal with a delay to change after modal is unmounted
    const modalClose = () => {
        close()
        setTimeout(() => {
            setOpenedModal(null);
            setClickedItem(null)
        }, 200);
    }

    return (
        <div className="flex flex-col justify-between gap-4 px-[10px]">  
            <h1 className="text-orange-600 text-4xl font-bold">Portfolio</h1>

            {isEditable &&
                <button 
                type="button" 
                className="button-orange w-24 mt-4" 
                onClick={() => {
                    setOpenedModal("edit")
                    open()
                }}>
                    Add Item
                </button>
            }

            {(currentPortfolioList.length == 0 && !isEditable) ? (
                <p>This person has no portfolio items</p>
            ) : (
                <MantineCarousel>
                    { currentPortfolioList.map((portfolioItem) => (
                        <PortfolioCard
                            key={portfolioItem.id}
                            portfolioItem={portfolioItem}
                            isEditable={isEditable}
                            onClickEdit={() => {
                                console.log(portfolioItem);
                                setClickedItem(portfolioItem);
                                setOpenedModal("edit");
                                open();
                            }}
                            onClickDelete={() => {
                                setClickedItem(portfolioItem);
                                setOpenedModal("delete");
                                open();
                            }}
                            onClickRedirect={() => {
                                setClickedItem(portfolioItem);
                                setOpenedModal("redirect");
                                open();
                            }}
                        />
                    ))}
                    {  isEditable &&
                        <button
                        type = "button"
                        className = "portfolio-card-add bg-neutral-100 text-orange-600 p-5 rounded-3xl h-64 w-56 shadow-custom ease-out duration-200"
                        onClick = {() => {
                            setOpenedModal("edit")
                            open()
                        }}                //Clicked item is null so submit behaviour should be "add"
                        >
                            <i className="text-3xl fa fa-plus"/>
                        </button>
                    }
                </MantineCarousel>
                )
            }

            <Modal
            opened = {opened}
            onClose= {modalClose}
            centered
            size="md"
            transitionProps={{
                transition: "slide-up",
                duration: 200,
                timingFunction: "ease-in-out",
            }}
            >   
                <h1 className="text-orange-600 font-semibold text-lg">Portfolio Item</h1>
                { openedModal == "edit" &&
                    <PortfolioForm 
                        portfolioItem = {clickedItem}
                        onClose = {modalClose}
                        onSubmit = {!!(clickedItem) ? onSubmitModalEdit : onSubmitModalAdd}
                    />
                }
                { openedModal == "redirect" &&
                    <>
                        <p>You are being redirected to an external site
                            <span className = "block text-orange-600"> {clickedItem.link}</span> 
                        </p>

                        <div className = "flex gap-3 pt-3 justify-end">
                            <button type="button" className = "button-grey-hover modal-button" onClick={modalClose}>Close</button>
                            {/* Opens the link in a new window */}
                            <button 
                            type= "button" 
                            className = "button-orange modal-button"
                            onClick={() => {
                                window.open(clickedItem.link, '_blank');
                                modalClose();
                            }}>
                                Continue
                            </button>
                        </div>
                    </>
                }
                { openedModal == "delete" &&
                    <>
                        <p>{`Are you sure you want to delete ${clickedItem?.title}?`}</p>
                        <div className = "flex gap-3 pt-3 justify-end">
                            <button type="button" className = "button-grey-hover modal-button" onClick={() => modalClose()}>Close</button>
                            <button type ="button" className = "button-orange modal-button" onClick={() => onSubmitModalDelete()}>Delete</button>
                        </div>
                    </>
                }
            </Modal>
        </div>
    )
}

/**Function that returns the render of a portfolio card.
 * 
 * @param {Object} portfolioItem - The portfolio item clicked on, including link, title, description, icon
 * @param {Boolean} isEditable - Whether or not the clicked item can be edited
 * @param {function} onClickEdit - Callable to execute when the portfolio item is edited
 * @param {function} onClickDelete - Callable to execute when the portfolio item is deleted
 * @returns {JSX}
 */
function PortfolioCard({portfolioItem, isEditable = false, onClickEdit, onClickDelete, onClickRedirect}) {
    const defaultIcon = 'fa fa-lightbulb' //Class name for a font-awesome icon

    return (
        <div className="portfolio-card p-5 rounded-3xl h-64 w-56 flex flex-col place-content-between ease-out duration-200 shadow-custom hover:cursor-pointer">
            <i className= {`card-icon ${portfolioItem?.icon || defaultIcon}`} aria-label="Portfolio icon" />
            <section>
                <h3 className="text-[18px] font-semibold">{portfolioItem.title}</h3>
                <p>{portfolioItem.description}</p>
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
                <button onClick = {onClickRedirect}>
                    <i className="fa fa-arrow-right" alt={portfolioItem.link}/>
                </button>
            </div>
        </div>
    )
}