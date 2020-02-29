FROM node:12.1.0
WORKDIR "/app"
RUN npm install express-gateway

RUN ./node_modules/.bin/eg gateway create -q -n gateway -d . -t basic

EXPOSE 8080

CMD [ "npm", "run", "start" ]