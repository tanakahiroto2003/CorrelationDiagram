import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateCorrelationDiagramName } from './api';

const UpdateListName = () => {
  const [newListName, setNewListName] = useState('');
  const navigate = useNavigate();

  const listId = sessionStorage.getItem('selectedListId');
  
  if (!listId) {
    return <div>リストIDが見つかりません。再度試してください。</div>;
  }

  const handleUpdate = async () => {
    if (!newListName.trim()) {
        navigate('/CorrelationDiagramList');
    }

    try {
      await updateCorrelationDiagramName(listId, newListName);
      navigate('/CorrelationDiagramList');
    } catch (error) {
      console.error('更新に失敗しました', error);
      alert('リスト名の更新に失敗しました');
    }
  };

  return (
    <div style={styles.container}>
      <h2>相関図リスト名の変更</h2>
      <input
        type="text"
        placeholder="新しいリスト名"
        value={newListName}
        onChange={(e) => setNewListName(e.target.value)}
        style={styles.input}
      />
      <div style={styles.buttonContainer}>
        <button onClick={handleUpdate} style={styles.updateButton}>更新</button>
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
  updateButton: {
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

export default UpdateListName;
