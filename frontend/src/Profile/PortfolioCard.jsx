/**The rendered representation of the data for the carousel.
 * @param {PortfolioItem} portfolioItem - An object consisting of title (string), description (string), link (string), and id (int)
 * @param {function} onEdit - A callback function that does something when the edit button is clicked.
 * @param {function} onDelete - A callback function that does something when the delete button is clicked.
 * @returns {JSX.Element} - The rendered representation of a portfolioItem
 */
function PortfolioCard({
	title,
	description,
	link,
	onClickEdit,
	onClickDelete,
}) {
	return (
		//Card container
		<div className="portfolio-card p-5 m-5 rounded-3xl h-64 w-56 flex flex-col place-content-between ease-out duration-200 shadow-custom hover:cursor-pointer">
			<i className="card-icon fa fa-lightbulb" aria-label="Portfolio icon" />
			<section>
				<h3 className="text-[18px">{title}</h3>
				<p>{description}</p>
			</section>
			<div className="portfolio-button-wrap flex flex-row place-content-between text-[20px]">
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
				<a href={link}>
					<i className="fa fa-arrow-right" />
				</a>
			</div>
		</div>
	);
}

export default PortfolioCard;
