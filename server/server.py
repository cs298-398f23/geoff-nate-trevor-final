from flask import Flask, render_template, request
import redis
import json

host = 'redis'
port = 6379

r = redis.Redis(host=host, port=port, decode_responses=True)

app = Flask(__name__)

r.delete('saved_seasons')
r.delete('saved_results')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/seasons')
def seasons():
    return {
        'seasons': r.hgetall('season_ids')
    }

@app.route('/currentSeason')
def currentSeason():
    return {
        'current_season': r.get('current_season')
    }

@app.route('/results')
def results():
    season = request.args.get('season')
    # use the query parameter for this
    gender = request.args.get('gender')
    return json.loads(r.hget(f'seasons_{gender}', season))

@app.route('/saveResults', methods=['POST'])
def saveResults():
    if request.method == 'POST':
        saved = r.lrange('saved_seasons', 0, -1)
        if saved == None:
            saved = []
        next_id = len(saved)
        data = request.get_json()
        name = data['saveName']
        r.rpush('saved_seasons', name)
        print(name)
        r.hset('saved_results', next_id, json.dumps(data['results']))
        return {
            'id': next_id,
            'name': name
        }
    
@app.route('/loadSaved')
def loadSaved():
    return json.loads(r.hget('saved_results', request.args.get('id')))

@app.route('/savedResults')
def savedResults():
    return {
        'saved_results': r.lrange('saved_seasons', 0, -1)
    }



if __name__ == '__main__':
   app.run(host='0.0.0.0', port=8000)