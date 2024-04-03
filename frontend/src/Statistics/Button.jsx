import React, {useState} from 'react';


export function ButtonGroup({options, onButtonClick}) {
    
    const [selectedIndex, setSelectedIndex] = useState(0) //Local (Used to calculate slider)
    console.table(options)

    const optionChange = (index) => {
        if (index !== selectedIndex) {
            setSelectedIndex(index)
            onButtonClick(options[index])
        } 
    }

    const isSelected = (index) => (
        index == selectedIndex
    )

    return (
        <div className = {`buttonGroup p-3 gap-4 grid grid-cols-${String(options.length)} bg-white rounded-md shadow-custom`}>
            { options.map((option, index) => (
                <button
                    type="button"
                    className={
                        `py-3 px-6 rounded-md text-medium
                        ${isSelected(index) ? "text-white bg-orange-600" : "text-orange-600"}
                        whitespace-nowrap capitalize
                        ${isSelected(index) ? "hover:bg-orange-700" : "hover:bg-neutral-200"}
                        transition ease-in-out duration-200 
                        `}
                    onClick={() => optionChange(index)}
                >
                    {option.label || option}
                </button>
            ))}
        </div>
    )


}