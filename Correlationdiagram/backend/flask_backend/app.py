from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import spacy 
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

nlp = spacy.load("ja_core_news_sm")

@app.route('/extractNode', methods=['POST'])
def extract_people():

    data = request.get_json()
    text = data.get("text", "")
    
    doc = nlp(text)
    
    people = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    
    if not people:
        return jsonify({"error": "人物名が見つかりませんでした"}), 400
    
    return jsonify({"people": people})
@app.route('/extractRelations', methods=['POST'])
def extract_relations():
    data = request.get_json()
    text = data.get("text", "")
    
    doc = nlp(text)
    
    relations = []
    people = set()

    for sent in doc.sents:
        persons = [ent.text for ent in sent.ents if ent.label_ == "PERSON"]
        people.update(persons)
        
        if len(persons) == 2:
            relation_words = []
            
            for token in sent:
                if token.dep_ in ["ROOT", "nsubj", "dobj", "acl", "amod", "advmod"]:
                    relation_words.append(token.lemma_)
            
            if relation_words:
                relations.append((persons[0], persons[1], list(set(relation_words))))

    if not relations:
        return jsonify({"error": "関係が見つかりませんでした"}), 400
    
    return jsonify({
        "relations": [
            {"person1": person1, "person2": person2, "relation": relation}
            for person1, person2, relation in relations
        ]
    })

if __name__ == '__main__':
    port = os.environ.get('FLASK_PORT')
    app.run(host='0.0.0.0', port=port)
