import pandas as pd
import numpy as np
import re
from rapidfuzz import fuzz
from ast import literal_eval

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

csv_file_path = 'movie_data\Data\FCinepulse.csv'
movie = pd.read_csv(csv_file_path)

movie['genre'] = movie['genre'].apply(literal_eval)
movie['spoken_language'] = movie['spoken_language'].apply(literal_eval)
movie['production_company'] = movie['production_company'].apply(literal_eval)
movie['Cast'] = movie['Cast'].apply(literal_eval)
movie['Director'] = movie['Director'].apply(literal_eval)
movie['release_date'] = pd.to_datetime(movie['release_date'], errors='raise',format='mixed')
movie['release_date'] = movie['release_date'].dt.date


movie = movie.where(pd.notna(movie), None)
movie_card_data = movie[['title', 'rating','id','release_date','poster','genre','origin_country']]


def similarity_score(movie_recomm):
  movie_recomm['combine_info'] = movie_recomm.apply(lambda x: (x['desc'] if isinstance(x['desc'], str) else "") + " " + (" ".join([d['actor'] for d in x['Cast'][:3]]) +" ") * 2 +(" ".join(x['production_company']) + " ") * 2 +(" ".join(x['Director']) + " ") * 3 + (" ".join(x['spoken_language']) + " ") * 3 + " ".join(x['genre']),axis=1)
  tfidf = TfidfVectorizer(stop_words='english')
  X = tfidf.fit_transform(movie_recomm['combine_info'])
  similarity = cosine_similarity(X, X)
  return similarity

# similarity_score()

def get_sequels(movie_data,id):
  movie_title = movie_data[movie_data['id']==id]['title'].values[0]
  base_title = re.split(r'[:\-\.\|\ ]', movie_title)[0].strip()
  movie_director = " ".join(movie_data[movie_data['id']==id]['Director'].values[0])
  movie_company = " ".join(movie_data[movie_data['id']==id]['production_company'].values[0])
  combine_info =  movie_director + " " + movie_company

  same_origin_movies = movie_data[movie_data['id'] != id].copy()
  same_origin_movies['partial_score1'] = same_origin_movies.apply(lambda x: fuzz.token_set_ratio(movie_title,x['title']),axis=1)
  same_origin_movies['partial_score2'] = same_origin_movies.apply(lambda x: fuzz.token_set_ratio(combine_info," ".join(x['Director'])+ " " + " ".join(x['production_company'])),axis=1)
  same_origin_movies['title_boost'] = same_origin_movies.apply(lambda x: 100 if x['title'].startswith(base_title) else 0,axis=1)
  same_origin_movies['partial_score'] = (same_origin_movies['partial_score1']*0.4) + (same_origin_movies['partial_score2']*0.6) + same_origin_movies['title_boost']
  possible_sequel = same_origin_movies.sort_values(by='partial_score', ascending=False)[:5]
  return possible_sequel.sort_values(by='partial_score', ascending=False)['id'].tolist()

def similar_recommendations(movie_data,id):
  temp = movie_data.copy()
  temp = temp.reset_index()
  movie_id = temp[temp['id']==id].index[0]
  similarity = similarity_score(temp)
  movies_similarity = np.array(similarity[movie_id])
  movies_similarity[movie_id] = -1
  sorted_index = movies_similarity.argsort()[::-1]
  top_index = sorted_index[:15]
  return temp.iloc[top_index]['id'].tolist()


def get_recommendations(id):
  movie_recomm = movie.copy()
  movie_recomm['is_animation'] = movie_recomm['genre'].apply(lambda x: 'yes' if 'Animation' in x else 'no')
  movie_country = movie_recomm[movie_recomm['id']==id]['origin_country'].values[0]

  if movie_recomm[movie_recomm['origin_country'] == movie_country].shape[0]>30:
    movie_recomm = movie_recomm[movie_recomm['origin_country'] == movie_country]
  else:
    pass

  if movie_recomm[movie_recomm['id']==id]['is_animation'].values[0] == 'yes':
    recomm_data = movie_recomm[movie_recomm['is_animation']=='yes']
  else:
    recomm_data = movie_recomm[movie_recomm['is_animation']=='no']

  seq = get_sequels(recomm_data,id)
  sim = similar_recommendations(recomm_data,id)

  filtered_list= [item for item in sim if item not in seq]
  result = seq + filtered_list[:10]

  recommended_movies = movie_card_data.set_index('id').loc[result].reset_index()
  rec_movie = recommended_movies.to_dict(orient='records')
  return rec_movie
