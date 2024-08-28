# Mobilearn

CCDS24-0181 Online Life-Long Learning App With Personalized Recommendation

## Get Started

### Setup Local Environment

Install Miniconda

Create conda environment with Python 3.9
> conda create -n mobilearn python=3.9  

Activate conda environment before installing libraries
> conda activate mobilearn

## Want to run Frontend?

Download npm through NodeJS

Download requirements in package-lock.json
> npm ci  

Start Expo
> npx expo start

## Want to run Backend?

Download requirements
> pip install -r requirements.txt

Run app.py

## Want to Deploy?

### Build .apk and .dmg files

Download EAS cli
> cd frontend && npm install -g eas-cli  
> eas login  
> eas build:configure  
> eas build --platform all  

> eas build -p android --profile preview  # Generates .apk  
> eas build -p ios --profile preview  # Generates .tar.gz


### Deploy APIs

"""Work in Progress"""