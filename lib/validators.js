import {body, param, validationResult} from 'express-validator'
import { ErrorHandler } from '../utils/utility.js';
const validateHandler=(req,res,next)=>{
  const errors=validationResult(req);
  const errorMessages=errors.array().map((err)=>err.msg).join(",");
  if(errors.isEmpty())
  {
    return next();
  }
  else{
     next(new ErrorHandler(errorMessages,400))
  }
}
const registerValidator=()=>[
    body("name","Please Enter Name").notEmpty(),
    body("username","Please Enter Username").notEmpty(),
    body("bio","Please Enter Bio").notEmpty(),
    body("password","Please Enter Password").notEmpty(),
  
];

const loginValidator=()=>[
   
    body("username","Please Enter Username").notEmpty(),
    body("password","Please Enter Password").notEmpty(),
];
const newGroupChatValidator=()=>[
   
  body("name","Please Enter Name").notEmpty(),
  body("members").notEmpty().withMessage("Please Enter Members").isArray({min:2,max:100}).withMessage("Members must be between 2-100"),
];
const addMemberValidator=()=>[
   
  body("chatId","Please Enter Chat ID").notEmpty(),
  body("members").notEmpty().withMessage("Please Enter Members").isArray({min:1,max:97}).withMessage("Members must be between 1-97"),
];
const removeMemberValidator=()=>[
   
  body("chatId","Please Enter Chat ID").notEmpty(),
  body("userId","Please Enter User ID").notEmpty(),
];

const sendAttachmentsValidator=()=>[
   
  body("chatId","Please Enter Chat ID").notEmpty(),  
];
const chatIdValidator=()=>[
   
  param("id","Please Enter Chat ID").notEmpty(),

];
const renameGroupValidator=()=>[
   
  param("id","Please Enter Chat ID").notEmpty(),
  body("name","Please Enter Name").notEmpty(),

];
const sendRequestValidator=()=>[
  body("userId","Please Enter User ID").notEmpty(),

];
const acceptRequestValidator=()=>[
  body("requestId","Please Enter Request ID").notEmpty(),
  body("accept",).notEmpty().withMessage(" Please Add Accept")
  .isBoolean().withMessage("Accept must be Boolean")

];
const adminLoginValidator=()=>[
  body("secretKey","Please Enter Secret Key").notEmpty()
]

export {registerValidator,validateHandler,loginValidator,
  newGroupChatValidator,addMemberValidator,removeMemberValidator,
  sendAttachmentsValidator,chatIdValidator,renameGroupValidator,sendRequestValidator,
  acceptRequestValidator,adminLoginValidator 
};