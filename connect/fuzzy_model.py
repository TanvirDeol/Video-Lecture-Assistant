""" Model that performs fuzzy search on a block of text.

Given a list of query phrases and a list of sentences, the
program provides the N most similar pieces of text for each 
query. 
""" 
from sklearn.metrics.pairwise import cosine_similarity
import tensorflow_hub as hub
import pandas as pd
import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi


def convert_link(url):
    index = url.find("=")
    return url[index+1:]

# gets transcript of a youtube video given a link
def get_transcript(url):
    url = convert_link(url)
    transcript  = YouTubeTranscriptApi.get_transcript(url)
    sentences = []
    timeframes = []
    for lines in transcript:
        sentences.append(lines["text"])
        timeframes.append(lines["start"])
    #print(sentences)
    return [sentences, timeframes]



class ModelEmbedding:
    """ Provides embeddings for query phrases and sentences
    using the Universal Sentence Encoder model.

    Attributes:
        embed: Static class variable for embedder model
    """
    embed = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

    @staticmethod
    def get_embeddings(queries,sentences):
        """Gets embeddings for user queries and sentences 
        using Universal Sentence Encoder model.

        Args:
            queries: List of query phrases provided by user
            sentences: List of sentences originating from a text block

        Returns: 
            A list of two elements, that contains the embeddings
            for the queries and sentences, respectively.
        """
        query_embeddings = ModelEmbedding.embed(queries)
        sentence_embeddings = ModelEmbedding.embed(sentences)
        return [query_embeddings,sentence_embeddings]


class SimRanking:
    """Provides an ordered list of ranking, given a 
    list of various similarity scores.
    """
    @staticmethod
    def top_n_matrix(similarity_matrix, N):
        """Given a matrix of similarity scores, returns a matrix
        containing ordered list of top N scores for each query.
        Each ranking provides an index to refer to the exact 
        sentence that was being compared.

        Args:
            similarity_matrix: 2D matrix of similarity scores,
                containing a list of similarity scores for each
                user query.
            N: Number of scores to return for each query.

        Returns:
            A list of lists of pairs of the form [score,index], where score
            is the similarity score and index is the index of the sentence
            in the list, that is being compared.
        """
        res =[]
        for sim_list in similarity_matrix:
            tmp = []
            for i in range(len(sim_list)):
                tmp.append([sim_list[i],i])
            tmp.sort(reverse=True)
            res.append(tmp[:N])
        return res

    @staticmethod
    def cos_sim(query_embeddings,sentence_embeddings):
        """Computes pairwise cosine similarity given embeddings
        for user queries and sentences.

        Args:
            query_embeddings: Embeddings for user queries
            sentence_embeddings: Embeddings for sentences

        Returns:
            A 2D similarity matrix, which has the similarity 
            scores for every pair of induvidual query and sentence.
        """
        similarity_matrix = cosine_similarity(query_embeddings,sentence_embeddings)
        return similarity_matrix


def show_results(rs,queries,sentences,timeframes):
    """Returns a dictionary with each mapping from query 
    to its ith most similar sentence. This is slow and 
    should only be used for debugging and testing.

    Args:
        rs: 2D matrix containing ordered list of top N
            similarity scores for each query.
        queries: List of user queries.
        sentences: List of sentences
    
    Returns:
        A dict where queries are the keys, and every 
        key maps to a list of sentences. The list of sentences
        are ordered by cosine similarity to the corresponding query.
    """
    d = {}
    for i in range(len(rs)):
        tmp = []
        for j in range(len(rs[i])):
            tmp.append([sentences[rs[i][j][1]],timeframes[rs[i][j][1]]])
        d[queries[i]] = tmp
    return d

# takes queries and sentences and returns dataframe consisting of results where each query is a key
def get_results(sent, query, N):
    [query_embeddings,sentence_embeddings] = ModelEmbedding.get_embeddings(query,sent)
    sim_matrix = SimRanking.cos_sim(query_embeddings,sentence_embeddings)
    res = SimRanking.top_n_matrix(sim_matrix,N)
    df = pd.DataFrame.from_dict(show_results(res,query,sent))
    #df.to_csv("res.csv")
    return df


def search(link,query):
    [sent,timeframes] = get_transcript(link) 
    query = query.split(",")
    [query_embeddings,sentence_embeddings] = ModelEmbedding.get_embeddings(query,sent)
    sim_matrix = SimRanking.cos_sim(query_embeddings,sentence_embeddings)
    res = SimRanking.top_n_matrix(sim_matrix,10)
    df = pd.DataFrame.from_dict(show_results(res,query,sent,timeframes))
    print(json.dumps(json.loads(df.to_json())))
    return json.dumps(json.loads(df.to_json()))

#link = sys.argv[1]
#query = sys.argv[2]
#link = "https://www.youtube.com/watch?v=x9UEDRbLhJE"
#query = "request, react, calls"
#data = open("data.txt","r").read()
#print(data)
#sent  = sent_tokenize(data)
#print(sent)
#print(link,query)


#with open('data.json', 'w', encoding='utf-8') as f:
 #   json.dump(json.loads(df.to_json()),f,indent=4,ensure_ascii=False)
