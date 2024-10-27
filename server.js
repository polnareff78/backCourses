const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialisation de l'application Express
const app = express();

// URI de connexion à MongoDB
const mongURI = 'mongodb://atlas-sql-671a5ae7413b613e60f82b62-yhwe3.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin';

// Middleware CORS
const corsOptions = {
  origin: 'https://liste-courses-seven.vercel.app', // URL de votre frontend
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // Méthodes autorisées
  credentials: true, // Si vous avez besoin d'envoyer des cookies ou des en-têtes d'authentification
};

// Appliquer les options CORS
app.use(cors(corsOptions));
app.use(express.json()); // Pour analyser les corps de requête JSON

// Connexion à MongoDB
mongoose.connect(mongURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, // pour créer des index si nécessaire
  useFindAndModify: false // pour éviter les avertissements de dépréciation
})
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.log('Erreur de connexion à MongoDB:', err));

// Activer les logs de Mongoose
mongoose.set('debug', true);

// Modèle Mongoose pour les produits
const produitSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true, // Le nom est requis
  },
  quantite: {
    type: Number,
    required: true, // La quantité est requise
    min: 1 // La quantité minimale est 1
  },
});

const Produit = mongoose.model('Produit', produitSchema);

// Routes
app.get('/api/produits', async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json(produits);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).send('Erreur lors de la récupération des produits');
  }
});

app.post('/api/produits', async (req, res) => {
  console.log("Données reçues :", req.body); // Log des données reçues
  try {
    const produit = new Produit(req.body);
    console.log("Produit à ajouter :", produit);
    await produit.save();
    res.status(201).json(produit); // Renvoie un code de statut 201 pour une création réussie
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du produit", error: error.message });
  }
});


app.delete('/api/produits/:id', async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    res.status(500).send('Erreur lors de la suppression du produit');
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000; // Utiliser la variable d'environnement PORT si elle est définie
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
