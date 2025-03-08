import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNodeRelation, createNodeRelationLine } from './api';

function CreateRelations() {
  const [Nodes, setNodes] = useState([]);
  const [relations, setRelations] = useState([
    { NodeID: '', targetNodeID: '', relationDirection: 'one-way', relationColor: '#000000', relationDescription: '' }
  ]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const colorOptions = [
    { value: '#000000', label: '黒' },
    { value: '#808080', label: '灰色' },
    { value: '#FF0000', label: '赤' },
    { value: '#FF4500', label: '黄赤' },
    { value: '#FFFF00', label: '黄' },
    { value: '#9ACD32', label: '黄緑' },
    { value: '#008000', label: '緑' },
    { value: '#20B2AA', label: '青緑' },
    { value: '#0000FF', label: '青' },
    { value: '#8A2BE2', label: '青紫' },
    { value: '#800080', label: '紫' },
    { value: '#C71585', label: '赤紫' },
  ];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/api/getNodeList/${sessionStorage.getItem('selectedListId')}`)
      .then(response => response.json())
      .then(data => setNodes(data))
      .catch(error => console.error('Error loading Nodes:', error));
  }, []);

  const handleAddRelation = () => {
    setRelations([...relations, { NodeID: '', targetNodeID: '', relationDirection: 'one-way', relationColor: '#000000', relationDescription: '' }]);
  };

  const handleRemoveRelation = (index) => {
    setRelations((prevRelations) => prevRelations.filter((_, i) => i !== index));
  };

  const handleRelationChange = (index, field, value) => {
    setRelations((prevRelations) => {
      const updatedRelations = [...prevRelations];
      updatedRelations[index][field] = value;

      if (field === 'NodeID' && value === updatedRelations[index].targetNodeID) {
        updatedRelations[index].targetNodeID = '';
      } else if (field === 'targetNodeID' && value === updatedRelations[index].NodeID) {
        updatedRelations[index].NodeID = '';
      }
      return updatedRelations;
    });
  };

  const handleDirectionClick = (index) => {
    const updatedRelations = [...relations];
    const currentDirection = updatedRelations[index].relationDirection;
    updatedRelations[index].relationDirection = currentDirection === 'one-way' ? 'two-way' : 'one-way';
    setRelations(updatedRelations);
  };

  const checkForDuplicateRelations = (relations) => {
    const seenRelations = new Set();
  
    for (const relation of relations) {
      const { NodeID, targetNodeID } = relation;
  
      const relationKey = `${NodeID}-${targetNodeID}`;
  
      if (seenRelations.has(relationKey)) {
        return true;
      }
  
      const reverseRelationKey = `${targetNodeID}-${NodeID}`;
      if (seenRelations.has(reverseRelationKey)) {
        return true;
      }
  
      seenRelations.add(relationKey);
    }
  
    return false;
  };
  
  const handleSubmit = async () => {
    if (relations.some(relation => !relation.NodeID || !relation.targetNodeID)) {
      setErrorMessage('ノードを選択してください。');
      return;
    }
    if (relations.some(relation => !relation.relationDescription)) {
      setErrorMessage('関係説明を選択してください。');
      return;
    }

    if (relations.length > 1) {
      if (checkForDuplicateRelations(relations)) {
        setErrorMessage('同じ関係を作成しようとしています。');
        return;
      }
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/checkRelationExists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ListID: sessionStorage.getItem('selectedListId'),
          relations: relations,
        }),
      });
  
      const data = await response.json();
  
      if (data.message === 'この関係はすでに存在します') {
        setErrorMessage('この関係はすでに存在します');
        return;
      }
      for (const relation of relations) {
        const relationResponse = await createNodeRelation(sessionStorage.getItem('selectedListId'), relation);

        const relationLine = {
          ListID: parseInt(sessionStorage.getItem('selectedListId')),
          NodeRelationID: relationResponse.NodeRelationID,
          NodeRelationLine_Color: relation.relationColor,
          NodeRelationLine_Description: relation.relationDescription,
        };
        await createNodeRelationLine(relationLine);
      }

      navigate('/CorrelationDiagram');
    } catch (error) {
      console.error('Error message:', error.message);
      setErrorMessage('関係作成中にエラーが発生しました');
    }
  };

  const filterAvailableNodes = (index) => {
    const selectedNodes = relations
      .map(r => [r.NodeID, r.targetNodeID])
      .flat()
      .filter(id => id);

    return Nodes.filter(Node => {
      const isSelected = selectedNodes.includes(Node.NodeID);
      const isCurrentNode = relations[index].NodeID === Node.NodeID || relations[index].targetNodeID === Node.NodeID;
      return !isSelected && !isCurrentNode;
    });
  };

  return (
    <div style={styles.app}>
      {errorMessage && <div style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</div>}

      {relations.map((relation, index) => {
        const availableNodes = filterAvailableNodes(index);

        return (
          <div key={index} style={styles.relationForm}>
            <h1>ノード関係線作成</h1>

            <label>ノード</label>
            <select
              value={relation.NodeID}
              onChange={(e) => handleRelationChange(index, 'NodeID', e.target.value)}
              style={styles.input}
            >
              <option value="">選択してください</option>
              {availableNodes.map((Node) => (
                <option key={Node.NodeID} value={Node.NodeID}>
                  {Node.Node_Name}
                </option>
              ))}
            </select>

            <label>相手ノード</label>
            <select
              value={relation.targetNodeID}
              onChange={(e) => handleRelationChange(index, 'targetNodeID', e.target.value)}
              style={styles.input}
            >
              <option value="">選択してください</option>
              {availableNodes.map((Node) => (
                <option key={Node.NodeID} value={Node.NodeID}>
                  {Node.Node_Name}
                </option>
              ))}
            </select>

            <label>関係方向</label>
            <div style={styles.directionButtons}>
              <button onClick={() => handleDirectionClick(index)} style={styles.directionButton}>
                {relation.relationDirection === 'one-way' ? '→' : '↔'}
              </button>
            </div>

            <label>関係線色</label>
            <select
              value={relation.relationColor}
              onChange={(e) => handleRelationChange(index, 'relationColor', e.target.value)}
              style={styles.input}
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value} style={{ backgroundColor: option.value }}>
                  {option.label}
                </option>
              ))}
            </select>

            <label>関係説明</label>
            <textarea
              value={relation.relationDescription}
              onChange={(e) => handleRelationChange(index, 'relationDescription', e.target.value)}
              style={styles.textarea}
            />

            {relations.length > 1 && index > 0 && (
              <button onClick={() => handleRemoveRelation(index)} style={styles.removeRelationButton}>
                削除
              </button>
            )}
          </div>
        );
      })}

      <button onClick={handleAddRelation} style={styles.addRelationButton}>
        関係を追加
      </button>

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
  relationForm: {
    marginBottom: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    height: '80px',
    margin: '8px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
    minHeight: '50px',
    minWidth: '100%',
  },
  addRelationButton: {
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '20px',
  },
  removeRelationButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  directionButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
  },
  directionButton: {
    fontSize: '20px',
    padding: '10px',
    cursor: 'pointer',
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '5px',
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '200px',
    marginTop: '30px',
  },
};

export default CreateRelations;
