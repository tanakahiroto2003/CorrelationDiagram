import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage, createNode, extractPeople, extractRelations, createNodeRelation, createNodeRelationLine } from './api';

function CreateNodeNode() {
  const [text, setText] = useState('');
  const [people, setPeople] = useState([]);
  const [relations, setRelations] = useState([]);
  const [images, setImages] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [listId, setListId] = useState('');

  useEffect(() => {
    const storedListId = sessionStorage.getItem('selectedListId');
    if (storedListId) {
      setListId(storedListId);
    }
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      try {
        
        const foundPeople = await extractPeople(text);
        if (!foundPeople.length) {
          throw new Error('人物名が見つかりませんでした');
        }

        setPeople(Array.from(new Set(foundPeople)));
        setErrorMessage('');
        setRelations([]);
        
        const extractedRelations = await extractRelations(text, foundPeople);
        if (extractedRelations.length === 0) {
          setErrorMessage('関係性が見つかりませんでした');
        } else {
          setRelations(extractedRelations);
        }
        
      } catch (error) {
        console.error('エラー:', error);
        setErrorMessage(error.message || '人物名の抽出中にエラーが発生しました');
        setPeople([]);
        setRelations([]);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      if (!people.length) {
        setErrorMessage('人物名が抽出されていません。');
        return;
      }

      const nodeIds = [];
      for (let i = 0; i < people.length; i++) {
        const person = people[i];
        const node = {
          NodeName: person,
          description: '',
          NodeColor: '#000000',
          image: images[person] || null,
          ListID: listId,
        };

        if (node.image instanceof File) {
          const imageUrl = await uploadImage(node.image);
          node.image = imageUrl;
        }

        const createdNode = await createNode(listId, node);
        nodeIds.push(createdNode.NodeID);
      }

      for (const rel of relations) {
        const person1Index = people.indexOf(rel.person1);
        const person2Index = people.indexOf(rel.person2);

        if (person1Index === -1 || person2Index === -1) continue;

        const relation = {
          NodeID: nodeIds[person1Index],
          targetNodeID: nodeIds[person2Index],
          relationDirection: 'two-way',
        };

        const createdRelation = await createNodeRelation(listId, relation);

        const relationLine = {
          ListID: listId,
          NodeRelationID: createdRelation.NodeRelationID,
          NodeRelationLine_Color: '#000000',
          NodeRelationLine_Description: rel.relation.join(''),
        };

        await createNodeRelationLine(relationLine);
      }

      navigate('/CorrelationDiagram');
    } catch (error) {
      console.error('ノード作成エラー:', error);
      setErrorMessage('ノード作成中にエラーが発生しました');
    }
  };

  const handleImageChange = (person, file) => {
    setImages(prevImages => ({
      ...prevImages,
      [person]: file,
    }));
  };

  const handleRelationChange = (index, newRelation) => {
    setRelations(prevRelations => {
      const updatedRelations = [...prevRelations];
      updatedRelations[index].relation = newRelation.split(',').map(r => r.trim());
      return updatedRelations;
    });
  };

  return (
    <div style={styles.app}>
      {errorMessage && <div style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</div>}

      <h1>AI作成</h1>
      <label>文章を入力してEnterを押してください</label>
      <textarea
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="例: 田中さんと佐藤さんは昔からの友人で..."
        style={styles.textarea}
      />

      {people.length > 0 && (
        <div>
          <div style={styles.imageSection}>
            {people.map((person, index) => (
              <div key={index} style={styles.personImageContainer}>
                <label>{person} の画像</label>
                <input
                  type="file"
                  accept="image/*"
                  name={`image-${person}`}
                  onChange={(e) => handleImageChange(person, e.target.files[0])}
                  style={styles.input}
                />
                {images[person] && (
                  <div style={styles.imagePreview}>
                    <strong>アップロードされた画像:</strong>
                    <img
                      src={URL.createObjectURL(images[person])}
                      alt={`${person}'s uploaded`}
                      style={styles.imagePreviewImage}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {relations.length > 0 && (
        <div style={styles.relationSection}>
          <h3>関係性の編集</h3>
          {relations.map((rel, index) => (
            <div key={index} style={styles.relationContainer}>
              <label>{rel.person1} と {rel.person2} の関係:</label>
              <textarea
                value={rel.relation.join(' ')}
                onChange={(e) => handleRelationChange(index, e.target.value)}
                style={styles.relationInput}
              />
            </div>
          ))}
        </div>
      )}

      <div style={styles.buttonContainer}>
        <button onClick={handleSubmit} style={styles.createButton}>作成</button>
        <button onClick={() => navigate('/CorrelationDiagram')} style={styles.cancelButton}>キャンセル</button>
      </div>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    height: '200px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
    minHeight: '50px',
    minWidth: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  imageSection: {
    marginTop: '20px',
  },
  personImageContainer: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  imagePreview: {
    marginTop: '10px',
  },
  imagePreviewImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    marginTop: '10px',
  },
  relationSection: {
    marginTop: '30px',
  },
  relationContainer: {
    marginBottom: '10px',
  },
  relationInput: {
    padding: '8px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    width: '100%',
    minHeight: '50px',
  },
};

export default CreateNodeNode;
