# -----------------------------------------------------------------------------
#
# buildArticlesJson.py
#
# The purpose of this module is to go through every raw txt file in the
# 'wiki-en-raw/wiki-en-txt-dump-20140615' folder and convert all of the
# txt files into formatted json files, which are placed in the
# 'wiki-en-processed/articles' folder.
#
# -----------------------------------------------------------------------------

import parseArticle
import json

DIRECTORY_IN = 'wiki-en-raw/wiki-en-txt-dump-20140615/20140615-wiki-en_'
DIRECTORY_OUT = 'wiki-en-processed/articles/'

START = 292
END = 293


for i in range(START, END):
    file = '{:06}'.format(i)

    print('[*] Starting to read', DIRECTORY_IN + file)

    with open(DIRECTORY_IN + file + '.txt', encoding='utf-8') as articleFile:
        lines = articleFile.readlines()
        articlesProcessed = parseArticle.processAllArticles(lines)

        print('[#] Starting to convert to json:', DIRECTORY_OUT + file + '.json')

        with open(DIRECTORY_OUT + file + '.json', 'w') as jsonFile:
            json.dump(articlesProcessed, jsonFile)

        print('[#] Finished converting to json:', DIRECTORY_OUT + file + '.json')



