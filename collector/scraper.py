from bs4 import BeautifulSoup
import requests

def get_season(season_code, gender):
    url = f'https://api.tfrrs.org/list_data/{season_code}?limit=25'

    contents = requests.get(url).text

    soup = BeautifulSoup(contents, 'html.parser')

    if not gender in ['m', 'f']:
        raise 'gender must be m or f'

    results = get_results(soup, f'gender_{gender}')

    return results

def clean_data(data):
    return data.strip().split('\n')[0]

def get_results(soup, table_class):
    result_dict = {}

    results = soup.find_all('div', class_=table_class)
    for result in results:
        event = result.find('h3').text
        event = clean_data(event)

        result_dict[event] = []

        table = result.find('table').find('tbody')
        for row in table.find_all('tr'):
            records = row.find_all('td')
            if not 'relay' in event.lower():
                place = clean_data(records[0].text)
                name = clean_data(records[1].text)
                team = clean_data(records[3].text)
                mark = clean_data(records[4].text)
            else:
                place = clean_data(records[0].text)
                team = clean_data(records[1].text)
                name = clean_data(records[3].text)
                mark = clean_data(records[2].text)

            result_dict[event].append({
                'place': place,
                'name': name,
                'team': team,
                'mark': mark
            })  

            
    return result_dict
