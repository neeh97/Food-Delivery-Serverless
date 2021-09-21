import copy
import json
from uuid import uuid4
from fastapi import FastAPI, File
from fastapi.middleware.cors import CORSMiddleware
import boto3
from pydantic import BaseModel
from typing import Optional
import requests

s3 = boto3.client('s3', region_name='us-east-1')
comprehend = boto3.client('comprehend', region_name='us-east-1')
dynamo_db = boto3.client('dynamodb', region_name='us-east-1')

application = FastAPI()

application.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MENU_BUCKET = 'g9-menu-bucket'
NE_TABLE = 'named_entities'
KP_TABLE = 'key_phrases'
LANGUAGE_CODE = 'en'
WORD_CLOUD_API = "https://textvis-word-cloud-v1.p.rapidapi.com/v1/textToCloud"


def put_or_update_frequencies(table, key, _item):
    value = dynamo_db.get_item(TableName=table, Key=key)
    if 'Item' in value:
        count = int(value['Item']['count']['N'])
        dynamo_db.update_item(
            TableName=table, Key=key,
            AttributeUpdates={'count': {'Value': {'N': str(count + 1)}}})
    else:
        item = copy.deepcopy(_item)
        item['count'] = {'N': '1'}
        dynamo_db.put_item(TableName=table, Item=item)


def process_named_entities(named_entities):
    for named_entity in named_entities:
        key = {
            'entity': {
                'S': named_entity['Text']
            }
        }
        _item = {
            'entity': {
                'S': named_entity['Text']
            },
            'type': {
                'S': named_entity['Type']
            }
        }
        put_or_update_frequencies(NE_TABLE, key, _item)


def process_key_phrases(key_phrases):
    for key_phrase in key_phrases:
        key = {
            'phrase': {
                'S': key_phrase['Text']
            }
        }
        put_or_update_frequencies(KP_TABLE, key, key)


@application.post("/upload_menu")
def upload_menu(file: bytes = File(...)):
    content = file.decode()
    file_name = 'recipe_{}'.format(str(uuid4()))
    s3.put_object(Bucket=MENU_BUCKET, Key=file_name, Body=content)
    named_entities = comprehend.detect_entities(
        Text=content, LanguageCode=LANGUAGE_CODE)['Entities']
    key_phrases = comprehend.detect_key_phrases(
        Text=content, LanguageCode=LANGUAGE_CODE)['KeyPhrases']
    process_named_entities(named_entities)
    process_key_phrases(key_phrases)
    return {"message": 'File uploaded'}


class Feedback(BaseModel):
    review: str
    customer: Optional[str] = None


@application.post("/process/feedback")
def analyse_feedback(feedback: Feedback):
    named_entities = comprehend.detect_entities(
        Text=feedback.review, LanguageCode=LANGUAGE_CODE)['Entities']
    key_phrases = comprehend.detect_key_phrases(
        Text=feedback.review, LanguageCode=LANGUAGE_CODE)['KeyPhrases']
    process_named_entities(named_entities)
    process_key_phrases(key_phrases)
    return {"message": "Feedback processed"}


def get_word_cloud_content():
    named_entities_dynamo_response = dynamo_db.scan(TableName=NE_TABLE)
    named_entities_string = None
    if 'Items' in named_entities_dynamo_response:
        named_entities_list = map(
            lambda entity: entity['entity']['S'], named_entities_dynamo_response['Items'])
        named_entities_string = ', '.join(named_entities_list)
    return named_entities_string


@application.get("/fetch/word_cloud")
def fetch_word_cloud():
    payload = {
        'text': get_word_cloud_content(),
        'language': LANGUAGE_CODE,
        'font': 'Tahoma',
        'use_stopwords': False,
        'uppercase': False
    }
    headers = {
        'content-type': "application/json",
        'x-rapidapi-key': "a9379aa7b2mshc272c37706d5d11p1e740djsnc8634437f509",
        'x-rapidapi-host': "textvis-word-cloud-v1.p.rapidapi.com"
    }
    response = requests.post(WORD_CLOUD_API, data=json.dumps(payload), headers=headers)
    return {"image_url": response.text}


@application.get("/health_check")
def health_check():
    return {"message": "The application is running fine"}
