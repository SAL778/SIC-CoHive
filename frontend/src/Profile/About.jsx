import React, { useState, useRef } from "react";

/**The rendered representation of the portfolio 
 * @param {string} portfolioDescription -- A string to describe the portolio (About Me section)
 * @param {Boolean} isCurrentUser -- Whether or not the viewer of the profile is the owner of the profile
 * @param {Boolean} isEditing -- Whether or not the user is editing the bio
 * @param {function} onEditSubmit -- Callback function when an update in the bio occurs
 * @returns {JSX.Element} - The rendered representation of the portfolio
 */
function AboutMe({isCurrentUser, portfolioDescriptionProp, isEditing, onEditSubmit}) {
    //init with pre-filled fields based on portfolioItem if they exist, otherwise create new fields
    const [portfolioDescription, setPortfolioDescription] = useState(portfolioDescriptionProp ?? "")   //This is the displayed text

    const [showButtonStack, setShowButtonStack] = useState(false)
    const [isEditMode, setIsEditMode] = useState(isEditing)

    const textAreaRef = useRef(null);

    //update corresponding field on input
    const handleInput = (e) => {
        const {name, value} = e.target;
        setPortfolioDescription(value);
        console.log(e.target)
    };

    const handleSubmit = (e) => {
        onEditSubmit(portfolioDescription);
        setIsEditMode(false);
    }

    const handleCancel = () => {
        setPortfolioDescription(portfolioDescriptionProp) //Dump cache
        setIsEditMode(false);
    }

    const handleInit = () => {
        textAreaRef.current?.focus();
        setIsEditMode(true)
        console.log(textAreaRef)
        
    }

    return (
        <div 
            className = "aboutMeContainer"
            onMouseEnter = {() => setShowButtonStack(true)} //Show the modify button stack
            onMouseLeave = {() => setShowButtonStack(false)}
            >
            <div className = "textField min-h-40 rounded-md overflow-clip">
                {(isEditMode && isCurrentUser) ? (
                    <textarea
                    ref = {textAreaRef}
                    maxLength={500}
                    placeholder = "Add a brief description to describe yourself and your works"
                    className = "resize-none w-full min-h-40 h-full active: outline-orange-600 outline-4 whitespace-pre-wrap overflow-visible"
                    value = {portfolioDescription}
                    onChange = {handleInput}
                    >
                    </textarea>
                ) : (
                        <p
                        className = "h-full min-h-40 m-0 whitespace-pre-wrap"
                        >{portfolioDescription ? portfolioDescription : "Student Innovation Center Member"}</p>
                    )
                }
            </div>
            <ButtonStack
                isVisible={showButtonStack}
                isEditing = {isEditMode}
                onEditSubmit={() => handleSubmit()}
                onEditInit = {() => handleInit()}
                onEditCancel = {() => handleCancel()}
            />
        </div>
    )
}

function ButtonStack({ isVisible, isEditing, onEditInit, onEditCancel, onEditSubmit}) {
    if (isVisible) {
        if (isEditing) {
            return (
                <>
                    <button type="button" onClick={onEditSubmit}>
                        <i className="fa fa-check" />
                    </button>
                    <button type="button" onClick={onEditCancel}>
                        <i className="fa fa-times" />
                    </button>
                </>
            );
        } else {
            return (
                <>
                    <button type="button" onClick={onEditInit}>
                        <i className="fa fa-pen" />
                    </button>
                </>
            );
        }
    }
    return null;
}

export default AboutMe

