from django.shortcuts import render
import pandas as pd
import numpy as np
from ast import literal_eval
import json
import time
import os
from django.http import JsonResponse
from rest_framework.response import Response

from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle

import re
import emoji
from nltk.corpus import stopwords

from .Recommender import get_recommendations
# from rest_framework.renderers import JSONRenderer

csv_file_path = 'movie_data\Data\FCinepulse.csv'
review_file_path = 'movie_data\Data\F_review.csv'

model = load_model('movie_data\Asset\Review_sentiment3.keras')
with open('movie_data\Asset\Tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)

movie = pd.read_csv(csv_file_path)
review = pd.read_csv(review_file_path)

stop_words = set(stopwords.words('english'))

def remove_stopword(text):
    return " ".join([word for word in text.split() if word not in stop_words])

contractions = {
    "ain't": "am not",
    "aren't": "are not",
    "can't": "can not",
    "can't've": "can not have",
    "'cause": "because",
    "could've": "could have",
    "couldn't": "could not",
    "couldn't've": "could not have",
    "didn't": "did not",
    "doesn't": "does not",
    "don't": "do not",
    "hadn't": "had not",
    "hadn't've": "had not have",
    "hasn't": "has not",
    "haven't": "have not",
    "he'd": "he would",
    "he'd've": "he would have",
    "he'll": "he will",
    "he'll've": "he will have",
    "he's": "he is",
    "how'd": "how did",
    "how'd'y": "how do you",
    "how'll": "how will",
    "how's": "how is",
    "i'd": "i would",
    "i'd've": "i would have",
    "i'll": "i will",
    "i'll've": "i will have",
    "i'm": "i am",
    "i've": "i have",
    "isn't": "is not",
    "it'd": "it would",
    "it'd've": "it would have",
    "it'll": "it will",
    "it'll've": "it will have",
    "it's": "it is",
    "let's": "let us",
    "ma'am": "madam",
    "mayn't": "may not",
    "might've": "might have",
    "mightn't": "might not",
    "mightn't've": "might not have",
    "must've": "must have",
    "mustn't": "must not",
    "mustn't've": "must not have",
    "needn't": "need not",
    "needn't've": "need not have",
    "o'clock": "of the clock",
    "oughtn't": "ought not",
    "oughtn't've": "ought not have",
    "shan't": "shall not",
    "sha'n't": "shall not",
    "shan't've": "shall not have",
    "she'd": "she would",
    "she'd've": "she would have",
    "she'll": "she will",
    "she'll've": "she will have",
    "she's": "she is",
    "should've": "should have",
    "shouldn't": "should not",
    "shouldn't've": "should not have",
    "so've": "so have",
    "so's": "so as",
    "that'd": "that would",
    "that'd've": "that would have",
    "that's": "that is",
    "there'd": "there would",
    "there'd've": "there would have",
    "there's": "there is",
    "they'd": "they would",
    "they'd've": "they would have",
    "they'll": "they will",
    "they'll've": "they will have",
    "they're": "they are",
    "they've": "they have",
    "to've": "to have",
    "wasn't": "was not",
    "we'd": "we would",
    "we'd've": "we would have",
    "we'll": "we will",
    "we'll've": "we will have",
    "we're": "we are",
    "we've": "we have",
    "weren't": "were not",
    "what'll": "what will",
    "what'll've": "what will have",
    "what're": "what are",
    "what's": "what is",
    "what've": "what have",
    "when's": "when is",
    "when've": "when have",
    "where'd": "where did",
    "where's": "where is",
    "where've": "where have",
    "who'll": "who will",
    "who'll've": "who will have",
    "who's": "who is",
    "who've": "who have",
    "why's": "why is",
    "why've": "why have",
    "will've": "will have",
    "won't": "will not",
    "won't've": "will not have",
    "would've": "would have",
    "wouldn't": "would not",
    "wouldn't've": "would not have",
    "y'all": "you all",
    "y'all'd": "you all would",
    "y'all'd've": "you all would have",
    "y'all're": "you all are",
    "y'all've": "you all have",
    "you'd": "you would",
    "you'd've": "you would have",
    "you'll": "you will",
    "you'll've": "you will have",
    "you're": "you are",
    "you've": "you have",
    "'ve": " have",
    "'ll": " will"
    }

def decontract(text):
  decontracted = []
  for word in text.split():
    if word in contractions:
      word = contractions[word]
    decontracted.append(word)
  return ' '.join(decontracted)

def cleaning(text):
  text = text.lower()             # lower casing
  text = re.sub('<.*?>','',text)   #remove HTML Tags
  text = emoji.demojize(text)         # remove emojis
  text = re.sub('https?://\S*|www\.\S*','',text)   # remove URL's
  text = decontract(text)               # decontraction
  text = re.sub(r"'\w+", "", text)        # remove any letter after '
  text = re.sub(r"\d+", " ", text)        # remove digits [0-9]
  text = re.sub(r'\b\*\b', '', re.sub(r'(\w)\*(\w)', r'\1\2', text))   # remove * unless its inbetween letters
  text = re.sub(r'[^\x00-\x7F]+', '', text)     # remove ASCII
  text = re.sub(r'[^a-z\s]', ' ', text)         # remove punctuations
  text = re.sub(r'\s+', ' ', text).strip()      # remove space
  return text

def refresh_global_review():
    global review  # Use the global variable
    try:
        review = pd.read_csv(review_file_path, engine='python')  # Force reloading
    except Exception as e:
        print(f"Error reading CSV: {e}")


def convert_votes(vote):
    if isinstance(vote, str):  
        if vote.endswith("K"):
            return float(vote[:-1]) * 1000
        elif vote.endswith("M"):
            return float(vote[:-1]) * 1000000
    return float(vote) 

movie["vote_count1"] = movie["vote_count"].apply(convert_votes)

movie['genre'] = movie['genre'].apply(literal_eval)
movie['spoken_language'] = movie['spoken_language'].apply(literal_eval)
movie['production_company'] = movie['production_company'].apply(literal_eval)
movie['Cast'] = movie['Cast'].apply(literal_eval)
movie['Director'] = movie['Director'].apply(literal_eval)
movie['release_date'] = pd.to_datetime(movie['release_date'], errors='raise',format='mixed')
movie['release_date'] = movie['release_date'].dt.date


movie = movie.where(pd.notna(movie), None)
movie_card_data = movie[['title', 'rating','id','release_date','poster','genre','origin_country','vote_count1']]
other = ['Sweden','Mexico','New Zealand','Czech Republic','Iran','Indonesia','West Germany','Argentina','Taiwan',
            'Hungary','Poland','South Africa','Norway','Soviet Union','United Arab Emirates','Austria','Thailand',
            'Russia','Finland','Turkey','Greece','Bulgaria','Brazil','Belgium','Switzerland','Lebanon','Croatia',
            'Chile','Egypt','Saint Kitts and Nevis','Nepal','Netherlands','Armenia','Bangladesh','Pakistan']

def all_movie_data(request):
    random_movies = movie_card_data.sample(n=100,random_state=15)
    random_movies = random_movies.to_dict(orient='records')
    return JsonResponse({'all': random_movies},safe=False)
# Create your views here

def card_movie_data(request):
    countt = request.GET.get('movie_count', 20)

    top_movie = movie_card_data.sort_values('rating',ascending=False)
    top_movie = top_movie[top_movie['vote_count1']>500000][:int(countt)]
    high_rated = top_movie.to_dict(orient='records')

    recent_movie = movie_card_data.sort_values('release_date',ascending=False)[:int(countt)]
    recent = recent_movie.to_dict(orient='records')

    biography_movie = movie_card_data[movie['genre'].apply(lambda x: 'Biography' in x)]
    biography_movie = biography_movie[biography_movie['vote_count1']>40000][:int(countt)]
    biography = biography_movie.to_dict(orient='records')

    animation_movie = movie_card_data[movie['genre'].apply(lambda x: 'Animation' in x)]
    animation_movie = animation_movie[animation_movie['vote_count1']>100000][:int(countt)]
    animation = animation_movie.to_dict(orient='records')

    indian_movie = movie_card_data[movie['origin_country']=='India']
    indian_movie = indian_movie.sort_values('vote_count1',ascending=False)[:int(countt)]
    indian = indian_movie.to_dict(orient='records')
    
   # return JsonResponse(high_rated,safe=False)
    return JsonResponse({'df1': high_rated, 'df2': biography, 'df3':recent, 'df4':animation, 'df5':indian},safe=False)


def search_receive_data(request):
    if request.method == "GET":
        name = request.GET.get("name")  # Extract "name" from query param
        if name.startswith('"') and name.endswith('"'):
            name = name[1:-1]  

        filtered_movies = movie_card_data[movie_card_data['title'].str.lower().str.startswith(name.lower(), na=False)]
        
        if not filtered_movies.empty:
                search_movie_list = filtered_movies.to_dict(orient='records')
                return JsonResponse({"search_movies": search_movie_list})  
        else:
                return JsonResponse({"error": "No movies found"})  
    return JsonResponse({"error": "Invalid request method"}, status=405)


def specific_movie_data(request):
    if request.method == "GET":
        movie_id = request.GET.get("id")
        selected_movie = movie[movie['id']==movie_id]
        selected_movie_data = selected_movie.to_dict(orient='records')

        random_review = review[review['id']==movie_id]
        random_review = random_review.to_dict(orient='records')

        rec = get_recommendations(movie_id)
       # recommended_movies = movie_card_data[movie['id'].isin(recommend_movie_id)]
       # rec_movie = recommended_movies.to_dict(orient='records')

        return JsonResponse({"selected_movie": selected_movie_data, "selected_reviews": random_review, "recommended": rec}) 


def  filter_movie_data(request):
    min_rating = float(request.GET.get('min_rating', 0))
    max_rating = float(request.GET.get('max_rating', 10))
    min_year = int(request.GET.get('min_year', 1930))
    max_year = int(request.GET.get('max_year', 2024))
    filter_genre =  request.GET.getlist('filter_genre')
    filter_country =  request.GET.getlist('filter_country')

    filtered_movie_data = movie_card_data[(movie_card_data['rating'] >= min_rating) & (movie_card_data['rating'] <= max_rating)]
    filtered_movie_data = filtered_movie_data[(filtered_movie_data['release_date'].apply(lambda x: x.year if pd.notnull(x) else None) >= min_year) & (filtered_movie_data['release_date'].apply(lambda x: x.year if pd.notnull(x) else None) <= max_year)]   

    if filter_genre:
        filtered_movie_data = filtered_movie_data[filtered_movie_data['genre'].apply(lambda genres: any(g in genres for g in filter_genre))]
    
    if filter_country:
        if len(filter_country)==1 and 'other' in filter_country:
             filtered_movie_data = filtered_movie_data[filtered_movie_data['origin_country'].isin(other)]
        elif len(filter_country)>1 and 'other' in filter_country:
             filter_country = filter_country.remove("other")
             other_movie_data = filtered_movie_data[filtered_movie_data['origin_country'].isin(other)]
             filter_movie_data = filtered_movie_data[filtered_movie_data['origin_country'].isin(filter_country)]
             filtered_movie_data = pd.concat([filter_movie_data,other_movie_data])
        else:
             filtered_movie_data = filtered_movie_data[filtered_movie_data['origin_country'].isin(filter_country)]
    
    filter_movie = filtered_movie_data.to_dict(orient='records')
    return JsonResponse({"filter_movies": filter_movie})

def sentiment(text):
  text = cleaning(text)
  input = pad_sequences(tokenizer.texts_to_sequences([text]),maxlen=200)
  pred = model.predict(input)
  prediction = 1 if pred[0][0]>0.5 else 0
  return int(prediction)

def addreview(request):
     if request.method == "GET":
          movie_id = request.GET.get("id")
          review_summary = request.GET.get("summary")
          review = request.GET.get("review")
          new_review = str(review_summary)+ " " + str(review)
          rating = sentiment(new_review)
          new_row = {'column1': movie_id, 'column2': rating,'column3': review_summary, 'column4': review}
          df_new = pd.DataFrame([new_row])
          with open(review_file_path, 'a') as f:
            df_new.to_csv(f, mode='a', header=False, index=False)
            f.flush()
            os.fsync(f.fileno())
          refresh_global_review()
          time.sleep(1)
          rreview = pd.read_csv(review_file_path)
          new_reviews = rreview[rreview['id']==movie_id]
          new_reviews = new_reviews.to_dict(orient='records')
          return JsonResponse({"new_reviews": new_reviews}) 