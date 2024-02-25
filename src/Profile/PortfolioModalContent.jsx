import React, {useState } from "react";
import FormWrapper from "../components/Forms/FormWrapper";

/**
 * @param {Object} portfolioItem -- The fields of the portfolioItem, if any.
 * @param {CallableFunction} onFormSubmit -- A callback functiuon to be executed on submit (e.g. update parent portfolio item)
 * @param {CallableFuntion} onFormCancel -- A callback function to be executed on cancel (e.g. Exit parent modal)
 */

export function PortfolioItemEdit({ onEditSubmit, onEditCancel, portfolioItem }) {

    //init with pre-filled fields based on portfolioItem if they exist, otherwise create new fields
    const [formData, setFormData] = useState({
        title: portfolioItem?.title ?? "" ,
        description: portfolioItem?.description ?? "" ,
        link: portfolioItem?.link ?? "" ,
    })

    //update corresponding field on input
    const handleInput = (e) => {
        const {name, value} = e.target;
        // console.log(e.target)
        setFormData(prevState => ({
            ...prevState,
            [name]:value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onEditSubmit(formData);
    }

    return (
            <form onSubmit = {handleSubmit} className="flex flex-col gap-[20px] w-[600px]">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInput}
                    placeholder="Enter a title"
                    maxLength={50}
                    className="w-full px-4 py-2 rounded shadow outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    value={formData.description}
                    onChange={handleInput}
                    placeholder="Enter a brief project description"
                    maxLength={100}
                    className="w-full px-4 py-2 rounded shadow outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    name="url"
                    value={formData.link}
                    onChange={handleInput}
                    placeholder="Link your project via URL"
                    className="w-full px-4 py-2 rounded shadow outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-row justify-end mt-[32px] gap-[40px]">
                    <button type="button" onClick={onEditCancel} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </button>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </div>
            </form>
    )
}

export function PortfolioItemDelete({onDeleteSubmit, onDeleteCancel, portfolioItem}) {

    return(
        <>
            <p>Are you sure you want to delete 
                <span>
                    {portfolioItem?.title}
                </span>
            </p>
            <div className="flex flex-row justify-end mt-[32px] gap-[40px] btn-footer">
                <button type="button" onClick={onDeleteCancel} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Cancel
                </button>
                <button type="button" onClick={onDeleteSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                </button>
            </div>
        </>
    )
}