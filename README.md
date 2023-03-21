### Remarks

## Required
    Node -v 16

## Environment Varibles (.development.env )
# Emails Sender: to configure the followings environment variables:
    MAIL_HOST
    MAIL_USER
    MAIL_PASSWORD
    FROM_EMAIL 

    OBS.: access this link https://app.sendgrid.com/ to configure your email sender

# Mongo DB URI: to configure the followings environment variables:
    MONGO_DB_URI

# Run docker compose file ( docker-compose up ) in root dir of project to inicialize the Rabbitmq
    dir: /user_application/docker-compose.yml

    OBS.: once rabbitmq inicialized you can acces in http://localhost:15672/
        The credentials are in environment file (.development.env )

# Swagger documentation
    http://localhost:3001/api#/

## Run Application
    from root of project, execute:
# yarn
    to add all dependencies

# yarn start 
    to start the project