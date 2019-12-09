FROM node:12.2.0 as nodebuilder
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@7.3.9
COPY . /app

RUN ng build --output-path=dist

FROM jetty as appserver

COPY app.xml /var/lib/jetty/webapps/app.xml
COPY --from=nodebuilder /app/dist /app/static/
COPY entrypoint.sh /app/

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT /app/entrypoint.sh

