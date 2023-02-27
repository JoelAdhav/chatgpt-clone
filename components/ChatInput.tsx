'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { db } from '../firebase';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import ModelSelection from './ModelSelection';

type Props = {
    chatId: string;
};
function ChatInput({ chatId }: Props) {
    const { data: session } = useSession();
    const [prompt, setPrompt] = useState('');

    const { data: model } = useSWR('model', {
        fallbackData: 'text-davinci-003',
    });

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!prompt) return;

        const input = prompt.trim();
        setPrompt('');

        const message: Message = {
            text: input,
            createdAt: serverTimestamp(),
            user: {
                _id: session?.user?.email!,
                name: session?.user?.name!,
                avatar:
                    session?.user?.image! ||
                    `https://ui-avatars.com/api/?name=${session?.user?.name}`,
            },
        };

        await addDoc(
            collection(
                db,
                'users',
                session?.user?.email!,
                'chats',
                chatId,
                'messages'
            ),
            message
        );

        const notification = toast.loading('ChatGPT is thinking...');

        await fetch('/api/askQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: input,
                chatId,
                model,
                session,
            }),
        }).then(() => {
            toast.success('ChatGPT has responded!', {
                id: notification,
            });
        });
    };

    return (
        <div>
            <form
                onSubmit={sendMessage}
                className='bg-gray-600/50 text-gray-400 rounded-lg text-sm p-5 space-x-5 flex'
            >
                <input
                    type='text'
                    value={prompt}
                    disabled={!session}
                    className='bg-transparent focus:outline-none flex-1 text-white disabled:cursor-not-allowed
                     disabled:text-gray-300'
                    onChange={e => setPrompt(e.target.value)}
                    placeholder='Type your message here'
                />
                <button
                    type='submit'
                    disabled={!prompt || !session}
                    className='bg-[#11a37f] hover:opacity-50 text-white font-bold px-4 py-2 rounded
                     disabled:bg-gray-300 disabled:cursor-not-allowed'
                >
                    <PaperAirplaneIcon className='w-4 h-4 -rotate-45' />
                </button>
            </form>
            <div className='md:hidden'>
                <ModelSelection />{' '}
            </div>
        </div>
    );
}

export default ChatInput;
