import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Typography, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const NewArticle: React.FC = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | string>('');
  const { id_article } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id_article) {
      fetch(`http://localhost:3000/article/${id_article}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setName(data[0].nom_article);
          setQuantity(data[0].quantity);
        })
        .catch((error) => console.error('Erreur lors de la récupération des données :', error));
    }
  }, [id_article]);

  const handleUpdate = (name: string, quantity: number, id_article: string) => {
    fetch('http://localhost:3000/article', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom: name,
        quantite: quantity,
        id_article: parseInt(id_article),
      }),
    })
      .then((response) => {
        if(!sessionStorage.getItem("id_utilisateur")){
            navigate("/");
            return;
        }
        if (!response.ok) {
          throw new Error('Erreur lors de la mise à jour de l\'article');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && quantity && id_article) {
      handleUpdate(name, parseInt(quantity.toString(), 10), id_article);
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
              Modifier l'Article
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Modifier
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
