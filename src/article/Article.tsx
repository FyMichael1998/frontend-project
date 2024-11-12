import * as React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider, Navigation, Router } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const NAVIGATION: Navigation = [
    {
        segment: 'dashboard',
        title: 'Articles',
        icon: <DashboardIcon />,
    },
];

const demoTheme = extendTheme({
    colorSchemes: { light: true, dark: true },
    colorSchemeSelector: 'class',
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function useDemoRouter(initialPath: string): Router {
    const [pathname, setPathname] = React.useState(initialPath);

    const router = React.useMemo(() => {
        return {
            pathname,
            searchParams: new URLSearchParams(),
            navigate: (path: string | URL) => setPathname(String(path)),
        };
    }, [pathname]);

    return router;
}

const Skeleton = styled('div')<{ height: number }>(({ theme, height }) => ({
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    height,
    content: '" "',
}));

const ArticleTable = () => {
    const navigate = useNavigate();

    const [articles, setArticles] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string>('');

    React.useEffect(() => {
        if(!sessionStorage.getItem("id_utilisateur")){
            navigate("/");
            return;
        }
        fetch('http://localhost:3000/article')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Recuperation échouer');
                }
                return response.json();
            })
            .then((data) => {
                setArticles(data);
                setLoading(false);
            })
            .catch((error) => {
                setError('Recuperation échouer : '+error);
                setLoading(false);
            });
    }, []);

    // Fonction pour supprimer un article via l'API
    const handleDelete = (id: number) => {
        fetch('http://localhost:3000/article', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_article: id }),
        })
            .then((response) => {
                if(!sessionStorage.getItem("id_utilisateur")){
                    navigate("/");
                    return;
                }
                if (!response.ok) {
                    throw new Error('Suppression echouer');
                }
                return response.json();
            })
            .then((data) => {
                setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
                window.location.reload();
            })
            .catch((error) => {
                console.error('Erreur deAPI', error);
            });
    };

    // Fonction pour rediriger vers la page de modification
    const handleEdit = (id_article: number) => {
        navigate(`/update-article/${id_article}`);
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Nom</TableCell>
                        <TableCell>Quantite</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {articles.map((row) => (
                        <TableRow key={row.id_article}>
                            <TableCell>{row.id_article}</TableCell>
                            <TableCell>{row.nom_article}</TableCell>
                            <TableCell>{row.quantity}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => handleEdit(row.id_article)}
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    style={{ marginRight: 8 }}
                                >
                                    Modifier
                                </Button>
                                <Button
                                    onClick={() => handleDelete(row.id_article)}
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                >
                                    Supprimer
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default function Article(props: any) {
    const { window } = props;
    const navigate = useNavigate();

    const router = useDemoRouter('/dashboard');
    const demoWindow = window ? window() : undefined;

    // Fonction pour ajouter un nouvel article
    const handleInsert = () => {
        navigate('/new-article');
    };
    const handleLogOut = () => {
        sessionStorage.removeItem("id_utilisateur");
        navigate('/');
    };

    return (
        <AppProvider
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout>
                <PageContainer>
                    <Button
                        onClick={handleInsert}
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: 8 }}
                    >
                        Nouvelle Article
                    </Button>
                    <Button
                        onClick={handleLogOut}
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: 8 }}
                    >
                        Déconnecter
                    </Button>
                    <Grid container spacing={1}>
                        <Grid size={5} />
                        <Grid size={8}>
                            <ArticleTable />
                        </Grid>
                    </Grid>
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}
