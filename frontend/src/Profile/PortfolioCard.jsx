/**The rendered representation of the data for the carousel.
 * @param {PortfolioItem} portfolioItem - An object consisting of title (string), description (string), link (string), and id (int)
 * @param {function} onEdit - A callback function that does something when the edit button is clicked.
 * @param {function} onDelete - A callback function that does something when the delete button is clicked. 
 * @returns {JSX.Element} - The rendered representation of a portfolioItem
*/
function PortfolioCard({title, description, link, onClickEdit, onClickDelete}) {
    return (
        //Card container
        <div className="Card group text-orange-600 bg-neutral-50 hover:text-white hover:bg-orange-600 p-5 rounded-md h-64 w-56 flex flex-col place-content-between ease-out duration-500 delay-100">
            <i className="fa fa-lightbulb text-xl" aria-label="Portfolio icon"/>
            <section>
                <h3>{title}</h3>
                <p>{description}</p>
            </section>
            <div className = "button-footer flex flex-row place-content-between">
                <span className = "Edit-buttons flex flex-row justify-between gap-[20px]">
                    <button type = "button" aria-label="Delete button" onClick = {onClickDelete}>
                        <i className="fa fa-trash hover:text-neutral-300" aria-hidden="true"/>
                    </button>
                    <button type = "button" aria-label="Edit button" onClick = {onClickEdit}>
                        <i className="fa fa-pen hover:text-neutral-300"/>
                    </button>
                </span>
                <a href = {link}>
                    <i className="fa fa-arrow-right"/>
                </a>
            </div>
        </div>
    )
}

export default PortfolioCard;