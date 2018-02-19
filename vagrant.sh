#!/usr/bin/env bash

# Update apt first (system package installer)
sudo apt update --yes

# Install the only editors you'll ever need.
# Protip: vim is better than emacs
sudo apt install vim --yes

# Version control!
sudo apt install git --yes

# Install MySQL server with the default argument --yes
sudo apt install build-essential apache2 --yes
