#!/bin/bash

games=( "counting-animals" "hellophaser" "tutorial" "adventure-math" )

for game in "${games[@]}"; do
    echo "Syncing game $game..."
    sudo rsync -vrz ${game}/ /var/www/html/${game}/
    sudo chmod -R a+rx /var/www/html/*
done
