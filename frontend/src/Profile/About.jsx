import React, { useState, useRef, useEffect } from "react";
import useAutosizeTextArea from "./useAutosizeTextArea";

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

    const [autoheight, setAutoheight] = useState("")

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
        const {name, value} = e.target;
        setAutoheight(textAreaRef.current, value)
        setPortfolioDescription(value);
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
        setAutoheight(textAreaRef.current, portfolioDescription)
        setIsEditMode(true)
    }

    return (
        <div 
            className = "aboutMeContainer relative max-w-full"
            onMouseEnter = {() => setShowButtonStack(true)} //Show the modify button stack
            onMouseLeave = {() => setShowButtonStack(false)}
            >
            <div>
                <h2 className="text-navy-blue font-medium">About</h2>
                <ButtonStack
                    className="absolute"
                    isVisible= {showButtonStack}
                    isEditing = {isEditMode}
                    onEditSubmit={() => handleSubmit()}
                    onEditInit = {() => handleInit()}
                    onEditCancel = {() => handleCancel()}
                />
            </div>
            <div className = "textField min-h-40 rounded-md relative overflow-auto">
                {(isEditMode && isCurrentUser) ? (
                    <textarea
                    ref = {textAreaRef}
                    rows = {1}
                    maxLength={500}
                    placeholder = "Add a brief description to describe yourself and your works"
                    className = "resize-none rounded-md w-full min-h-40 focus:outline-orange-600 active:outline-4 whitespace-pre-wrap overflow-visibile p-r-8"
                    value = {portfolioDescription}
                    onChange = {handleInput}
                    >
                    </textarea>
                ) : (
                        <p
                        className = "h-full w-full min-h-40 m-0 whitespace-pre-wrap overflow-visible"
                        >{portfolioDescription ? portfolioDescription : "Student Innovation Center Member"}</p>
                    )
                }
            </div>
            
        </div>
    )
}

function ButtonStack({ isVisible, isEditing, onEditInit, onEditCancel, onEditSubmit}) {
    if (isVisible) {
        return (
            <div className="button-stack flex flex-row absolute gap-3 right-0 top-0">
                {isEditing ? (
                    <>
                        <button type="button" className="square-button button-orange" onClick={onEditSubmit}>
                            <i className="fa fa-check" />
                        </button>
                        <button type="button" className="square-button button-orange" onClick={onEditCancel}>
                            <i className="fa fa-times" />
                        </button>
                    </>
                ) : (
                    <button type="button" className="square-button button-orange" onClick={onEditInit}>
                        <i className="fa fa-pen" />
                    </button>
                )}
            </div>
        )
    }
    return null;
}

export default AboutMe

