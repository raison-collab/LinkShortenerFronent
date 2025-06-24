FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG VITE_API_URL
ARG BACKEND_DOCKER_URL
ENV VITE_API_URL=$VITE_API_URL
ENV BACKEND_DOCKER_URL=$BACKEND_DOCKER_URL

RUN npm run build

FROM nginx:stable-alpine AS production

RUN apk add --no-cache gettext

COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '${BACKEND_DOCKER_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"] 