#!/bin/bash

games=( "counting-animals" "hellophaser" )

for game in "${games[@]}"; do
    echo "Syncing game $game..."
    sleep 1
    sudo rsync -vrz ${game}/ /var/www/html/${game}/
    sudo chmod -R a+rx /var/www/html/*
done
