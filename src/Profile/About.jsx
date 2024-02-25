import React, { useState } from "react";

<section>
    <h1>About</h1>
    <p>{portfolio.description}</p>
    <button type="button"><i className = "fa fa-pen"/></button>
</section>

/**The rendered representation of the portfolio 
 * @param {string} portfolioDescription -- A string to describe the portolio (About Me section)
 * @param {Boolean} isCurrentUser -- Whether or not the viewer of the profile is the owner of the profile
 * @param {Boolean} isEditing -- Whether or not the user is editing the bio
 * @param {function} onEditSubmit -- Callback function when an update in the bio occurs
 * @returns {JSX.Element} - The rendered representation of the portfolio
 */
function AboutMe(isCurrentUser, portfolioDescriptionProp, isEditing, onEditSubmit) {
    //init with pre-filled fields based on portfolioItem if they exist, otherwise create new fields
    const [portfolioDescription, setPortfolioDescription] = useState(portfolioDescriptionProp ?? "")

    //update corresponding field on input
    const handleInput = (e) => {
        const {name, value} = e.target;
        setPersonDescription(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onEditSubmit(portfolioDescription);
    }

    return (
            <div className = "aboutMeContainer">
                {
                    !isEditing
                    ? <p>{portfolioDescription ?? "No description provided"}</p>
                    : <textarea
                        rows = "4"
                        maxlength = "500"
                        placeholder = "Add a brief description to describe yourself and your works"
                      >
                        {portfolioDescription}
                      </textarea>
                }
            </div>









    )


    
}

export default AboutMe

