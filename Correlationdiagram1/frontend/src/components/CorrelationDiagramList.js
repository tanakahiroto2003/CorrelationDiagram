import React, { useEffect, useState } from 'react';
import { SerchList, deleteCorrelationDiagram} from './api';
import { Link, useNavigate } from 'react-router-dom';

const CorrelationDiagramList = ({ userId }) => {
  const [diagrams, setDiagrams] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDiagrams = async () => {
      try {
        const data = await SerchList(userId);
        setDiagrams(data);
      } catch (error) {
        console.error('相関図リストの取得に失敗しました');
      }
    };
    fetchDiagrams();
  }, [userId]);

  const handleItemClick = (listId, listName) => {
    sessionStorage.setItem('selectedListId', listId);
    sessionStorage.setItem('selectedListName', listName);
  };

  const handleDelete = async (listId, listName) => {

    const confirmDelete = window.confirm(`相関図${listName}を削除しますか？ この操作は取り消せません。`);

    if (confirmDelete) {
      try {
        await deleteCorrelationDiagram(listId);
        alert('リストが削除されました');
        const data = await SerchList(userId);
        setDiagrams(data);
      } catch (error) {
        alert('リストの削除に失敗しました');
      }
    }
  };

  const handleEdit = (listId, listName) => {
    sessionStorage.setItem('selectedListId', listId);
    sessionStorage.setItem('selectedListName', listName);
    navigate(`/UpdateListName`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>相関図リスト</h2>
      {diagrams.length > 0 ? (
        <ul style={styles.list}>
          {diagrams.map((diagram) => (
            <li key={diagram.ListID} style={styles.listItem}>
              <Link
                to="/CorrelationDiagram"
                style={styles.link}
                onClick={() => handleItemClick(diagram.ListID, diagram.ListName)}
              >
                {diagram.ListName}
              </Link>
              <div style={styles.actions}>
                <button
                  onClick={() => handleEdit(diagram.ListID, diagram.ListName)}
                  style={styles.editButton}
                >
                  名前変更
                </button>
                <button
                  onClick={() => handleDelete(diagram.ListID, diagram.ListName)}
                  style={styles.deleteButton}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>相関図がありません。</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
    flex: 1,
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default CorrelationDiagramList;
