import React, { useState } from 'react';
import { CreateCorrelationDiagram } from './api';
import { useNavigate } from 'react-router-dom';

const CreateCorrelationDiagramList = ({ userId }) => {
  const [diagramName, setDiagramName] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!diagramName.trim()) {
      alert('相関図の名前を入力してください');
      return;
    }
    
    try {
      await CreateCorrelationDiagram(diagramName, userId);
      navigate('/CorrelationDiagramList');
    } catch (error) {
      console.error('相関図の作成に失敗しました');
    }
  };

  return (
    <div style={styles.container}>
      <h2>相関図の作成</h2>
      <input
        type="text"
        placeholder="相関図の名前を入力"
        value={diagramName}
        onChange={(e) => setDiagramName(e.target.value)}
        style={styles.input}
      />
      <div style={styles.buttonContainer}>
        <button onClick={handleCreate} style={styles.createButton}>作成</button>
        <button onClick={() => navigate('/CorrelationDiagramList')} style={styles.cancelButton}>キャンセル</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
    margin: '0',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '50%',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '50%',
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
};

export default CreateCorrelationDiagramList;
