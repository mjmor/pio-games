#!/bin/bash

games=( "hellophaser" "tutorial" "adventure-math" )

sudo rsync -vrz index.html /var/www/html/index.html
sudo rsync -vrz games-site.css /var/www/html/games-site.css

for game in "${games[@]}"; do
    echo "Syncing game $game..."
    sudo rsync -vrz ${game}/ /var/www/html/${game}/
    sudo chmod -R a+rx /var/www/html/*
done
