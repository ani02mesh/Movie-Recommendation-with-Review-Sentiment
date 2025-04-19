
# 🎬 Movie Recommender System with Review Sentiment Analysis

This is a full-stack web application that recommends movies based on user selection and analyzes their review sentiment in real-time. It combines a content-based recommendation engine with a deep learning model for NLP.
The project is built using **React.js** for the frontend and **Django** for the backend, with **TensorFlow** powering the LSTM-based sentiment analysis.

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Django, Django REST Framework
- **ML/NLP:** LSTM (TensorFlow) for review sentiment classification


## 🔑 Features

- **Movie Recommendations** — Choose a movie and get a list of similar movies using a Rule-based + Content-based algorithm.
- **User Reviews** — Write and submit your own movie reviews.
- **Sentiment Analysis** — Reviews are processed in real-time and tagged as **Positive (green)** or **Negative (red)** based on the model’s prediction.
- **Interactive UI** — Search, filter, and explore movies through a responsive and dynamic interface.


## Run Locally

 • Clone the project

```bash
  git clone https://github.com/ani02mesh/Movie-Recommendation-with-Review-Sentiment
```
 • Go to the project directory

```bash
  cd recommender
```
 • Backend Setup
```bash
cd movie_backend
python -m venv venv                # Create virtual environment
source venv/bin/activate           # On Windows: venv\Scripts\activate
pip install -r requirements.txt    # Install dependencies
python manage.py migrate           # Run database migrations
python manage.py runserver         # Runs Backend
```
The backend will run at: http://127.0.0.1:8000

 • Frontend Setup (Open a new terminal)

```bash
cd movie_front
npm install                        # Install dependencies
npm start                          # Start the React development server
```
The frontend will run at: http://localhost:3000




## 📌 Notes
 • Ensure that the frontend calls are directed to http://127.0.0.1:8000 (Django Backend server) while testing locally.

 • The sentiment analysis model is loaded and used in the backend for live prediction.

  • Library like rapidfuzz, sklearn and nltk might need to install using pip command within the virtual environment.
## 🚀 About Me
Machine Learning and Artificial Intelligence enthusiast


## 🔗 Links
[![Github](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/ani02mesh)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/animesh-shedge)


