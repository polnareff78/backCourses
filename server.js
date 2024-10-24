const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/listeCourses', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.log('Erreur de connexion à MongoDB:', err));

// Modèle Mongoose pour les produits
const produitSchema = new mongoose.Schema({
  nom: String,
  quantite: Number,
});

const Produit = mongoose.model('Produit', produitSchema);

// Routes
app.get('/api/produits', async (req, res) => {
  const produits = await Produit.find();
  res.json(produits);
});

app.post('/api/produits', async (req, res) => {
  const produit = new Produit(req.body);
  await produit.save();
  res.json(produit);
});

app.delete('/api/produits/:id', async (req, res) => {
  await Produit.findByIdAndDelete(req.params.id);
  res.json({ message: 'Produit supprimé' });
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
