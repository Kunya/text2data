clear
#echo "Launching Spark server"
echo "Launching redis server"
./redis-4.0.6/src/redis-server >> ./Logs/redis-log.txt &
echo "Launching service: Lemmer"
node ./server/service-lemmer.js >> ./Logs/srv-lemmer-log.txt &
echo "Launching service: Spark"
node ./server/service-spark.js >> ./Logs/srv-spark-log.txt &
echo "Launching service: Zip/Unzip"
node ./server/service-zip.js >> ./Logs/srv-zip-log.txt &
echo "Please Launch HTTP server manually"
#node ./server.js

