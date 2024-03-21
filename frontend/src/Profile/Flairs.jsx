import React, { useState, useEffect, useContext } from "react";
import {httpRequest, genHexColor} from "../utils.js";
import {Pill, TextInput } from '@mantine/core';
import { HostContext, UserContext } from "../App.jsx";


export default function FlairList({flairs, isEditable, pseudorandom = false}) {
    const { host } = useContext(HostContext);
    const { currentUser } = useContext(UserContext);
    
    const [renderedFlairs, setRenderedFlairs] = useState(flairs) //The live list of flairs
    const [pillText, setPillText] = useState("")

    const removeFlair = (indexToRemove) => {
        //Update list
        setRenderedFlairs(prevFlairs => prevFlairs.filter((_, index) => index !== indexToRemove))

        //Patch to backend
        httpRequest({
            endpoint: `${host}/users/${currentUser.id}/`,
            method: 'PATCH',
            body: JSON.stringify({flair_roles: renderedFlairs}),    //Access type roles are not user-editable
        })
    }

    const handleAdd = (value) => {
        setRenderedFlairs([...renderedFlairs, value])
        setPillText("")
    }

    return (
        <Pill.Group>
            {  renderedFlairs.map((flair, index) => (
                    <Pill
                    key = {index}
                    withRemoveButton = {isEditable}
                    onRemove = {() => removeFlair(index)}
                    className = {"text-white bg-orange-600"}
                    styles = { pseudorandom 
                                ? {root: {backgroundColor: genHexColor(flair)}} 
                                : {}
                             }
                    > 
                        {flair}
                    </Pill>
            ))}

            { (isEditable && renderedFlairs.length < 10) &&
                <TextInput
                    variant="unstyled"
                    placeholder = "Add tags" 
                    value = {pillText}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && pillText !== "") {
                            handleAdd(pillText)
                        }
                        if (event.key === "Backspace" && pillText !== ""){  //Override the condition in the on change when length > 15
                            setPillText(pillText.slice(0, -1))          
                        }
                    }}
                    onChange={(event) => {
                        if (pillText.length < 20) {
                            setPillText(event.currentTarget.value)
                        }
                    }}
                />
            }
        </Pill.Group>
    )
}