import React from "react";
import Modal from "react-modal";

/** Renders a modal component. Passes props to React-Modal
 *
 * @param {function} onAffirmative - Callback executed on affirmative (e.g. submit form, acknowledge dialogue, etc.)
 * @param {function} onNegative - Callback executed on negative (e.g. cancel form submission, close modal button, etc.)
 * @param {React.JSX} children - JSX content of the modal
 *
 * @param {string} negativeText - Optional prop to set button (negative) text. Will be "Cancel" if unspecified.
 * @param {string} negativeText - Optional prop to set button (positive) text. Will be "Submit" if unspecified.
 */
function ModalComponent({ onAffirmative, onNegative, children, ...props }) {
	return (
		<Modal {...props} className="h-fit w-fit absolute left-1/2 top-1/2 p-8">
			{children}
			<div className="buttonFooter flex justify-end gap-3 mt-4">
				<button
					type="button"
					onClick={onNegative}
					className="text-neutral-500 hover:text-neutral-600 text-base p-3"
				>
					{props.negativeText ?? "Cancel"}
				</button>
				<button
					type="button"
					onClick={onAffirmative}
					className="text-white bg-orange-600 rounded-md hover:bg-orange-700 text-base p-3"
				>
					{props.positiveText ?? "Submit"}
				</button>
			</div>
		</Modal>
	);
}

export default ModalComponent;
