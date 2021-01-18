FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install

# Copy existing application directory contents
COPY . ./

EXPOSE 80

CMD ["yarn","start:dev"]
