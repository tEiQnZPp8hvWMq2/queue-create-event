FROM node:14.18.1-alpine

# create destination directory
RUN mkdir -p /src/app
WORKDIR /src/app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git
RUN apk add tzdata
# RUN cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime

# copy the app, note .dockerignore
ENV TZ=Asia/Bangkok
COPY . /src/app/
RUN npm install

# expose 5000 on container

# set app serving to permissive / assigned
# set app port

# start the app
# CMD ["node","test.js"]

CMD ["npm","run","start"]