FROM node:latest
RUN npm install -g pm2
WORKDIR /opt/lampp/htdocs/devoicchatbot

#ADD .docker/root/.bashrc /root/
COPY package.json .
COPY package-lock.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8094

CMD [ "npm", "start" ]
#CMD [ "pm2", "start", "--no-daemon", "app.js" ]
#CMD ["sails", "lift"]