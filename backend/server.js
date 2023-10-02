const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const cors = require("cors"); 
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());

const uri = "mongodb+srv://erikcwill:DWipznRYfU8Lm3Rf@databases.xpmudft.mongodb.net/databases?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Conectado ao MongoDB Atlas");
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB Atlas:", err);
  }
}

app.get("/api/products", async (req, res) => {
  try {
    const database = client.db("databases");
    const collection = database.collection("products");
    const products = await collection.find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).send("Erro interno do servidor");
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { name } = req.body;
    const database = client.db("databases");
    const collection = database.collection("products");
    const result = await collection.insertOne({ name });
    const newProduct = result.ops[0];
    console.log("Novo produto adicionado:", newProduct); // Adicione esta linha para depuração
    res.json(newProduct);
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    res.status(500).send("Erro interno do servidor");
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const database = client.db("databases");
    const collection = database.collection("products");
    const result = await collection.deleteOne({ _id: ObjectID(productId) });
    if (result.deletedCount === 1) {
      res.sendStatus(200);
    } else {
      res.status(404).send("Produto não encontrado");
    }
  } catch (err) {
    console.error("Erro ao remover produto:", err);
    res.status(500).send("Erro interno do servidor");
  }
});

connectToDatabase();

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`);
});
