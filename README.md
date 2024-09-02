# Mobilearn

CCDS24-0181 Online Life-Long Learning App With Personalized Recommendation

## Get Started

### Setup Local Environment

1. Install Miniconda
2. Create conda environment with Python 3.9

```bash
conda create -n mobilearn python=3.9
```

3. Activate conda environment before installing libraries

```bash
conda activate mobilearn
```

## Want to run Frontend?

1. Download npm through NodeJS
2. Download requirements in package-lock.json

```bash
npm ci
```

3. Start Expo

```bash
npx expo start
```

## Want to run Backend?

1. Download requirements

```bash
pip install -r requirements.txt
```

2. Run app.py

## Want to Deploy?

### Build .apk and .dmg files

1. Download EAS cli

```bash
cd frontend && npm install -g eas-cli  
eas login  
eas build:configure  
eas build -p android --profile local  # Generates .apk  
eas build -p ios --profile local  # Generates .tar.gz
```

### Deploy APIs

WIP
