# -----------------------------------------------------------------------------
#
# readCompressedFiles.py
#
# The purpose of this module is to test reading back all of the compressed
# .gz article files, which are located in 'wiki-en-processed/articles-gz/
# XXXXXX.json.gz', where 'XXXXXX.json.gz' is the compressed json file.
#
# -----------------------------------------------------------------------------

import gzip
import json


DIRECTORY_IN = 'wiki-en-processed/articles-compressed/000000.json.gz'
START = 0

errors = []

with gzip.open(DIRECTORY_IN, 'rb') as jsonFileCompressed:
    contentsBytes = jsonFileCompressed.read()
    contentsString = contentsBytes.decode('utf-8')

    contents = json.loads(contentsString)

    for entry in contents:
        print(entry)
