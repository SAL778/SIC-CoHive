import React from 'react';
import { ResizableBox } from 'react-resizable';
import "react-resizable/css/styles.css";

/**
 * DraggableSlot component represents a draggable and resizable booking slot.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.selectedSlot - The selected slot object.
 * @param {Function} props.setSelectedSlot - The function to set the selected slot.
 * @param {Function} props.onResize - The function to handle slot resizing.
 * @param {Function} props.onRelease - The function to handle slot release.
 * @param {string} props.resourceName - The name of the resource.
 * @returns {JSX.Element} The DraggableSlot component.
 */
const DraggableSlot = ({ selectedSlot, setSelectedSlot, onResize, onRelease, resourceName}) => {
    const slotHeight = 24; // Extracted variable for slot height

    const maxSlot = selectedSlot.lastAvailableSlot - selectedSlot.index + 1;
    console.log(maxSlot);

    return (
        <ResizableBox
            className="draggable-slot column-booking-card overflow-hidden flex flex-col justify-center rounded-[12px] shadow-custom px-2 py-0 bg-orange-300 text-sm"
            height={Math.max(
                slotHeight,
                ((selectedSlot.end_time - selectedSlot.start_time) / 60000 / 15) * slotHeight
            )} // Initial height based on the slot duration
            axis="y"
            minConstraints={[Infinity, slotHeight]} // Minimum size of 15 minutes
            // Maximum size is equal to all avaliable hours in 15 min increments - the current slot where the user clicked, limits going off the column
            maxConstraints={[Infinity, slotHeight * maxSlot]}
            resizeHandles={["s"]}
            onResize={onResize}
            draggableOpts={{ grid: [slotHeight, slotHeight] }} // Snap to 24px grid
            style={{
                top: `${selectedSlot.index * slotHeight + 100}px`, // Calculate the top position based on the slot index
            }}
            onMouseUp={() => {
                onRelease({ resources_name: resourceName, ...selectedSlot });
                setTimeout(() => {
                    setSelectedSlot();
                }, 200);
            }}
        >
            {/* Content for the booking slot, e.g., time range */}
            <div className="text-center font-bold">
                {selectedSlot.start_time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                &nbsp;-&nbsp;
                {selectedSlot.end_time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </div>
        </ResizableBox>
    );
};

export default DraggableSlot;