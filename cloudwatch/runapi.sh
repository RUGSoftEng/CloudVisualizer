npm install
if ! grep -Fxq "172.17.0.1 cwdev.nl" /etc/hosts
then
    sudo -- sh -c "echo 172.17.0.1 cwdev.nl >> /etc/hosts"
fi

sudo docker run -d -v $PWD:/host -p 8000:3000 -it rvanbuijtenen/cloudwatch:compressed /bin/bash
IP=$(sudo docker inspect --format '{{ .NetworkSettings.IPAddress }}' $(sudo docker ps -q))

sudo docker exec -d $(sudo docker ps -q) bash -c "google-chrome --no-sandbox --headless --disable-gpu --remote-debugging-port=9222 &"
sudo docker exec -d $(sudo docker ps -q) bash -c "service mongodb start"
sudo docker exec -d $(sudo docker ps -q) bash -c "mongod --dbpath /host/db"
echo "Starting server on cwdev.nl (172.17.0.1)"
echo "Access VM directly on "$IP":3000"
echo "Press CTRL-C to exit"
sudo docker exec -it $(sudo docker ps -q) bash -c "cd host && npm run startserver -- --no-crawler"
echo "Shutting down VM..."
sudo docker stop $(sudo docker ps -q)
