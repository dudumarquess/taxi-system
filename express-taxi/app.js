const express = require('express');
const mongoose = require('mongoose');
const motoristaRoutes = require('./routes/motoristaRoutes');
let cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/motoristas', motoristaRoutes);



//conexão com o mongoDB
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://raviabreu8:raviabreu8@cluster0.satw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log('Conectado ao MongoDB Atlas com sucesso');
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
