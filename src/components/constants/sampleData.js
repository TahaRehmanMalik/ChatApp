export const sampleChats=[
    {
     avatar:["https://www.w3schools.com/howto/img_avatar.png"],
     name:'John Doe',
     _id:"1",
     groupChat:false,
     members:["1","2"]
    },
    {
        avatar:["https://www.w3schools.com/howto/img_avatar.png",
        ],
        name:'John Bio',
        _id:"2",
        groupChat:true,
        members:["1","2"]
       },
     
 ]
 export const sampleUsers=[
    {
        avatar:"https://www.w3schools.com/howto/img_avatar.png",
        name:'John Doe',
        _id:"1",
       },
       {
           avatar:"https://www.w3schools.com/howto/img_avatar.png",
           name:'John Bio',
           _id:"2",
          },
 ]
 export const sampleNotifications=[
    {
        sender:{
            avatar:"https://www.w3schools.com/howto/img_avatar.png",
            name:'John Bio',
        },
        _id:"1",
       },
       {
          sender:{
            avatar:"https://www.w3schools.com/howto/img_avatar.png",
            name:'John Bio',
        },
           _id:"2",
          },
 ]

 export const sampleMessage=[
    {
        attachments:[],
        
        content:' Chal ma a raha ho',
        _id:'sfnhjkdertyuqws',
        sender:{
         _id:'user._id',
         name:'Chman'
        },
        chat:'chatId',
        createdAt:'2024-04-09T10:40:40.815Z'

    },
    {
        attachments:[{
            public_id:'asdfr 2',
            url:'https://www.w3schools.com/howto/img_avatar.png'
        },],
        
        content:' ',
        _id:'sfnhjkdertyuqwss',
        sender:{
         _id:'sdrgftyhjklqas',
         name:'Chman 2'
        },
        chat:'chatId',
        createdAt:'2024-04-09T10:40:40.815Z'

    },
 ]

 export const dashboardData={
    users:[
       {
        name:'John Doe',
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
        _id:"1",
        username:"john_doe",
        friends:20,
        groups:5
       },
       {
        name:'John Boi',
        avatar:'https://www.w3schools.com/howto/img_avatar.png',
        _id:"2",
        username:"john_boi",
        friends:20,
        groups:25
       },


    ],
    chats:[
        {
            name:'Friend Forever Group',
            avatar:['https://www.w3schools.com/howto/img_avatar.png'],
            _id:"1",
            groupChat:false,
            members:[
                {_id:'1',avatar:'https://www.w3schools.com/howto/img_avatar.png'},
                {_id:'2',avatar:'https://www.w3schools.com/howto/img_avatar.png'}
            ],
            totalMembers:2,
            totalMessages:20,
            creator:{
                name:'John Doe',
                avatar:'https://www.w3schools.com/howto/img_avatar.png'
            }
        },
        {
            name:'ChildHood Group',
            avatar:['https://www.w3schools.com/howto/img_avatar.png'],
            _id:"2",
            groupChat:true,
            members:[
                {_id:'1',avatar:'https://www.w3schools.com/howto/img_avatar.png'},
                {_id:'2',avatar:'https://www.w3schools.com/howto/img_avatar.png'}
            ],
            totalMembers:2,
            totalMessages:20,
            creator:{
                name:'John Boi',
                avatar:'https://www.w3schools.com/howto/img_avatar.png'
            }
        },
  ],
  messages:[
    {
      attachments:[],
      content:'Oy kal ku nahi utha raha ha',
      _id:'sqwerttafgt',
      sender:{
        avatar:"https://www.w3schools.com/howto/img_avatar.png",
        name:'Chaht Fateh Ali Khan'
      },
      chat:'chatId',
      groupChat:false,
      createdAt:'2024-09-19T09:27:42.274Z'
    },
    {
         
      attachments:[
            {
             public_id:'asdsad 2',
             url:'https://www.w3schools.com/howto/img_avatar.png'     
            }
      ],
      content:'',
      _id:'sqwerttafgtqwe',
      sender:{
        avatar:"https://www.w3schools.com/howto/img_avatar.png",
        name:'Chaht Fateh Ali Khan'
      },
      chat:'chatId',
      groupChat:true,
      createdAt:'2024-09-19T09:27:42.274Z'
    }
  ]
 }