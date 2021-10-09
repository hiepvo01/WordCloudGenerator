import string

table = str.maketrans('', '', string.punctuation)

def read_DataFiles(files):
    data_dict = {}
    for file in files:
        f = open('data/'+file, 'r')
        all = []
        for line in f.readlines():
            line_words = []

            # Getting files' individual words in lowercase and no newline or dot symbols
            for w in line.split(" "):
                if '\n' in w:
                    w = w.replace('\n', '')
                if '.' in w:
                    w = w.replace('.', '')
                if w != "" and w != " ":
                    line_words.append(w.lower())
            all += line_words

            # Remove punctuations and populate dictionary
            stripped = [w.translate(table) for w in all]
        data_dict[file[0:-4]] = stripped
    return data_dict

def read_StopWords():
    # return the list of stopwords
    stopwords = open('stopwords.txt')
    return [w[:-1] for w in stopwords.readlines()] 

def tfidf_Calculator(dataFiles):
    # Getting list of stopwords and dictionary of files' words
    stopwords = read_StopWords()
    data_dict = read_DataFiles(dataFiles)

    word_dict = {}
    # Populate word count in dictionary for each file if word is not stopwords
    for file in data_dict.keys():
        for word in data_dict[file]:
            if word not in stopwords:
                if word not in word_dict.keys():
                    word_dict[word] = {}
                    for fileName in data_dict.keys():
                        if fileName == file:
                            word_dict[word][fileName] = 1
                        else:
                            word_dict[word][fileName] = 0
                else:
                    word_dict[word][file] += 1
    return word_dict


def resultant_Topics(data):
    result = open("Topics.txt", "w+")
    for d in data:
        result.write(d + ' ' + str(data[d]) + '\n')
    result.close()

def getTopics(n, dataFiles):
    topics = {}
    for i in range(n):
        maxCount = 0
        chosen = ''
        all = tfidf_Calculator(dataFiles)
        for word in all:

            if maxCount < max(all[word].values()) and word not in topics:
                maxCount = max(all[word].values())
                chosen = word

            elif maxCount == max(all[word].values()) and word not in topics:
                # If the words have same max value, check if which word appear in more files
                end = [v for v in all[word].values() if v > 0]
                start = [v for v in all[chosen].values() if v > 0]

                if len(start) < len(end):
                    maxCount = max(all[word].values())
                    chosen = word
        topics[chosen] = maxCount
    resultant_Topics(topics)
    return topics


# print(tfidf_Calculator(['cheese.txt', 'cupcake.txt']))
# print(read_StopWords())
# print(getTopics(2, ['cheese.txt', 'cupcake.txt']))