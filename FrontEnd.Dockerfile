FROM node:16.13.0

ADD ./front-end/ /srv/front-end

WORKDIR /srv/front-end

RUN npm install

CMD npm start