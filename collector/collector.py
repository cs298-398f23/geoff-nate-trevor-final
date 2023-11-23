import redis
import json
import scraper

host = 'redis'
port = 6379

r = redis.Redis(host=host, port=port, decode_responses=True)

seasons = {
    '4011': 'Indoor 2023', 
    '4249': 'Outdoor 2023'
}

current_season_id = '4249'

if __name__ == '__main__':


    for season_id in seasons.keys():
        if r.hget('season_ids', season_id) == None:
            r.hset('season_ids', season_id, seasons[season_id])
            
        if r.hget('seasons_m', season_id) == None:
            r.hset('seasons_m', season_id, json.dumps(scraper.get_season(season_id, 'm')))
    
    r.hset('seasons_m', current_season_id, json.dumps(scraper.get_season(current_season_id, 'm')))