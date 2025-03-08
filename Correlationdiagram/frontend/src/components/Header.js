import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ListName = sessionStorage.getItem('selectedListName');

  const currentPath = location.pathname;
  const listCreateButton = currentPath === '/CorrelationDiagramList';
  const nodeCreatemenu = currentPath === '/CorrelationDiagram';

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const SelectList = () => {
    navigate('CorrelationDiagramList')
  }

  const SelectLogin = () => {
    navigate('login')
  }

  const RegisterClick = () => {
    navigate('/createCorrelationDiagramList');
  };

  const CreateNode = () => {
    navigate('/CreateNode');
    setIsMenuOpen(false);
  };

  const CreateRelation = () => {
    navigate('/CreateRelation');
    setIsMenuOpen(false);
  };
  
  const CreateAI = () => {
    navigate('/CreateAI');
    setIsMenuOpen(false);
  }

  return (
    <header style={styles.header}>
      <div style={styles.leftContainer}>
        {nodeCreatemenu && ListName && (
          <div style={styles.ListName}>
            編集中：{ListName}
            <button
                style={styles.menuButton}
                onClick={SelectList}
              >
                終了
            </button>
          </div>
        )}
        {listCreateButton && (
          <button style={styles.menuButton} onClick={SelectLogin}>
            ログイン画面
          </button>
        )}
      </div>
      <h1 style={styles.title}>AI相関図作成</h1>
      <div style={styles.rightContainer}>
        {listCreateButton && (
          <div>
            <button style={styles.menuButton} onClick={RegisterClick}>
              リスト作成
            </button>
          </div>
        )}
        {nodeCreatemenu && (
          <div style={styles.menuContainer}>
            <button
              style={styles.menuButton}
              onClick={MenuToggle}
            >
              作成
            </button>
            {isMenuOpen && (
              <div style={styles.dropdownMenu}>
                <button style={styles.menuItem} onClick={CreateNode}>
                  ノード作成
                </button>
                <button style={styles.menuItem} onClick={CreateRelation}>
                  関係線作成
                </button>
                <button style={styles.menuItem} onClick={CreateAI}>
                  AI作成
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#4CAF50',
    padding: '10px 20px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    backgroundColor: '#fff',
    color: '#4CAF50',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    padding: '10px 20px',
    borderRadius: '5px',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: '50px',
    right: '0',
    width: '180px',
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  },
  menuItem: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: '2px solid #9FD9A1',
    textAlign: 'left',
    fontSize: '16px',
    width: '100%',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease',
  },
  ListName: {
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default Header;
