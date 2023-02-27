'use client';

import { useSession, signOut } from 'next-auth/react';
import NewChat from './NewChat';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import ChatRow from './ChatRow';
import ModelSelection from './ModelSelection';
import {
    ArrowRightOnRectangleIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [chats, loading, error] = useCollection(
        session &&
            query(
                collection(db, 'users', session?.user?.email!, 'chats'),
                orderBy('createdAt', 'asc')
            )
    );

    const deleteChats = () => {
        chats?.docs.map(
            async chat =>
                await deleteDoc(
                    doc(db, 'users', session?.user?.email!, 'chats', chat.id)
                )
        );

        router.replace('/');
    };

    return (
        <div className='p-2 h-screen flex flex-col'>
            <div className='flex-1'>
                <NewChat />

                <div className='hidden sm:inline'>
                    <ModelSelection />
                </div>

                <div className='flex flex-col space-y-2 my-2'>
                    {loading && (
                        <div className='animate-pulse text-center text-white'>
                            <p>Loading Chats...</p>
                        </div>
                    )}
                    {chats?.docs.map(chat => (
                        <ChatRow key={chat.id} id={chat.id} />
                    ))}
                </div>
            </div>

            <div className='bg-gray-600/50 w-full h-[2px] mb-2'></div>
            <div
                onClick={deleteChats}
                className='flex items-center p-3 cursor-pointer rounded-lg hover:bg-gray-600/50'
            >
                <TrashIcon className='h-5 w-5 mx-1 text-gray-300' />
                <p className='text-white text-sm mx-2'>Clear Conversations</p>
            </div>
            <div
                onClick={() => signOut()}
                className='flex items-center p-3 mb-2 cursor-pointer rounded-lg hover:bg-gray-600/50'
            >
                <ArrowRightOnRectangleIcon className='h-5 w-5 mx-1 text-gray-300' />
                <p className='text-white text-sm mx-2'>Log Out</p>
            </div>
        </div>
    );
};

export default Sidebar;
