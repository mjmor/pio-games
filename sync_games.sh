#!/bin/bash

games=( "adventure-math" )

sudo rsync -vrz index.html /var/www/html/index.html
sudo rsync -vrz css/games-site.css /var/www/html/css/games-site.css

for game in "${games[@]}"; do
    echo "Syncing game $game..."
    sudo rsync -vrz ${game}/ /var/www/html/${game}/
done
sudo chmod -R a+rx /var/www/html/*
