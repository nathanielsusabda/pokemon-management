// client/src/features/search/SearchPage.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { useSearchTrainersQuery } from '../../api/apiSlice';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  const {
    data: searchResults,
    isLoading,
    error
  } = useSearchTrainersQuery(initialQuery, {
    skip: !initialQuery
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Trainers
        </Typography>
        
        <Box component="form" onSubmit={handleSearch} sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            label="Search trainers by name or Pokémon"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter trainer name or Pokémon name"
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchIcon />}
            sx={{ ml: 1 }}
          >
            Search
          </Button>
        </Box>
      </Box>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error: {JSON.stringify(error)}
        </Alert>
      )}
      
      {initialQuery && !isLoading && !error && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Search Results for "{initialQuery}"
          </Typography>
          
          {searchResults && searchResults.length === 0 ? (
            <Paper sx={{ p: 3, my: 2 }}>
              <Typography variant="body1">
                No trainers found matching your search criteria.
              </Typography>
            </Paper>
          ) : (
            <List sx={{ bgcolor: 'background.paper' }}>
              {searchResults?.map((trainer) => (
                <React.Fragment key={trainer.id}>
                  <ListItem
                    alignItems="flex-start"
                    component="div"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/trainers?id=${trainer.id}`)}
                    >
                    <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <ListItemText
                      primary={trainer.name}
                      secondary={`Trainer ID: ${trainer.id}`}
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      )}
      
      {!initialQuery && (
        <Paper sx={{ p: 3, textAlign: 'center', my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Enter a search term to find trainers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can search by trainer name or by the name of a Pokémon they own.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default SearchPage;