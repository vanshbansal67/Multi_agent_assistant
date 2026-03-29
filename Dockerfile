FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Port ko environment variable se uthane do
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]