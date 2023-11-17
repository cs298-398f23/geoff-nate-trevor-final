import redis
import json

host = 'redis'
port = 6379

r = redis.Redis(host=host, port=port, decode_responses=True)

if __name__ == '__main__':

    r.ltrim('items1', 1, 0)
    r.rpush('items1', json.dumps({'name': 'tfrrs1', 'value': 'res1'}))
    r.rpush('items1', json.dumps({'name': 'tfrrs2', 'value': 'res2'}))
    r.rpush('items1', json.dumps({'name': 'tfrrs3', 'value': 'res3'}))

    r.ltrim('items2', 1, 0)
    r.rpush('items2', json.dumps({'name': 'data1', 'value': 'res1'}))
    r.rpush('items2', json.dumps({'name': 'data2', 'value': 'res2'}))
    r.rpush('items2', json.dumps({'name': 'data3', 'value': 'res3'}))