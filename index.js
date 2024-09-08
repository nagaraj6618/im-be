const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = 8000;
const DB_URL = "mongodb+srv://nagaraj516700:1234567890@cluster0.geq5vn4.mongodb.net/IMDB?retryWrites=true&w=majority&appName=cluster0"
const countSchema = require('./model')
const checkserverWorking = (req, res) => {
   res.json({ message: 'server working', status: true });
}
app.get('/api/v1', checkserverWorking);


async function dbConnection() {
   if (!DB_URL) {
      console.log("Provide DB API");
      process.exit(1);
   }
   try {
      const DBResponse = await mongoose.connect(DB_URL);
      console.log("DB Connected", DBResponse.connection.host);
   }
   catch (error) {
      console.error("DB Connection Error:", error.message);
      // console.log(error);
   }
}

dbConnection();

app.use(express.urlencoded({extended:true}));
app.use(cors({origin:true,credentials:true}));
app.use(express.json())
let count = 0;
const apologyMessages = [
   "I'm truly sorry for hurting you 💔. I never meant to cause you pain.",
   "Please forgive me 🙏. I care about you deeply and want to make things right 💖.",
   "I know I made a mistake 😔, and I'm committed to being better for us 🌱.",
   "I'm really sorry for what happened 😢. I love you and hope we can move forward together 💑.",
   "You mean the world to me 🌍, and I hate that I hurt you 😞. Please forgive me 💕.",
   "I regret my actions 😣, and I promise to learn from this 📖.",
   "I know I let you down 😞, and I'm really sorry. I want to earn your trust back 🤝.",
   "I miss the connection we share 👫, and I’m ready to do whatever it takes to fix this 💪.",
   "You deserve better 🌟, and I will strive to be the partner you deserve 🏆.",
   "Hurting you was never my intention 💔, and I will do everything to make things right 🌈.",
   "I’m sorry for not listening to you when you needed me the most 😔. You deserve better 💖.",
   "I should have been more considerate of your feelings 💭. I promise to be better 🌹.",
   "I know actions speak louder than words 💬, and I'll prove that I'm sorry through my actions 🛠️.",
   "I hate that my actions hurt you 😔. Please know that I'm truly sorry 🥺.",
   "It breaks my heart 💔 to know I let you down, but I’m committed to fixing this 🔧.",
   "I’ve reflected on my mistakes 🤔, and I will work hard to rebuild your trust 🛠️.",
   "You are incredibly important to me 🌟, and I regret letting my actions say otherwise 😞.",
   "I didn’t realize how much my words would hurt you 💬, and I deeply regret it 💔.",
   "I understand that I hurt you 😓, and I’ll do everything I can to make it right 🌱.",
   "I love you 💖 and I’m deeply sorry for not showing it the way you deserve 💐.",
   "Please let me make things right 🤝 because our relationship means everything to me 💑.",
   "My heart hurts knowing that I caused you pain 💔. I will do better 🌟.",
   "I apologize for not thinking things through 🧠. You deserve my best 🌹.",
   "I know I have no excuse for what happened 🙁, but I want to make up for it 💪.",
   "I’m sorry for any pain I caused 😔. I value you more than you know 💖.",
   "Please forgive me 🙏 for not treating you the way you deserve to be treated 💐.",
   "I made a mistake, but I’m learning from it 📖 and I promise it won’t happen again 🔄.",
   "I don’t want to lose you 😢, and I’ll do whatever it takes to make things right 🛠️.",
   "I know I can’t undo what happened ⏳, but I can prove I’m worthy of your trust again 🌱.",
   "My biggest regret is letting you down 😔. I hope I can make things right between us 💕.",
   "I realize now how wrong I was 😔, and I’m sorry for not being the partner you deserve 💖.",
   "I’m sorry for the pain I caused you 💔. I’ll show you with my actions that I’ve changed 🌱.",
   "I understand how important you are to me 🌟, and I’m deeply sorry for everything 🥺.",
   "I take full responsibility for what happened 🙇. I hope you can find it in your heart to forgive me 💕.",
   "I’m truly sorry for everything 🙏. My love for you is real 💖, and I never want to hurt you again 💐.",
   "I never want to be the source of your tears 😢. Please forgive me for my mistakes 💕.",
   "I know I failed you 😞, and I’m truly sorry. I will spend every day making it up to you 💪.",
   "You are the most important person in my life 🌟, and I regret every moment of hurt I caused 💔.",
   "I’m sorry I wasn’t there when you needed me the most 💔. I’ll make sure to never let that happen again 👫.",
   "I realize now how much you mean to me 🌍, and I’ll make sure my actions show it from now on 💖.",
   "You are my world 🌎, and I would do anything for you 💪. I’m deeply sorry for any pain I’ve caused 😞.",
   "You are my reward 🎁, and I promise to cherish and respect you always 💕. Please forgive me 🥺.",
   "I’m willing to do whatever it takes to make things right 🌈. You are everything to me 💖.",
   "I am sorry for my mistakes 🙁. You are my everything, and I will make sure to prove it every day 🌟.",
   "I promise to do anything for you 🌹 because you are my world 🌍 and the greatest gift I have 💝.",
   "You are my world 🌎 and my reward 🌟. I am truly sorry, and I will work to show you how much you mean to me 💖."
];

const updateCount = async () => {
   

   console.log(`Count updated: ${count}`);

   const getCount = await countSchema.find();
   console.log(getCount);
   if (getCount.length === 0) {
      const newCount = await countSchema({
         count: count,
      })
      newCount.save();
   }
   else {
      const id = getCount[0]._id;
      await countSchema.findByIdAndUpdate(id, { count: count });

      const previousMessage = getCount[0].message;
      const randomIndex = Math.floor(Math.random() * apologyMessages.length);
      const randomMessage = apologyMessages[randomIndex];

      await countSchema.findByIdAndUpdate(id, { message: [...previousMessage, randomMessage] });

   }
   count++;
};
// updateCount();
// setInterval(updateCount, 30000);
let intervalId;
app.post('/api/v1/res',async(req,res) => {
   const status = req.body.status;
   if(status === "start"){
      count++;
      intervalId = setInterval(updateCount, 4000);
      return res.status(200).json({data:"Started..."});
   }
   else if(status === "stop"){
      if (intervalId) {
         clearInterval(intervalId);
         intervalId = null;
         count = 0; // Reset count if needed
         return res.status(200).json("Stopped...");
      } else {
         return res.status(400).json("No interval to stop.");
      }
   }
   res.status(400).json("Invalid status.");

})

app.get('/api/v1/res', async (req, res) => {
   // const getCount = await countSchema.find();

   // const id = getCount[0]._id;
   // const previousMessage = getCount[0].message;
   // const randomIndex = Math.floor(Math.random() * apologyMessages.length);
   // const randomMessage = apologyMessages[randomIndex];

   // await countSchema.findByIdAndUpdate(id,{message:[...previousMessage,randomMessage]});

   const getMessage = await countSchema.find();
   if (getMessage.length >= 0 && getMessage[0]) {
      return res.status(200).json({
         message: "Get All the message..",
         data: getMessage[0].message,
         success: true
      });
   }
   res.status(404).json({
      message: "Wait Karo.."
   })

})


app.listen(port, () => console.log('Server Running...'));