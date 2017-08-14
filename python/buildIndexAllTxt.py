# -----------------------------------------------------------------------------
#
# buildIndexAllTxt.py
#
# The purpose of this module is to parse through the index-all.json file in
# wiki-en-processed/index/index-all.json and build the txt index-all file
# (index-all.txt).
#
# -----------------------------------------------------------------------------

# 1. Load to memory the json index-all file (index-all.json):
import json

index = []

print('[*] Starting to load index-all.json.')
with open('wiki-en-processed/index/index-all.json') as indexAllJsonFile:
    index = json.load(indexAllJsonFile)
print('[*] Finished loading index-all.json.')

# 2. Build the txt index-all file (index-all.txt):
INDEX_ALL_TXT_FILE = 'wiki-en-processed/index/index-all.txt'

print('[*] Starting to build index-all.txt.')
count = 0
with open(INDEX_ALL_TXT_FILE, 'wb') as indexAllTxtFile:
    for entry in index:
        count += 1
        print(count, ':', entry['title'])
        indexAllTxtFile.write((entry['title'] + '\n').encode("utf-8"))
    indexAllTxtFile.close()

print('[*] Finished building index-all.txt.')

with open('wiki-en-processed/index/index-all.txt') as file:
    lines = file.readlines()

    for l in lines:
        print(l)