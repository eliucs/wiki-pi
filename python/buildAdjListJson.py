# -----------------------------------------------------------------------------
#
# buildAdjListJson.py
#
# The purpose of this module is that for all articles parsed in the
# 'wiki-en-processed/articles' folder to build the corresponding adj-before list
# of the articles in their respective json dump, which is output to the folder
# 'wiki-en-processed/adj'.
#
# -----------------------------------------------------------------------------


import json
import requests


DIRECTORY_IN = 'wiki-en-processed/articles/'
DIRECTORY_OUT = 'wiki-en-processed/adj/'
DIRECTORY_OUT_ERRORS = 'wiki-en-processed/adj-errors/'

START = 0
END = 0

for i in range(START, END + 1):

    file = '{:06}'.format(i)

    print('[*] Starting to process articles:', DIRECTORY_IN + file + 'json')

    with open(DIRECTORY_IN + file + '.json') as jsonFile:

        obj = json.load(jsonFile)

        count = 0
        adj = []
        errors = []

        for entry in obj:

            count += 1
            title = entry['title']
            print(str(count) + ':', title)

            try:
                req = requests.get('https://en.wikipedia.org/w/api.php' +
                                   '?action=query' +
                                   '&generator=links' +
                                   '&gpllimit=500' +
                                   '&format=json' +
                                   '&titles=' + title)

                res = eval(req.text)['query']['pages']
                links = []
                for key in res:
                    links.append(res[key]['title'])
                # print(title + ':', links)

                adj.append({
                    'title': title,
                    'adj-before': links
                })

                print('[*] Finished request for:', title)

            except Exception:
                print('[*] Skipped request for:', title)
                errors.append(title)

        # Save adj success file:
        print('[*] Saving adj success to file:', DIRECTORY_OUT + file + '.json')
        with open(DIRECTORY_OUT + file + '.json', 'w') as adjSuccessJsonFile:
            json.dump(adj, adjSuccessJsonFile)
        print('[*] Finished saving adj success to file:', DIRECTORY_OUT + file + '.json')

        # Save adj error file:
        print('[*] Saving adj error to file:', DIRECTORY_OUT_ERRORS + file + '.json')
        with open(DIRECTORY_OUT_ERRORS + file + '.json', 'w') as adjErrorJsonFile:
            json.dump(errors, adjErrorJsonFile)
        print('[*] Finished saving adj error to file:', DIRECTORY_OUT + file + '.json')

    print('[*] Finished processing articles:', DIRECTORY_IN + file + 'json')