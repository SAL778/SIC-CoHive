import React, { useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

const BookingHeader = () => {
    const [selectedTab, setSelectedTab] = useState('Rooms');
    const [selectedIcon, setSelectedIcon] = useState('columns');

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const handleIconChange = (icon) => {
        setSelectedIcon(icon);
    };

    return (
        <div className="flex flex-col z-10 mt-[30px] px-[10px] w-full gap-8">
            <div className="flex flex-col">
                <span className="text-md font-regular mb-2">Today</span>
                {/* <DatePicker
                    selected={new Date()}
                    className="bg-orange-600 hover:bg-orange-500 text-white font-regular py-2 px-4 rounded"
                    dateFormat="MMMM d yyyy"
                /> */}
            </div>
            <div className="flex flex-row justify-between items-end">
                <div>
                    <button className="bg-orange-600 hover:bg-orange-500 text-white font-regular py-4 px-8 rounded ">
                        Book a Room
                    </button>
                </div>
                <div className="flex flex-row justify-between items-center gap-6">
                    <div className="flex flex-row justify-between items-center bg-white py-0 px-5 shadow-custom rounded-[5px] h-[56px]">
                        <button
                            className={`${
                                selectedTab === 'Rooms' ? 'bg-orange-600' : 'bg-gray-300'
                            } hover:bg-orange-500 text-sm text-white font-regular py-2 px-4 rounded mr-2`}
                            onClick={() => handleTabChange('Rooms')}
                        >
                            Rooms
                        </button>
                        <button
                            className={`${
                                selectedTab === 'Equipment' ? 'bg-orange-600' : 'bg-gray-300'
                            } hover:bg-orange-500 text-sm text-white font-regular py-2 px-4 rounded`}
                            onClick={() => handleTabChange('Equipment')}
                        >
                            Equipment
                        </button>
                    </div>
                    <div className="flex flex-row justify-between items-center bg-white py-0 px-5 shadow-custom rounded-[5px] h-[56px]">
                        <button
                            className={`${
                                selectedIcon === 'columns' ? 'text-orange-600' : 'text-gray-300'
                            } hover:text-orange-500 font-regular py-2 px-4 rounded mr-2`}
                            onClick={() => handleIconChange('columns')}
                        >
                            <i className="fa fa-columns"></i>
                        </button>
                        <button
                            className={`${
                                selectedIcon === 'rows' ? 'text-orange-600' : 'text-gray-300'
                            } hover:text-orange-500  font-regular py-2 px-4 rounded`}
                            onClick={() => handleIconChange('rows')}
                        >
                            <i className="fa fa-th-list"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingHeader;
