FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache openssl

USER node
WORKDIR /src

COPY --chown=node:node package*.json ./
RUN npm install

# Copy the rest of the app code
COPY --chown=node:node . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
