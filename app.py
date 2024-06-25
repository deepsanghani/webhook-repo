from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from dateutil import parser

app = Flask(__name__)

client = MongoClient('mongodb://localhost:27017/')
db = client['github_webhooks']
events_collection = db['events']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    event = {}
    
    if 'pull_request' in data:
        if data['action'] == 'closed' and data['pull_request']['merged']:
            event = {
                'action': 'MERGE',
                'author': data['sender']['login'],
                'from_branch': data['pull_request']['head']['ref'],
                'to_branch': data['pull_request']['base']['ref'],
                'timestamp': parser.isoparse(data['pull_request']['merged_at']),
                'request_id': data['pull_request']['id']
            }
        else:
            event = {
                'action': 'PULL_REQUEST',
                'author': data['sender']['login'],
                'from_branch': data['pull_request']['head']['ref'],
                'to_branch': data['pull_request']['base']['ref'],
                'timestamp': parser.isoparse(data['pull_request']['created_at']),
                'request_id': data['pull_request']['id']
            }
    elif 'ref' in data and 'head_commit' in data and data['head_commit']:
        event = {
            'action': 'PUSH',
            'author': data['head_commit']['author']['name'],
            'to_branch': data['ref'].split('/').pop(),
            'timestamp': parser.isoparse(data['head_commit']['timestamp']),
            'request_id': None  # No request ID for push events
        }

    events_collection.insert_one(event)
    return 'Event received', 200

@app.route('/events', methods=['GET'])
def get_events():
    events = list(events_collection.find().sort('timestamp', -1).limit(10))
    for event in events:
        event['_id'] = str(event['_id'])
    return jsonify(events)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
