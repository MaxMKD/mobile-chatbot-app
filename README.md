# Mobile ChatBot Application

This project is a simple chatbot application that allows users to interact with an AI chatbot powered by OpenAI's GPT model. The chatbot runs on a web-based interface where users can ask questions, see AI responses, and manage their chat history.

## Features

- **User Authentication**: Only authenticated users can access the chat interface.
- **AI Chatbot**: Powered by OpenAI's GPT-3.5-turbo model.
- **History Management**: Users can view and manage their chat history (delete individual messages).
- **Responsive Interface**: The application has a mobile-first design for easy usage on smartphones and tablets.
- **Clipboard Integration**: Users can copy the AI responses directly to the clipboard.

## Tech Stack

- **Node.js** - Backend
- **Express.js** - Web framework
- **OpenAI GPT-3.5** - AI chatbot engine
- **SQLite** - Database to store chat history
- **HTML/CSS** - Frontend
- **JavaScript** - For interactivity (fetch API, DOM manipulation)

## Installation

### Prerequisites

- **Node.js** (v16.x or higher)
- **npm** (Node Package Manager)

### Clone the repository

```bash
git clone https://github.com/your-username/mobile-chatbot-app.git
cd mobile-chatbot-app
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root of the project with the following environment variables:

```
SESSION_SECRET=your-session-secret
OPENAI_API_KEY=your-openai-api-key
AUTH_USERNAME=your-username
AUTH_PASSWORD=your-password
PORT=your-port
```

- `SESSION_SECRET`: A secret key used to sign the session ID cookie.
- `OPENAI_API_KEY`: Your API key from OpenAI to use the GPT model.
- `AUTH_USERNAME` & `AUTH_PASSWORD`: Credentials to authenticate users.
- `PORT`: The port number on which the server will run. If not specified, the server will default to port `3000`.

### Start the Application

```bash
npm start
```

This will start the server on `http://localhost:3000`.

## Usage

1. **Login**: Visit `http://localhost:3000` to log in. Use the username and password defined in your `.env` file.
2. **Chat with the Bot**: Once logged in, you can send messages to the AI chatbot and receive responses.
3. **View History**: Your previous conversations with the chatbot are stored and displayed on the page.
4. **Delete Messages**: You can delete individual chat messages from the history.
5. **Sign Out**: Click the sign-out button to log out of the application.

## File Structure

```
mobile-chatbot-app/
│
├── public/
│   ├── index.html
│   ├── login.html
│   └── styles.css
│
├── .env
├── package.json
├── server.js
└── README.md
```

## Contributing

If you'd like to contribute to this project, feel free to open a pull request with your changes.

1. Fork the repository.
2. Clone your forked repository locally.
3. Create a new branch for your changes.
4. Make your changes and commit them.
5. Push your changes to your forked repository.
6. Create a pull request with a description of your changes.

## License

This project is licensed under the ISC License.