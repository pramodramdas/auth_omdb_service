FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/default.conf

COPY --from=builder /app/build /usr/share/nginx/html

#because of async nature of below command, default.conf was getting cleared
# CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'

# first clear default.conf
RUN > /etc/nginx/conf.d/default.conf
# >> appends
CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/default.conf >> /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'