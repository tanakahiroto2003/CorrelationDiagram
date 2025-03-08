import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadImage, createNode } from './api';

function CreateNode() {
  const [Nodes, setNodes] = useState([
    { NodeName: '', NodeColor: '#000000', description: '', image: '', imagePreview: '' }
  ]);
  const [listId, setListId] = useState('');
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
    const storedListId = sessionStorage.getItem('selectedListId');
    if (storedListId) {
      setListId(storedListId);
    }
  }, []);

  const handleAddNode = () => {
    setNodes([...Nodes, { NodeName: '', NodeColor: '#000000', description: '', image: '', imagePreview: '' }]);
  };

  const handleRemoveNode = (NodeIndex) => {
    setNodes(Nodes.filter((_, index) => index !== NodeIndex));
  };

  const handleChange = (index, field, value) => {
    const updatedNodes = [...Nodes];
    updatedNodes[index][field] = value;
    if (field === 'image' && value) {
      updatedNodes[index].imagePreview = URL.createObjectURL(value);
    }
    setNodes(updatedNodes);
  };

  const handleSubmit = async () => {
    for (const Node of Nodes) {
      if (!Node.NodeName.trim()) {
        setErrorMessage('ノード名は必須です。');
        return;
      }
    }

    try {
      for (let i = 0; i < Nodes.length; i++) {
        const Node = Nodes[i];
        if (Node.image instanceof File) {
          Node.image = await uploadImage(Node.image);
        }
      }

      for (const Node of Nodes) {
        await createNode(listId, Node);
      }

      navigate('/CorrelationDiagram');
    } catch (error) {
      console.error('エラー:', error);
      setErrorMessage('ノード作成中にエラーが発生しました');
    }
  };

  return (
    <div style={styles.app}>
      {errorMessage && <div style={{ color: 'red', marginBottom: '20px' }}>{errorMessage}</div>}

      {Nodes.map((Node, NodeIndex) => (
        <div style={styles.NodeForm} key={NodeIndex}>
          <h1>ノード作成</h1>

          <label>ノード名</label>
          <input
            type="text"
            value={Node.NodeName}
            onChange={(e) => handleChange(NodeIndex, 'NodeName', e.target.value)}
            style={styles.input}
          />

          <label>ノードカラー</label>
          <select
            value={Node.NodeColor}
            onChange={(e) => handleChange(NodeIndex, 'NodeColor', e.target.value)}
            style={styles.input}
          >
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value} style={{ backgroundColor: option.value }}>
                {option.label}
              </option>
            ))}
          </select>

          <label>説明</label>
          <textarea
            value={Node.description}
            onChange={(e) => handleChange(NodeIndex, 'description', e.target.value)}
            style={styles.textarea}
          />

          <label>表示する画像</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={(e) => handleChange(NodeIndex, 'image', e.target.files[0])}
            style={styles.input}
          />

          {Node.imagePreview && (
            <div style={styles.imagePreviewContainer}>
              <img src={Node.imagePreview} alt="Image preview" style={styles.imagePreview} />
            </div>
          )}

          {NodeIndex > 0 && (
            <button
              onClick={() => handleRemoveNode(NodeIndex)}
              style={styles.removeNodeButton}
            >
              削除
            </button>
          )}
        </div>
      ))}

      <button onClick={handleAddNode} style={styles.addNodeButton}>
        新しいノードを追加
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
  NodeForm: {
    marginBottom: '30px',
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
  addNodeButton: {
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '200px',
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
  removeNodeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    marginTop: '10px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  imagePreviewContainer: {
    marginTop: '10px',
    textAlign: 'center',
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '8px',
  }
};

export default CreateNode;
