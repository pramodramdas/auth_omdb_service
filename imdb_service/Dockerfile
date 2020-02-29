FROM node:12.1.0
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY . .
RUN chmod +x wait-for-it.sh
# ENTRYPOINT [ "/bin/bash", "-c" ]
# CMD ["./wait-for-it.sh" , "127.0.0.1:27017" , "--strict" , "--timeout=300" , "--" , "npm run start"]
CMD ["npm", "run", "start"]