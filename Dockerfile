FROM node:14-alpine

WORKDIR /app

COPY package.json ./
COPY . .

RUN yarn install --frozen-lockfile --silent

RUN yarn build

ENV REACT_APP_OPENAI_KEY=$REACT_APP_OPENAI_KEY
ENV REACT_APP_ORGANIZATION_ID=$REACT_APP_ORGANIZATION_ID

EXPOSE 3000

CMD [ "yarn", "start" ]
