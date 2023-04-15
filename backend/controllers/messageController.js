const asyncHandler = require('../middlewares/catchAsyncErrors');
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    // res.status(400);
    // throw new Error(error.message);
    return next(new ErrorHandler(error.message, 400));
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user.id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name avatar").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email",
    });

  
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    // res.status(400);
    // throw new Error(error.message);
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = { allMessages, sendMessage };
