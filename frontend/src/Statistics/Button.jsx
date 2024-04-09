import React, {useState} from 'react';


export function ButtonGroup({options, onButtonClick, bgGrey = false}) {
    
    const [selectedIndex, setSelectedIndex] = useState(0)

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
        <div className={`${bgGrey ? "bg-[#f8f8f8]" : "bg-white"} button-group flex flex-row justify-between items-center py-0 px-5 shadow-custom rounded-[5px] h-[64px]`}>
            { options.map((option, index) => (
                <button
                    type="button"
                    className={
                        `flex items-center gap-3 p-3 button-thin
                        ${isSelected(index) ? "button-orange" : "button-clear"}
                        whitespace-nowrap capitalize
                        `}
                    onClick={() => optionChange(index)}
                >
                    {option.label || option}
                </button>
            ))}
        </div>
    )


}