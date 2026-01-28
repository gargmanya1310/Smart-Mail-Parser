# Email Parser

This project aims to make use of **Gemini-3.5** turbo which is an LLM provided by Google and ease the process of categorizing mails into 3 categories namely:- Interested, Not Interested, More Information.

## Things to implement

After authentication implement BullMQ to automate all the steps required and use a queue to send emails. Setup a task scheduler to periodically listen if there are more email enqueue them. Could not implement because of Redis issues.

## How does it work?

Under the hood it utilises Oauth2Client from GoogleAPIs for authentication and session management.
Once authorised, you can get all the mails at this endpoint:-

```
http://localhost:3001/api/auth/google/get-mails
```

The project parses these mails extracting important information like Body, id, threadId, sender, snippet.

A Class- **EmailParser** has been implemented which stores all the information in memory while the server runs.

Next is to get labels and categorize these emails using Gemini. Querying this endpoint sends the body to the model and extracts reply and label assigning it to our class.

```
http://localhost:3001/api/gemini/get-result
```

Finally, using the endpoint below we can send all the replies which appends it to the existing thread for the user logged in and sends corresponding mail to the sender.

```
http://localhost:3001/api/auth/google/send-reply
```

#### Tech-stack and Libraries

1. Typescript
2. Express
3. GoogleAPIs
4. Google-generative-AIc

#### To set-up locally

1. Clone the project

```
git clone https://github.com/gargmanya1310/Smart-Mail-Parser.git
```

2. Create .env file with following fields

```
CLIENT_ID="YOUR_CLIENT_ID"
CLIENT_SECRET="YOUR_CLIENT_SECRET"
REDIRECT_URL="YOUR_REDIRECT_URL"
GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
```

Head over to google create a project in google apis console setup client, get the keys replace here and also setup a redirect URL. More information here [Client-ID setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid)

3. Query the endpoint once to get your authentication url

```
localhost:3001/api/auth/google
```

Save this as this is the link that we would open to authenticate our user

4. Head over to the auth URL and authenticate the google account providing necessary permissions for email.

5. Run the command

```
npm start
```

6. Query the endpoint for getting all mails, generating labels and reply, and send them.
