# MobiLearn - Online Life-Long Learning App with Personalized Recommendation

Welcome to  **MobiLearn** , an online platform designed to empower learners by providing personalized learning experiences. Whether you're pursuing professional development or personal growth, LifeLearn uses advanced AI algorithms to recommend courses that best suit your learning style, progress, and goals.

## Features

- Diverse Course Categories: Explore a wide range of courses in various domains including technology, business, arts, sciences, and more.
- Personalized Recommendations: LifeLearn leverages a Two-Tower model to analyze your learning history, preferences, and goals to offer personalized course suggestions.
- Community Support: Engage with a community of learners with an in-built chat feature.
- Language Support: Not a native english speaker? Our application currently supports other languages like Mandarin (other language support planned in the future!).
- Instructor and Administrator Features: Statistics are made visible to both the providers of courses as well as the maintainers for full transparency.

## Project Structure

### Root Directory

```

.

├── README.md                # Project documentation

├── LICENSE                  # Project license

├── .gitignore               # Git ignore file

├── .project                 # SEO file

├── frontend/                # React Native Expo application

└── backend/                 # Flask backend dockerised server served on AWS

```

### Frontend (React Native Expo)

```

frontend/

├── app.json                 # Expo configuration

├── babel.config.js          # Babel configuration

├── tsconfig.json            # TypeScript configuration

├── package.json             # Node.js dependencies

├── assets/                  # Static assets (images, fonts, etc.)

│   ├── fonts/               # Custom fonts

│   ├── images/              # Image assets

│   └── documents/           # PDF and other documents

├── app/                     # Source code

│   ├── hooks/               # Custom React hooks

│   ├── components/          # React components

│   ├── constants/           # App constants

│   └── locales/             # Language translation files

└── maestro/                 # End-to-end tests using Maestro

```

### Backend (Python Flask)

```

backend/

├── app.py                   # Main Flask application

├── requirements.txt         # Python dependencies

├── tests/                   # Unit test files

│   ├── __init__.py

│   └── test_*.py            # Test files

└── endpoints/               # API resources

    ├── __init__.py          # API initialization

├── models/                  # Database models

    │   ├── __init__.py

    │   └── user.py          # User model example

├── services/                # Business logic services

    │   ├── __init__.py

    │   └── user_service.py  # User service example

    └── utils/               # Utility functions

        ├── __init__.py

        └── helpers.py       # Helper functions

```


## Contribution

We welcome contributions to MobiLearn! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature-name).
3. Commit your changes (git commit -m 'Add feature').
4. Push to the branch (git push origin feature-name).
5. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or support, please reach out to the MobiLearn team at ZhangJ@ntu.edu.sg
