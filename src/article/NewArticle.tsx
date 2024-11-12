import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewArticle: React.FC = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | string>('');
  const navigate = useNavigate();
  const handleInsert = (name: string, quantity: number) => {
    fetch('http://localhost:3000/article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: name,
        quantite: quantity,
      }),
    })
      .then((response) => {
        if(!sessionStorage.getItem("id_utilisateur")){
            navigate("/");
            return;
        }
        if (!response.ok) {
          throw new Error('Ajout article echouer');
        }
        return response.json();
      })
      .then((data) => {
        navigate('/article');
      })
      .catch((error) => {
        console.error('Erreur API', error);
      });
  };

  // Fonction pour gerer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && quantity) {
      handleInsert(name, parseInt(quantity.toString(), 10));
      navigate('/article'); 
    } else {
      alert('Please fill all fields');
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Nouveau article
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                    label = "Nom de l'article"
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label = "quantite"
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Ajouter
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NewArticle;
