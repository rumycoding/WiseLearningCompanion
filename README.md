# Wise Learning Companion

This AI-powered learning companion is specifically designed to help seniors learn Chinese characters in an intuitive, patient, and engaging way.

The frontend is forked from [chatbot-ui](https://github.com/ChristophHandschuh/chatbot-ui.git), credit to

- [Leon Binder](https://github.com/LeonBinder)
- [Christoph Handschuh](https://github.com/ChristophHandschuh)
- [CameliaK](https://github.com/CameliaK) – Implemented web search and integrated it into the LLM prompt)

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/rumycoding/WiseLearningCompanion.git
cd WiseLearningCompanion
```

2. Install dependencies

```bash
npm i
```

3. Start the development server

```bash
npm run dev
```

## Backend

The backend is written in rust. You will need to install [rust](https://www.rust-lang.org/tools/install). To use the test mode:

1. Navigate to the backend directory
2. Add your Azure Credential in .env

```bash
cp .env.example .env

cargo run
```

## License

This project is licensed under the Apache License 2.0. Please note that some components were adapted from Vercel's open source AI Chatbot project.
