# auth_omdb_service
#### This is simple microservices architecture with omdb service(nodejs), auth service(golang) and various other tools like zipkin, apigateway, etc 

There are three methods of validating json tokens by changing JWT_VALIDATION for imdb service.
* **JWT_VALIDATION=self** then imdb service will validate token by itself.  
  
![self](https://github.com/pramodramdas/auth_omdb_service/blob/master/images/self.png)  

* **JWT_VALIDATION=grpc** then grpc client in imdb service will pass token to grpc server in auth service for validation.  
  
![grpc](https://github.com/pramodramdas/auth_omdb_service/blob/master/images/grpc_auth.png)  

* **JWT_VALIDATION** if anything other than "self" and "grpc" then api gateway will validate token for all the services
  
![gateway](https://github.com/pramodramdas/auth_omdb_service/blob/master/images/gateway.png)  

### Local dev using docker compose

1. docker-compose build

2. docker-compose up

**Note**: change image: pram25/image_name to your docker repository and run "docker-compose push" so that images cn be pulled in further process(kubernetes)

### Local kubernetes using minikube

1. Install kubeseal  

```
wget https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.9.8/kubeseal-linux-amd64 -O kubeseal

sudo install -m 755 kubeseal /usr/local/bin/kubeseal
```
2. Install sealed-secrets controller  
```
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.9.8/controller.yaml
```
3. Seal all secret files
```
kubeseal --format yaml < original_secret_file.yml > sealed_secret_file.yaml
```
when you excecute above commands your kubernet cluster should be up and running, all this sealed secrets can only be decrypted by sealed-secrets-contoller which originally sealed it, so never include sealed-secrets-contoller as in cloud build.

### Deploy to GCP

1. create cluster

2. install sealed-secret-controller and seal the secrets using cloud shell or glcoud. Follow step 1, 2 and 3 from "Local kubernetes using minikube"

**Note**: original secret files should never be comitted to git.

3. Install ingress-nginx as load balancer  
```  
  kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user $(gcloud config get-value account)

  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml

  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud-generic.yaml
```
4. Now deploy your k8s  

**Note**: **cloudbuild.xml** does not build dockers while deploying to kubernetes, so it is important to build manully and pushing to your dockerhub repository ("docker-compose push"). to automate deployment refer https://github.com/pramodramdas/gcp_web 

docker_custom_init -> init-mongo.js is for creating default admin user and this code only demonstrates for development not production.
"user" and "pwd" should be same as **MONGO_INITDB_ROOT_USERNAME** and **MONGO_INITDB_ROOT_PASSWORD**
So if at all it is used in production the there is need for process of hiding "user" and "pwd"

ADMIN_EMAIL and ADMIN_PASSWORD is seed user for auth service, using which you can login to application for the first time.

**POSTGRES_USER**, **POSTGRES_PASSWORD** and **POSTGRES_DB** used by postgres container to create user should be same as in **POSTGRES_DB_URL** used by user(auth) service

**OMDB_API_KEY** can be obtained from http://www.omdbapi.com/
