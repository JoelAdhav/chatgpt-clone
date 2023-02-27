'use client';
import Sidebar from './Sidebar';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function SidebarContainer() {
    const [click, setClick] = useState(false);
    return (
        <>
            <button
                onClick={() => setClick(!click)}
                className='inline md:hidden rounded-lg'
            >
                {click ? (
                    <XMarkIcon className='fixed top-0 left-[17rem] w-5 h-5 bg-white z-10' />
                ) : (
                    <Bars3Icon className='fixed top-0 left-0 w-5 h-5 bg-white z-10' />
                )}
            </button>
            <div
                className={`${
                    click ? 'inline fixed top-0 left-0' : 'hidden'
                } bg-[#202123] inline md:inline z-10 h-full overflow-hidden min-w-[17rem] max-w-[17rem]`}
            >
                <Sidebar />
            </div>
        </>
    );
}

export default SidebarContainer;
