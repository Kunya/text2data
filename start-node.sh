clear
echo "Launching redis server"
sudo /root/redis-4.0.6/src/redis-server /root/redis-4.0.6/redis.conf >> /root/text2data/Logs/redis-log.txt &
echo "Launching Node server"
sudo forever stop /root/text2data/server.js
sudo forever start /root/text2data/server.js

