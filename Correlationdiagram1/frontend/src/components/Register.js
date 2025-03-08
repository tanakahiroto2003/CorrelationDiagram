import React, { useState } from 'react';
import { registerUser } from './api';
import { useNavigate } from 'react-router-dom';
import eyeIcon from './img/eye-solid.svg';
import eyeSlashIcon from './img/eye-slash-solid.svg';
import { Link } from 'react-router-dom';

const Register = ({ setUserId }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrorMessage('無効なメールアドレスです');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('パスワードは8文字以上、英字と数字を含む必要があります');
      return;
    }

    try {
      const data = await registerUser(email, password);
      console.log(data.message);
      sessionStorage.setItem('userId', data.user_id);
      setUserId(data.user_id);
      navigate('/CorrelationDiagramList');
    } catch (error) {
      setErrorMessage('登録に失敗しました。もう一度お試しください。');
      console.error(error);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div style={styles.container}>
      <h2>新規登録</h2>
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
            minLength={8}
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
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        <button type="submit" style={styles.button}>
          登録
        </button>
        <p>ログインの方は<Link to="/login">こちら</Link></p>
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
};

export default Register;
