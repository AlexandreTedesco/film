import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/search', async (req, res) => {
    const { query } = req;
    try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des données');
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
