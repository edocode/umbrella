# Pic-kasa

Pic-kasa is a web-based multiplayer game where a random topic is chosen and all players must write an AI prompt to generate images of the topic without using any banned words. Banned words for now include the topic word itself.

## Deploying a copy of the app

Click the deploy button and follow the instructions to enter your API keys.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/edocode/umbrella)


## Running for development

1. Clone this repository.
2. Create a .env file with your secret keys. Check the [netlify.toml](./netlify.toml) in the template environment section to find out what is required.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to run the React front end and Netlify functions back end.
5. Access the game at http://localhost:8888
