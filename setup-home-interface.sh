#!/bin/bash

session="Home-Interface"
project_dir="~/Documents/home-interface" 

tmux new-session -d -s $session

tmux rename-window -t $session:0 "Server"
tmux send-keys -t "$session:0" "cd $project_dir" C-m "sudo npm run start" C-m "1234" C-m
 
tmux new-window -t $session:1 -n "Ngrok"
tmux send-keys -t "$session:1" "ngrok http --host-header=localhost 6969" C-m

tmux new-window -t $session:2 -n "Domain Sync"
tmux send-keys -t "$session:2" "cd $project_dir" C-m "node ngrok-sync" C-m

