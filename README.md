### Remarks

## Required
   - Node -v 16

## Environment Varibles (.development.env )
# Emails Sender: to configure the followings environment variables:
    - MAIL_HOST
    - MAIL_USER
    - MAIL_PASSWORD
    - FROM_EMAIL 

    - OBS.: access this link below  to configure your email sender - [ SandGrid ](https://app.sendgrid.com/)

# Mongo DB URI: to configure the followings environment variables:
    MONGO_DB_URI

# Run docker compose file ( docker-compose up ) in root dir of project to inicialize the Rabbitmq
- dir: /user_application/docker-compose.yml
```bash
$ docker-compose up 
```

- OBS.: once rabbitmq inicialized you can acces in http://localhost:15672/
   The credentials are in environment file (.development.env )

## Swagger documentation
[ SWAGGER ](http://localhost:3001/api#/)

## Steps to Run Application
    
# Add depencies
```bash
$ yarn
```

# To start the project
 ```bash
$ yarn start
```