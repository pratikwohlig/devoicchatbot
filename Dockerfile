FROM node:latest

WORKDIR /opt/lampp/htdocs/devoicchatbot

COPY package.json .
COPY package-lock.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8094

CMD [ "npm", "start" ]