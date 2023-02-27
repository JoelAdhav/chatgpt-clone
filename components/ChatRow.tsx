import { ChatBubbleLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

type Props = {
    id: string;
};

const ChatRow = ({ id }: Props) => {
    const [active, setActive] = useState(false);
    const pathName = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [messages] = useCollection(
        collection(db, 'users', session?.user?.email!, 'chats', id, 'messages')
    );

    useEffect(() => {
        if (!pathName) return;

        setActive(pathName.includes(id));
    }, [pathName]);

    const deleteChat = async () => {
        await deleteDoc(doc(db, 'users', session?.user?.email!, 'chats', id));
        router.replace('/');
    };

    return (
        <Link
            href={`/chat/${id}`}
            className={`chatRow justify-center ${active && 'bg-gray-600/50'} `}
        >
            <ChatBubbleLeftIcon className='h-5 w-5' />
            <p className='flex-1 hidden md:inline-flex truncate'>
                {messages?.docs[messages?.docs.length - 1]?.data().text ||
                    'New Chat'}
            </p>
            <TrashIcon
                onClick={deleteChat}
                className={`h-5 w-5 hover:text-red-700 ${
                    active ? 'text-gray-300' : 'text-gray-700'
                }`}
            />
        </Link>
    );
};

export default ChatRow;
