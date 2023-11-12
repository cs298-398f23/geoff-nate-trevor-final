import redis
import json

host = 'redis'
port = 6379

r = redis.Redis(host=host, port=port, decode_responses=True)

if __name__ == '__main__':

    r.ltrim('items', 1, 0)
    r.rpush('items', json.dumps({'name': 'tfrrs1', 'value': 'res1'}))
    r.rpush('items', json.dumps({'name': 'tfrrs2', 'value': 'res2'}))
    r.rpush('items', json.dumps({'name': 'tfrrs3', 'value': 'res3'}))