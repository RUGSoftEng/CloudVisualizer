## Prerequisites
#### docker
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
apt-cache policy docker-ce
sudo apt-get install -y docker-ce
```
#### nodejs
```
sudo apt-get update
sudo apt-get install --yes nodejs
sudo apt-get install --yes nodejs-legacy
sudo apt-get install --yes npm
```

## Install Instructions:

clone repo:
```
git clone https://gitlab.com/rvbuijtenen/cloudwatch.git

```

start the application (it will automatically fetch the latest image, install 
dependencies and run a development server):
```
# For API only, use:
bash ./runapi.sh
# For API + Crawler use:
bash ./runcrawler.sh
```

To test if the server is running properly, you can connect to one of the following urls:
```
http://cwdev.nl:8000
http://localhost:8000
http://172.17.0.1:8000
```

Once the server is running, crawl results can be retrieved by sending a POST request to the route /api/v1/

You can use CURL to test whether the API is running. The server will always start with at least one initial seed result. When no POST parameters are present, the results from google-cloud will be returned by default.
```
curl -H "content-type: application/json" -X POST localhost:8000/api/v1/ -d '{"service":"microsoft-azure", "start":"2018-4-20", "end":"2018-4-24"}'
```

### API parameters:

"service": oneof["google-cloud", "amazon-webservices", "microsoft-azure"]. Defaults to "google-cloud" if not specified

"start": String, date-time format according to [RFC3339](https://tools.ietf.org/html/rfc3339) definition. Defaults to UNIX epoch if not specified 

"end": String, date-time format according to [RFC3339](https://tools.ietf.org/html/rfc3339) definition. Defaults to now if not specified



open your browser and go to the development server:
[http://cwdev.nl:8000](http://cwdev.nl:8000)
