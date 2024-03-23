import React, { useState, useEffect, useContext } from "react";
import { Popover, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

/** Returns a render of an Icon Picker
 * 
 * @param {string[]} data - The list of all available icon classes
 * @param {string} value - The select icon class(es)
 * @param {function} onChange - Callable that triggers on selection of iconClass
 * @returns {JSX}
 */

export default function IconPicker({data, value, onChange}) {

    return (
        <Popover position = "bottom-start" trapFocus>
            <Popover.Target>
                <button type="button" className = "relative">
                    <i className = {`text-5xl text-orange-600 ${value}`}/>
                    {/* Small indicator to show that this is changeable */}
                    <i className = "fa fa-caret-down absolute bottom-0 right-0"/>
                </button>
            </Popover.Target>
            <Popover.Dropdown>
                <div className = "grid grid-cols-5 gap-0">
                    {data.map((datum, index) => (
                        <Tooltip key = {index} label = {extractIconName(datum)} >
                            <i 
                                key={index}
                                aria-label={extractIconName(datum)}
                                className={
                                    `cursor-pointer
                                    hover:bg-neutral-200 p-1 rounded-md flex justify-center text-lg
                                    ${(datum == value ? "text-orange-600" : "text-neutral-600")} 
                                    ${datum}`
                                } 
                                onClick={() => {
                                    console.log(datum)
                                    onChange(datum)
                                }}
                            />
                        </Tooltip>
                    ))}
                </div>
            </Popover.Dropdown>
        </Popover>
    )
}


/**Extracts the text of a fontawesome icon for screen readers and tooltips.
 * @param {string} iconClasses - The font awesome string representing an icon class. e.g) "fa-brands fa-twitter"
 * @returns 
 */
const extractIconName = (iconClasses) => {
    const iconClassName = iconClasses.split(" ")[1] //First bit is either "fa or fa-brands"
    const extracted = iconClassName.match(/fa-([a-zA-Z0-9-]+)/)[1]
    return extracted
}