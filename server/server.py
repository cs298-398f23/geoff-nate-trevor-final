from flask import Flask, render_template
import redis
import json

host = 'redis'
port = 6379

r = redis.Redis(host=host, port=port, decode_responses=True)

app = Flask(__name__)

@app.route('/')
def home():
    items = [json.loads(item) for item in r.lrange('items', 0, -1)]
    return render_template('index.html', items=items)


if __name__ == '__main__':
   app.run(host='0.0.0.0', port=8000)