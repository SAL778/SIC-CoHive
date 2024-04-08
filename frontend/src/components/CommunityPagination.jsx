function Pagination({ totalPages, selectedPage, handlePageChange }) {
    const handlePageClick = (page) => {
        handlePageChange(page);
    };

    const getPageNumbers = () => {
        const delta = 2; // Number of page numbers to display on each side of the current page
        const start = Math.max(1, selectedPage - delta);
        const end = Math.min(totalPages, selectedPage + delta);

        let pageNumbers = [];
        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    const renderPageNumbers = () => {
        const pageNumbers = getPageNumbers();
        return pageNumbers.map((page) => (
            <button
                key={page}
                className={`flex items-center button-thin ${selectedPage === page ? "button-orange" : "button-clear"}`}
                onClick={() => handlePageClick(page)}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="pagination flex flex-row justify-between gap-1">
            <button
                className={`flex items-center button-thin button-orange ${selectedPage === 1 ? 'disabled button-disabled' : ''}`}
                onClick={() => handlePageClick(selectedPage - 1)}
                disabled={selectedPage === 1}
            >
                Prev
            </button>
            {renderPageNumbers()}
            <button
                className={`flex items-center button-thin button-orange ${selectedPage === totalPages ? 'disabled button-disabled' : ''}`}
                onClick={() => handlePageClick(selectedPage + 1)}
                disabled={selectedPage === totalPages}
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
