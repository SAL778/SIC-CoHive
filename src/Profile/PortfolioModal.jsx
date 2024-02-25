import React, {useState} from 'react';
import Modal from 'react-modal';
import { PortfolioItemDelete, PortfolioItemEdit } from "./PortfolioModalContent.jsx";


/**
 * Modal Implementation that supports deletion and editing of portfolio items.
 * @param {function} onEdit - Callable that defines action to occur once edit form is submitted
 * @param {function} onDelete - Callable that defines action to occur once delete button is clicked
 * @param {PortfolioItem} clickedItem - The active portfolio item's object representation
 * @param {Boolean} isDel - Specifies whether the modal should display deletion text or edit form
 * @param {Boolean} isOpen - Main control for displaying and hiding the modal
 * @param {onRequestClose} onRequestClose - Callback function for closing the modal
 * @param {props} rest - The other props handled by the base react-modal
 */
function PortfolioModal(props) {
    //extract these custom props
    const {onEdit, onDelete, clickedItem, isDel, isOpen, onRequestClose, ...rest} = props

    // Remove the unused variables 'content' and 'setContent'
    // const [content, setContent] = useState(clickedItem) //For modifying form elements
    //const [open, setOpen] = useState(isOpen)            //For closing the modal by clicking on a button

    //Generic close for a modal
    const terminateModal = (action) => {
        if (typeof action === 'function') {
            action();
        }
        onRequestClose();
    };

    return (
        //NOTE: passing in the onClose property feels weird. Revisit.
        isDel ? (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} {...rest}>
                <PortfolioItemDelete
                    onDeleteSubmit={() => terminateModal(onDelete(clickedItem))}
                    onDeleteCancel={terminateModal}
                    portfolioItem={clickedItem}
                />
            </Modal>
        ) : (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} {...rest}>
                <PortfolioItemEdit
                    onEditSubmit={() => terminateModal(onEdit(clickedItem))}
                    onEditCancel={terminateModal}
                    portfolioItem={clickedItem}
                />
            </Modal>
        )
    );
}

export default PortfolioModal;

