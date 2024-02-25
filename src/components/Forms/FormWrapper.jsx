/**
 * This is a wrapper component to go around all other forms to set a baseline styling between
 * forms
 * 
 * @param {JSX.Element} - The form to be nested in the wrapper
 */

export default function FormWrapper({formJSX}) {
    return (
        // Tailwind styles go in here
        <div className = "bg-neutral-100">
            {formJSX}
        </div>
    )
}