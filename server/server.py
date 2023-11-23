from flask import Flask, render_template, request
import redis
import json

host = 'redis'
port = 6379

r = redis.Redis(host=host, port=port, decode_responses=True)

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/seasons')
def seasons():
    return {
        'seasons': r.hgetall('season_ids')
    }

@app.route('/results')
def results():
    season = request.args.get('season')
    # use the query parameter for this
    gender = 'm'
    return json.loads(r.hget(f'seasons_{gender}', season))


if __name__ == '__main__':
   app.run(host='0.0.0.0', port=8000)