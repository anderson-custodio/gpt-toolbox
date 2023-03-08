#!/bin/bash
api_key=$1
org=$2
docker build -t meu-app-react --build-arg REACT_APP_OPENAI_KEY="${api_key}" --build-arg REACT_APP_ORGANIZATION_ID="${org}" .
