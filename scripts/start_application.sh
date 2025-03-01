#!/bin/bash
cd /home/ec2-user/pokemon-management/server
export DB_HOST='database-1.chcik6kwee0y.us-east-2.rds.amazonaws.com'
export DB_USER='pokemonDB'
export DB_PASSWORD='Charizard123'
export DB_NAME='pokemon_management'
pm2 start dist/index.js --name pokemon-backend