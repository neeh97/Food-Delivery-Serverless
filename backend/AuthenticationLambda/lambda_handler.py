import json
import boto3
from mysql.connector import connect
from mysql.connector import IntegrityError
import os

s3 = boto3.client('s3')

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_DATABASE = os.getenv('DB_DATABASE')


INSERT_USER_QUERY = ('INSERT INTO users(name, email, question, answer, type)'
                     'VALUES (%(name)s, %(email)s, %(question)s, %(answer)s, %(type)s);')
GET_USER_QUESTION_QUERY = 'SELECT id, email, type, question, answer FROM users WHERE email=%s'


REGISTER_REQUIRED_FIELDS = {'name', 'email', 'question', 'answer', 'type'}
MFA_REQUIRED_FIELDS = {'email', 'answer'}


def get_connection():
    return connect(
        host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_DATABASE)


def fetch_one(query, params):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            row = cursor.fetchone()
    return row


def register(body):
    try:
        if REGISTER_REQUIRED_FIELDS != set(body.keys()):
            raise ValueError('Required fields missing {}'.format(set(body.keys())))
        with get_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute(INSERT_USER_QUERY, body)
                connection.commit()
        status = 200
        message = 'Successfully added the user details.'
    except IntegrityError:
        status = 412
        message = 'Email already exists'
    except ValueError as err:
        status = 412
        message = str(err)
    return status, {'message': message}


def fetch_user_question(body):
    try:
        if 'email' not in body:
            raise ValueError
        email = body['email']
        row = fetch_one(GET_USER_QUESTION_QUERY, (email,))
        if row:
            status = 200
            user_id, user_email, user_type, question, answer = row
            body = {'question': question}
        else:
            status = 404
            body = {'message': 'User does not exist'}
    except ValueError:
        status = 412
        body = {'message': 'Email is a required field'}
    return status, body


def verify_mfa(body):
    try:
        if MFA_REQUIRED_FIELDS != set(body.keys()):
            raise ValueError('Required fields missing')
        row = fetch_one(GET_USER_QUESTION_QUERY, (body['email'],))
        if row:
            user_id, user_email, user_type, question, answer = row
            if body['answer'] != answer:
                raise ValueError('Question and answer does not match.')
            status = 200
            body = {'type': user_type, 'id': user_id}
        else:
            status = 404
            body = {'message': "User does not exist"}
    except ValueError as err:
        status = 412
        body = {'message': str(err)}
    return status, body


ACTION_MAPPING = {
    '/registration': register,
    '/fetch_user_question': fetch_user_question,
    '/verify_mfa': verify_mfa
}


def print_info(message):
    print('[INFO] ' + message)


def print_error(message):
    print('[ERROR] ' + message)


def mfa_handler(event, context):
    request_context = event['requestContext']['http']
    body = json.loads(event['body'])
    print_info('Request received ' + json.dumps(request_context))
    print_info('Body of request' + event['body'])

    path = request_context['path']
    print_info('Path' + path)
    status, response_body = ACTION_MAPPING[path](body)
    print_info('Status: {}'.format(status))
    print_info('response_body {}'.format(response_body))
    return {
        'statusCode': status,
        'headers': {
            "content-type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        'body': json.dumps(response_body)
    }


if __name__ == '__main__':
    mock_events = {
        'REGISTER': {
            'rawPath': '/registration',
            'requestContext': {
                'http': {
                    'method': 'PUT',
                    'path': '/registration'
                }
            },
            'body': '{"name": "Aasif Faizal", "email": "a@a.com", "question": "Q?", "answer": "A"}'
        },
        'FETCH_QUESTION': {
            'rawPath': '/fetch_user_question',
            'requestContext': {
                'http': {
                    'method': 'POST',
                    'path': '/fetch_user_question'
                }
            },
            'body': '{"email": "a@a.com"}'
        },
        'VERIFY_MFA': {
            'rawPath': '/verify_mfa',
            'requestContext': {
                'http': {
                    'method': 'POST',
                    'path': '/verify_mfa'
                }
            },
            'body': '{"email": "a@a.com", "answer": "A"}'
        }
    }
    mfa_handler(mock_events['VERIFY_MFA'], None)
