const asyncHandler = require('../middlewares/catchAsyncErrors');
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");
const Notify = require("../models/notify");

//@route           GET /api/Message/:chatId
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


//@route           POST /api/Message/
const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const chat = await Chat.findById(chatId);

  let users = chat.users

  let receiver = users.filter(item => item.toString() !== req.user._id.toString())[0]


  var newMessage = {
    sender: req.user._id,
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

    await Notify.create({
      user: receiver,
      content: `Bạn có một tin nhắn mới`,
      type: 1
    })

    res.json(message);
  } catch (error) {
    // res.status(400);
    // throw new Error(error.message);
    return next(new ErrorHandler(error.message, 400));
  }
});

module.exports = { allMessages, sendMessage };
