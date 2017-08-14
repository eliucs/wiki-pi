# parseArticle.py

def processArticle(article):

    lines = article.split('\n')
    content = []
    contentTitle = ''

    for line in lines:
        # skip empty lines
        if len(line) == 0:
            continue

        # h1
        if line[0] == '[' and not line.startswith('http'):
            title = line[line.find("[["):line.find("]]")]
            title = title[2:]

            if len(title) != 0:
                # print('h1:', title)

                if not contentTitle:
                    contentTitle = title

                content.append({
                    'h': 1,
                    'txt': title
                })

            continue

        # h2 - h6
        if line[0] == '=':
            count = 0
            for i in range(len(line)):
                if line[i] == '=':
                    count += 1
                else:
                    break

            header = line.rstrip('=')\
                .rstrip(' ')\
                .lstrip('=')\
                .lstrip(' ')

            if len(header) != 0:
                # print('h' + str(count) + ':', header)

                content.append({
                    'h': count,
                    'txt': header
                })

            continue

        # p
        line = line.strip()

        if len(line) == 0:
            continue
        elif line == "*":
            continue

        # print('p: ', line)

        content.append({
            'h': 0,
            'txt': line
        })

    finalContent = {
        'title': contentTitle,
        'content': content
    }

    return finalContent


def processAllArticles(articleRaw):

    articles = []

    articleString = ''
    for line in articleRaw:
        articleString += line

    p = 0

    while p < len(articleString)-1:
        if articleString[p] == '[':
            start = p
            p += 2

            while not(articleString[p-2] == '\n'
                      and articleString[p-1] == '\n'
                      and articleString[p] == '['):

                if (p+1) >= len(articleString):
                    break
                p += 1

            end = p

            article = articleString[start:end]
            articles.append(processArticle(article))

    return articles