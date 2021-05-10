import imghdr
import os
from flask import Flask, render_template, request, redirect, url_for, abort, send_from_directory, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
from model import *

app = Flask(__name__)
SESSION_TYPE = 'filesystem'

app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024
app.config['UPLOAD_EXTENSIONS'] = ['.txt']
app.config['UPLOAD_PATH'] = 'data'

CORS(app)


@app.route('/')
def index():
    files = os.listdir(app.config['UPLOAD_PATH'])
    return jsonify(message=files)

@app.route('/', methods=['POST'])
def upload_files():
    uploaded_file = request.files['file']
    filename = secure_filename(uploaded_file.filename)
    if filename != '':
        file_ext = os.path.splitext(filename)[1]
        if file_ext not in app.config['UPLOAD_EXTENSIONS']:
            abort(400)

        if filename in os.listdir(app.config['UPLOAD_PATH']):
            uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename[:-4] + "copy.txt"))
        else:
            uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))

    return redirect(url_for('index'))

@app.route('/uploads/<filename>')
def upload(filename):
    return send_from_directory(app.config['UPLOAD_PATH'], filename)

@app.route('/clear')
def clear():
    for file in os.listdir(app.config['UPLOAD_PATH']):
        os.remove('data/'+file)
    return jsonify(message="Data is cleared")

@app.route('/words', methods=['POST'])
def words():
    res = request.json['files']
    res = res.split(", ")
    topicCount = int(request.json['topics'])
    # getTopics(topicCount, res)
    return jsonify(tfidf_Calculator(res))

@app.route('/topics', methods=['GET'])
def topics():
    tops = open("Topics.txt", "r")
    return jsonify({'topics': [t.split(' ')[0] for t in tops.readlines()]})


if __name__ == '__main__':
    app.run(debug=True, TEMPLATES_AUTO_RELOAD=True)