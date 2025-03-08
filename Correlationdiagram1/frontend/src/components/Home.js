import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h2>相関図を簡単に作成しましょう！</h2>
      <p>人物や物事の関係性を視覚化する相関図を簡単に作成・共有できるツールです。</p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleLogin}>
          ログイン
        </button>
        <button style={styles.button} onClick={handleRegister}>
          新規登録
        </button>
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
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '20px',
  },
  button: {
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '15px 32px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    width: '200px',
    textAlign: 'center',
  },
};

export default Home;
