import React, { useState } from 'react';
import { loginUser } from './api';
import { useNavigate } from 'react-router-dom';
import eyeIcon from './img/eye-solid.svg';
import eyeSlashIcon from './img/eye-slash-solid.svg';
import { Link } from 'react-router-dom';

const Login = ({ setUserId }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      console.log(data.message);
      sessionStorage.setItem('userId', data.user_id);
      setUserId(data.user_id);
      navigate('/CorrelationDiagramList');
    } catch (error) {
      setErrorMessage(error.message || 'ログインに失敗しました');
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div style={styles.container}>
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <div style={styles.passwordContainer}>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.passwordInput}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            style={styles.toggleButton}
          >
            <img
              src={isPasswordVisible ? eyeIcon : eyeSlashIcon}
              alt={isPasswordVisible ? '非表示' : '表示'}
              style={styles.icon}
            />
          </button>
        </div>
        <button type="submit" style={styles.button}>
          ログイン
        </button>
        <p>新規登録がまだの方は<Link to="/register">こちら</Link></p>
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '300px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
  },
  toggleButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
};

export default Login;
