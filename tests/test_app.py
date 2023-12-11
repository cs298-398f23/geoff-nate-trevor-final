import pytest
import redis
import json

from server.server import app

def test_index():

    app.config['TESTING'] = True
    client = app.test_client()

    response = client.get('/')
    assert response.status_code == 200

def test_seasons():

    app.config['TESTING'] = True
    client = app.test_client()

    response = client.get('/seasons')
    assert response.status_code == 200

def test_currentSeason():

    app.config['TESTING'] = True
    client = app.test_client()

    response = client.get('/currentSeason')
    assert response.status_code == 200

def test_results_4249m():

    app.config['TESTING'] = True
    client = app.test_client(1)

    response = client.get('/results?season=4249&gender=m')
    
    # read text from expected_results.json
    # compare to response.data

    expected = open('expected_results.json', 'r').read()
    assert json.loads(response.data.decode(encoding='utf-8')) == json.loads(expected)
    assert response.status_code == 200

def test_add_scenario():

    app.config['TESTING'] = True
    client = app.test_client()

    response = client.post('/saveResults?season=test&gender=test', json={
        'saveName': 'test',
        'results': {
            'test': 'test'
        }
    })
    assert response.status_code == 200

def test_load_scenario():
    
    app.config['TESTING'] = True
    client = app.test_client()

    response = client.get('/loadSaved?season=test&gender=test&id=0')
    assert response.status_code == 200

def test_saved_results():
        
    app.config['TESTING'] = True
    client = app.test_client()

    response = client.get('/savedResults?season=test&gender=test')
    assert response.status_code == 200
