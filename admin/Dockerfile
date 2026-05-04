FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY server.js ./
COPY public ./public
COPY default-schedule.json ./default-schedule.json

ENV NODE_ENV=production
ENV PORT=8080
ENV SCHEDULE_FILE=/data/schedule.json

EXPOSE 8080

CMD ["npm", "start"]
