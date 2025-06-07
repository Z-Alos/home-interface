#!/bin/bash

session="Home-Interface"

tmux new-session -d -s $session

tmux rename-window -t 0 "Server"
tmux send-keys -t "Server" "sudo npm run start" C-m "1234" C-m


tmux new-window -t $session:1 -n "Ngrok"
tmux send-keys -t "Ngrok" "ngrok http --host-header=localhost 6969" C-m 

tmux new-window -t $session:2 -n "Domain Sync"
tmux send-keys -t "Domain Sync" "node ngrok-sync" C-m 


