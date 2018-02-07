FROM node:slim
MAINTAINER Chandan kuiry

# Create app directory
WORKDIR /usr/src/test-project

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]