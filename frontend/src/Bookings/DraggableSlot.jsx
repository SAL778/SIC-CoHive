import React from 'react';
import { ResizableBox } from 'react-resizable';
import "react-resizable/css/styles.css";

const DraggableSlot = ({ selectedSlot, setSelectedSlot, onResize, onRelease, resourceName}) => {
    const slotHeight = 24; // Extracted variable for slot height

    return (
        <ResizableBox
            className="draggable-slot column-booking-card overflow-hidden flex flex-col justify-center rounded-[12px] shadow-custom pl-8 pr-10 py-0 bg-orange-300 text-sm"
            height={Math.max(
                slotHeight,
                ((selectedSlot.end_time - selectedSlot.start_time) / 60000 / 15) * slotHeight
            )} // Initial height based on the slot duration
            axis="y"
            minConstraints={[Infinity, slotHeight]} // Minimum size of 15 minutes
            maxConstraints={[Infinity, slotHeight * 4 * 13]} // Maximum size of 13 hours
            resizeHandles={["s"]}
            onResize={onResize}
            draggableOpts={{ grid: [slotHeight, slotHeight] }} // Snap to 24px grid
            style={{
                top: `${selectedSlot.index * slotHeight + 100}px`, // Calculate the top position based on the slot index
            }}
            onMouseUp={() => {
                onRelease({ resources_name: resourceName, ...selectedSlot });
                setSelectedSlot();
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