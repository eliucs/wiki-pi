import gzip
import shutil

DIRECTORY_IN = 'wiki-en-processed/articles/'
DIRECTORY_OUT = 'wiki-en-processed/articles-compressed/'

for i in range(508):
    file = '{:06}'.format(i)

    print('[*] Starting to compress', DIRECTORY_IN + file + '.json')

    with open(DIRECTORY_IN + file + '.json', 'rb') as fileIn, gzip.open(DIRECTORY_OUT + file + '.json.gz', 'w') as fileOut:
        fileOut.writelines(fileIn)