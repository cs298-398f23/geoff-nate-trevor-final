import redis
import json
import scraper

host = 'redis'
port = 6379

r = redis.Redis(host=host, port=port, decode_responses=True)

seasons = {
    '4249': 'Outdoor 2023',
    '4011': 'Indoor 2023', 
    '3812': 'Outdoor 2022',
    '3565': 'Indoor 2022',
    '3430': 'Outdoor 2021',
    '2784': 'Indoor 2020',
    '2585': 'Outdoor 2019',
    '2350': 'Indoor 2019',
    '2212': 'Outdoor 2018',
    '2094': 'Indoor 2018',
    '1956': 'Outdoor 2017',
    '1850': 'Indoor 2017',
    '1746': 'Outdoor 2016',
    '1673': 'Indoor 2016',
    '1498': 'Outdoor 2015',
    '1354': 'Indoor 2015',
    '1321': 'Outdoor 2014',
    '1197': 'Indoor 2014',
    '1134': 'Outdoor 2013',
    '1006': 'Indoor 2013'
}

current_season_id = '4249'

if __name__ == '__main__':

    # separate the for loops so the IDs are set before the seasons
    # so that it loads quickly on new deploys
    for season_id in seasons.keys():
        if r.hget('season_ids', season_id) == None:
            r.hset('season_ids', season_id, seasons[season_id])

    for season_id in seasons.keys():
        if r.hget('seasons_m', season_id) == None:
            r.hset('seasons_m', season_id, json.dumps(scraper.get_season(season_id, 'm')))

        if r.hget('seasons_f', season_id) == None:
            r.hset('seasons_f', season_id, json.dumps(scraper.get_season(season_id, 'f')))

    r.hset('seasons_m', current_season_id, json.dumps(scraper.get_season(current_season_id, 'm')))
    r.hset('seasons_f', current_season_id, json.dumps(scraper.get_season(current_season_id, 'f')))