# -----------------------------------------------------------------------------
#
# buildIndexAllJson.py
#
# The purpose of this module is to parse through the raw Wikipedia index file,
# in wiki-en-raw/wiki-en-txt-dump-20140615/20140615-en-index.txt and build up
# the basic jason index-all file (index-all.json) after filtering out the
# unnecessary Wikipedia-specific categories (i.e. Book, File, Draft, MediaWiki,
# etc.)
#
# -----------------------------------------------------------------------------

# 1. Parse out all (articleTitle, articleLocation) pairs to dict index, and
#    filter out all by content and type filters:

import json

FILE_LOCATION_RAW_INDEX_TXT = 'wiki-en-raw/wiki-en-txt-dump-20140615/' \
                              '20140615-en-index.txt'
CONTENT_FILTERS = ['(disambiguation)']
TYPE_FILTERS = ['Book:', 'book:', 'Category:', 'category:', ':Category:',
                ':category:', 'Draft:', 'draft:', 'File', 'file:', ':File:',
                ':file:', 'Image:', 'image:', 'Portal:', 'portal:', 'Template:',
                'template:', 'MediaWiki:', 'Mediawiki:', 'mediawiki:',
                'Wikipedia:']

index = []

print('[*] Starting to build dictionary of all articles.')
articlesProcessed = 0
with open(FILE_LOCATION_RAW_INDEX_TXT, encoding='utf-8') as rawIndexTxtFile:

    lines = rawIndexTxtFile.readlines()

    for line in lines:
        row = line.split('\t')
        title = row[1].rstrip('\n')

        valid = True
        for f in TYPE_FILTERS:
            if title.startswith(f):
                valid = False
                break

        if not valid:
            continue

        for f in CONTENT_FILTERS:
            if f in title:
                valid = False
                break

        if not valid:
            continue

        location = row[0]
        index.append({
            'title': title,
            'location': location
        })
        articlesProcessed += 1
        print(articlesProcessed, ': ', title)

print('[*] Finished building dictionary of all articles.')

# 2. Build json index-all file (index-all.json) for all articles:

INDEX_ALL_JSON_FILE = 'wiki-en-processed/index/index-all.json'

print('[*] Starting to build json index-all file.')
with open(INDEX_ALL_JSON_FILE, 'w') as indexAllJsonFile:
    json.dump(index, indexAllJsonFile)
print('[*] Finished building json index-all file.')
