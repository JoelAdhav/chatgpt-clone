// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import query from '../../lib/queryApi';
import admin from 'firebase-admin';
import { adminDb } from '../../firebaseAdmin';

type Data = {
    answer: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { chatId, prompt, model, session } = req.body;

    if (!prompt) {
        res.status(400).json({ answer: 'Please provide a valid prompt!' });
        return;
    }

    if (!chatId) {
        res.status(400).json({ answer: 'Please provide a valid Chat ID!' });
        return;
    }

    const response = await query(prompt, model);

    const message: Message = {
        text: response || 'ChatGPT was unable to find the answer for that',
        createdAt: admin.firestore.Timestamp.now(),
        user: {
            _id: 'ChatGPT',
            name: 'ChatGPT',
            avatar: 'https://brandlogovector.com/wp-content/uploads/2023/01/ChatGPT-Icon-Logo-PNG.png',
        },
    };

    await adminDb
        .collection('users')
        .doc(session?.user?.email)
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add(message);

    res.status(200).json({ answer: message.text });
}
