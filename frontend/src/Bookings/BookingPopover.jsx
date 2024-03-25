import React, { useContext, useState } from "react";
import { Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

/**Renders a popover for an asset that lists its qualities
 * 
 * @param {string} assetImage - url of image
 * @param {string} assetDescription - description of asset
 * @param {array} assetPermissions - List of asset permissions
 * @param {JSX.Element} children - The child that popover renders on
 * @returns 
 */
export default function BookingPopover({assetImage, assetCode, assetName, assetDescription, assetPermissions, children}) {
    const [opened, { close, open }] = useDisclosure(false);
    const imageFallback = "https://www.startarchitecture.ca/media/2021/c.jpg"

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userPermissions = currentUser.accessType.map(access => access.name) 

    const overlapPermissions = assetPermissions?.some(permission => userPermissions.includes(permission))

    return (
        <Popover position="top" withArrow shadow="md" opened={opened}>
            <Popover.Target>
                <div className="childWrapper" onMouseEnter={open} onMouseLeave={close}>
                    {children}
                </div>
            </Popover.Target>
            <Popover.Dropdown>
                <div>
                    <img className="w-24 h-24 rounded-md" src = {assetImage || imageFallback} alt = {assetName}/>
                    <p className="text-lg font-medium">{assetDescription}</p>

                    {(overlapPermissions && !!assetCode) &&
                        <p>Room Code: {assetCode}</p>
                    }
                </div>
            </Popover.Dropdown>
        </Popover>
    )
}