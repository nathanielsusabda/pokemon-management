// client/src/features/battle/BattleResultCard.tsx
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper
} from '@mui/material';
import { BattleResult } from '../../types';

interface BattleResultCardProps {
  result: BattleResult;
}

// Color map for Pokémon types
const typeColors: Record<string, string> = {
  Fire: '#F08030',
  Water: '#6890F0',
  Grass: '#78C850'
};

const BattleResultCard: React.FC<BattleResultCardProps> = ({ result }) => {
  // Determine winner styling
  const getCardStyling = (pokemonNumber: number) => {
    if (result.result.winner === 0) {
      return { border: '3px solid #FFD700' }; // Gold border for draw
    }
    
    if (result.result.winner === pokemonNumber) {
      return { border: '3px solid #4CAF50' }; // Green border for winner
    }
    
    return { opacity: 0.7 }; // Reduced opacity for loser
  };
  
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Battle Results
      </Typography>
      
      <Paper 
        elevation={3}
        sx={{ 
          p: 2, 
          mb: 3, 
          bgcolor: result.result.winner === 0 ? '#FFF9C4' : '#E8F5E9',
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" gutterBottom>
          {result.result.winner === 0 
            ? "It's a draw!" 
            : `${result.result.winner === 1 ? result.pokemon1.name : result.pokemon2.name} wins!`}
        </Typography>
        <Typography variant="body1">
          {result.result.message}
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        {/* First Pokemon */}
        <Grid item xs={12} md={6}>
          <Card sx={{ ...getCardStyling(1) }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {result.pokemon1.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Type:
                </Typography>
                <Chip
                  size="small"
                  label={result.pokemon1.type}
                  sx={{
                    bgcolor: typeColors[result.pokemon1.type] || '#A8A8A8',
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              {result.result.winner === 1 && (
                <Typography 
                  variant="body1" 
                  sx={{ fontWeight: 'bold', color: 'success.main', mt: 1 }}
                >
                  WINNER
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Second Pokemon */}
        <Grid item xs={12} md={6}>
          <Card sx={{ ...getCardStyling(2) }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {result.pokemon2.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Type:
                </Typography>
                <Chip
                  size="small"
                  label={result.pokemon2.type}
                  sx={{
                    bgcolor: typeColors[result.pokemon2.type] || '#A8A8A8',
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              {result.result.winner === 2 && (
                <Typography 
                  variant="body1" 
                  sx={{ fontWeight: 'bold', color: 'success.main', mt: 1 }}
                >
                  WINNER
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Type Effectiveness:
        </Typography>
        <Typography variant="body2">
          • Fire is super effective against Grass<br />
          • Water is super effective against Fire<br />
          • Grass is super effective against Water<br />
        </Typography>
      </Box>
    </Box>
  );
};

export default BattleResultCard;