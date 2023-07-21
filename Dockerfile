# base image
FROM node:14.17.6-alpine3.14

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY . .

# install app dependencies and build the app for production
#COPY package.json ./
#COPY package-lock.json ./
RUN npm install --silent && npm install react-scripts@4.0.3 -g --silent && npm install -g serve --silent && npm run build

# start app
CMD ["serve", "-s", "build"]

