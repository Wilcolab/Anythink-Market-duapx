require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

require("../models/User");
require("../models/Item");
require("../models/Comment");
const Item = mongoose.model("Item");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");

const generateComment = async (item, index) => {
  const comment = new Comment({
    text: `Comment ${index}`,
    user: item.user,
    item: item._id,
  });
  await comment.save();
};

const generateItem = async (user, i) => {
  const item = new Item({
    title: `Item ${i}`,
    description: "A very nice item",
    image: "https://i.imgur.com/zY9gY8Y.jpg",
    price: i * 10,
    seller: user._id,
    tags: ["tag1", "tag2"],
  });
  await item.save();
  await generateComment(item, i);
};

const generateData = async () => {
  for (let i = 0; i < 100; i++) {
    const user = new User({
      email: i + "@gmail.com",
      password: "123456",
      username: `user${i}`,
      bio: "I am a user",
      image: "https://i.imgur.com/zY9gY8Y.jpg",
    });
    await user.save();
    await generateItem(user, i);
  }
};

generateData()
  .then(() => {
    console.log("Finished seeds");
    process.exit(0);
  })
  .catch((err) => {
    console.log(`Error while running seeds: ${err.message}`);
    process.exit(1);
  });
