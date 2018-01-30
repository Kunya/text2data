clear
#echo "Launching Spark server"
echo "Launching redis server"
./redis-4.0.6/src/redis-server > ./redis-log.txt &
echo "Launching service: Lemmer"
node ./server/service-lemmer.js &
echo "Launching service: Spark"
node ./server/service-spark.js &
echo "Launching Job Manager"
node ./server/manager.js &
echo "Please Launch HTTP server manually"
#node ./server.js

