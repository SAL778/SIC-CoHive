import React, { useState, useEffect, useContext } from "react";
import {httpRequest, genHexColor} from "../utils.js";
import {Pill, TextInput } from '@mantine/core';
import { HostContext, UserContext } from "../App.jsx";


export default function FlairList({flairs, isEditable, isAccessRoles = false}) {
    const { host } = useContext(HostContext);
    const { currentUser } = useContext(UserContext);
    
    const [renderedFlairs, setRenderedFlairs] = useState(flairs) //The live list of flairs
    const [pillText, setPillText] = useState("")

    //Send PATCH to backend
    useEffect(() => {
        if (isEditable) {
            httpRequest({
                endpoint: `${host}/users/${currentUser?.id}/`,
                method: 'PATCH',
                body: JSON.stringify({flair_roles: renderedFlairs.map(flair => ({role_name: flair}))}),    //Access type roles are not user-editable
                onSuccess: () => {
                    setPillText("") //Reset the pill text
                }
            })
        }
    }, [renderedFlairs])

    const removeFlair = (indexToRemove) => {
        //Update list with deleted item
        console.log(prevFlairs => prevFlairs.filter((_, index) => index !== indexToRemove))
        setRenderedFlairs(prevFlairs => prevFlairs.filter((_, index) => index !== indexToRemove))        
    }

    const handleAdd = (value) => {
        //Update list with added item
        console.log([...renderedFlairs, value])
        setRenderedFlairs([...renderedFlairs, value])
    }

    return (
        <Pill.Group className="user-tags">
            {  renderedFlairs.map((flair, index) => (
                    <Pill
                    key = {index}
                    withRemoveButton = {isEditable}
                    onRemove = {() => removeFlair(index)}
                    className = {"button-orange"}
                    styles = { isAccessRoles 
                                ? {root:{backgroundColor: '#e92c20'}} 
                                : {}
                             }
                    > 
                        {flair}
                    </Pill>
            ))}

            { (isEditable && renderedFlairs.length < 10) &&
                <TextInput
                    variant="unstyled"
                    leftSection={<i className="fa fa-plus text-orange-600"/>}
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