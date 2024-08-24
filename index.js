const express = require("express"); //returns a function
const mongoose = require("mongoose");
const Article = require("./modals/Article");
const app = express(); // The entire app, instence of express

const mongoDBUrl =
  "mongodb+srv://abdulmalek:1234@cluster0.s1weh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("Connected Successfully");
  })

  .catch((error) => {
    console.log("Error with connecting to DB", error);
  });

app.use(express.json()); //to use body params

app.listen(3000, () => {
  //default port is 80
  console.log("I am lisning in port 3000");
}); // Will call this fucntion once, Tells the web server to "listen" to user requests. Parameters: Port, function

app.get("/numbers", (req, res) => {
  let numbers = "";
  for (let i = 0; i <= 100; i++) {
    numbers += i + " - ";
  }
  //   res.send(`The numbers are: ${numbers}`);
  //   res.sendFile(__dirname + "/views/numbers.html"); //returns the path for the file
  //The server will build the html file, not the client
  //   res.send(__dirname + "/views.html")
  res.render("numbers.ejs", {
    name: "Abdulmalek",
    value: numbers,
  });
});

app.get("/", (req, res) => {
  res.send("Default URL");
});

app.put("/test", (req, res) => {
  res.send("you visited test");
});

app.post("/addComment", (req, res) => {
  res.send("post request on add comment");
});

app.delete("/testDelete", (req, res) => {
  res.send("visiting delete request");
});

app.get("/findSummation/:num1/:num2", (req, res) => {
  //   let sum = 0;
  const num1 = req.params.num1;
  const num2 = req.params.num2;

  let sum = Number(num1) + Number(num2);
  res.send(`The total is are: ${sum}`);
});

app.get("/sayHello", (req, res) => {
  //   console.log(req.body);
  //   console.log(req.query);

  //   res.send(`Hello ${req.body.name} age is: ${req.query.age}`);

  res.json({
    name: req.body.name,
    age: req.query.age,
    id: 1,
  });
});

//======Articles Endpoinst =======
app.post("/addrticles", async (req, res) => {
  const newArticle = new Article();

  const artTitle = req.body.articleTilte;
  const artBody = req.body.articleTilte;

  newArticle.title = artTitle;
  newArticle.body = artBody;
  newArticle.numberOfLikes = 0;
  await newArticle.save(); //asynchrounus

  res.json({
    newArticle,
  });
});

app.get("/articles", async (req, res) => {
  const getAllArticles = await Article.find(); // returens all
  console.log("The articles are: ", getAllArticles);
  res.json({
    getAllArticles,
  });
});

app.get("/articles/:articleId", async (req, res) => {
  const id = req.params.articleId;
  try {
    const SpecificArticle = await Article.findById(id);
    res.json({
      SpecificArticle,
    });
    return;
  } catch (error) {
    console.log("Error while reading article of ID", id);
    return res.send(`error: ${error} ID: ${id}`);
  }
});

app.delete("/articlesD/:articleId", async (req, res) => {
  const id = req.params.articleId;

  try {
    const ArticleToBeDeleted = await Article.findByIdAndDelete(id);
    if (!ArticleToBeDeleted) {
      return res.status(404).json({
        message: "Article not found",
        messageAR: "المقال غير موجود",
      });
    }
    res.json({
      message: "The article has been deleted successfuly",
      messageAR: "تم الحذف",
      ArticleToBeDeleted,
    });

    return;
  } catch (error) {
    console.log("Error while reading article of ID", id);
    return res.send(`error: ${error} ID: ${id}`);
  }
});

app.get("/showArticles", async (req, res) => {
  try {
    const articles = await Article.find();

    res.render("articles.ejs", {
      allArticles: articles,
    });
  } catch (error) {
    console.log("Error while reading articles fro DB");
    return res.send(`error: ${error}`);
  }
});
//======Articles Endpoinst =======
