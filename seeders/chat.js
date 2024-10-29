import { Chat } from '../models/chat.js';
import {User} from '../models/user.js';
import {faker, simpleFaker} from '@faker-js/faker';
import {Message} from '../models/message.js';
const createSingleChat=async(numChat)=>{
    try {
        const users=await User.find().select("_id");
        const chatsPromise=[];
        for(let i=0;i<numChat;i++)
        {
            for(let j=i+1;j<numChat;j++)
            {
                chatsPromise.push(Chat.create({
                    name:faker.lorem.words(2),
                    members:[users[i],users[j]]
                }))
            }
        }
        await Promise.all(chatsPromise);
        console.log("Chats Create Successfully");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
const createGroupChat=async(numChat)=>{
    try {
        const users=await User.find().select("_id");
        const chatsPromise=[];
        for(let i=0;i<numChat;i++)
        {
            const numMembers=simpleFaker.number.int({min:3,max:users.length});
            const members=[];
            for(let i=0;i<numMembers;i++)
            {
                const randomIndex=Math.floor(Math.random()*users.length);
                const randonUser=users[randomIndex];
                if(!members.includes[randonUser])
                {
                    members.push(randonUser);           
                }
            }
            const chat=Chat.create({
                groupChat:true,
                name:faker.lorem.words(1),
                members,
                creator:members[0],
            }
            )
            chatsPromise.push(chat);
        }
        await Promise.all(chatsPromise);
        console.log("Group Chat is created Successfully")
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
const createMessages=async(numMessage)=>{
try {
    const users=await User.find().select("_id");
    const chats=await Chat.find().select("_id");
    const messagesPromise=[];
    for(let i=0;i<numMessage;i++)
    {
        const randomUser=users[Math.floor(Math.random()*users.length)];
        const randomChat=chats[Math.floor(Math.random()*chats.length)];
        messagesPromise.push(
            Message.create(
                {
                    chat:randomChat,
                    sender:randomUser,
                    content:faker.lorem.sentence()
                }
            )
        );
    }
    await Promise.all(messagesPromise);
    console.log("Message Created Successfully");
    process.exit();
} catch (error) {
    console.error(error);
    process.exit(1);
}
}
const createMessagesInAChart=async(chatId,numMessage)=>{
    try {
        const users=await User.find().select("_id");
   
    const messagesPromise=[];
    for(let i=0;i<numMessage;i++)
    {
        const randomUser=users[Math.floor(Math.random()*users.length)];
        messagesPromise.push(
            Message.create(
                {
                    chat:chatId,
                    sender:randomUser,
                    content:faker.lorem.sentence()
                }
            )
        );
    }
    await Promise.all(messagesPromise);
    console.log("Message Created Successfully");
    process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
export{createGroupChat,createSingleChat,createMessages,createMessagesInAChart};