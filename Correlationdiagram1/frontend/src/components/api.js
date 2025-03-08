const BASE_URL = process.env.REACT_APP_BASE_URL;
const FLASK_URL = process.env.REACT_APP_FLASK_APP_BASE_URL;

//登録
export const registerUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '登録に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('登録に失敗しました', error);
    throw error;
  }
};

//ログイン
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'ログインに失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('ログインに失敗しました', error);
    throw error;
  }
};

//相関図リスト取得
export const SerchList = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/SearchCorrelationDiagramList?userId=${userId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '相関図リストの取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('相関図リストの取得に失敗しました', error);
    throw error;
  }
};

//相関図作成
export const CreateCorrelationDiagram = async (listName, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/CreateCorrelationDiagramList`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listName, userId }),
    });
    return await response.json();
  } catch (error) {
    console.error('相関図の作成に失敗しました', error);
    throw error;
  }
};

//相関図名更新
export const updateCorrelationDiagramName = async (listId, newListName) => {
  try {
    const response = await fetch(`${BASE_URL}/api/UpdateCorrelationDiagramList/${listId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({ newListName }),
    });

    if (!response.ok) {
      throw new Error('更新に失敗しました');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('APIエラー:', error);
    throw new Error('リスト名の更新に失敗しました');
  }
};

//相関図削除
export const deleteCorrelationDiagram = async (listId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/UpdateCorrelationDiagramList/${listId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('削除に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('APIエラー:', error);
    throw new Error('リストの削除に失敗しました');
  }
};

//画像アップロード
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('画像アップロードに失敗しました');
  }

  const data = await response.json();
  return data.imageUrl;
};

//ノード作成
export const createNode = async (listId, Node) => {

  const response = await fetch(`${BASE_URL}/api/createNode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ListID: listId,
      Node_Name: Node.NodeName,
      Node_Color: Node.NodeColor,
      Node_Description: Node.description,
      Node_Image: Node.image,
    }),
  });

  if (!response.ok) {
    throw new Error('ノード作成に失敗しました');
  }

  const data = await response.json();
  return data;
};

//関係線作成
export const createNodeRelation = async (listId, relation) => {
  const response = await fetch(`${BASE_URL}/api/createNodeRelation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ListID: listId,
      NodeID: relation.NodeID,
      TargetNodeID: relation.targetNodeID,
      NodeRelation_Direction: relation.relationDirection,
    }),
  });

  if (!response.ok) {
    throw new Error('関係性の作成に失敗しました');
  }

  const data = await response.json();
  return data;
};

//関係線詳細
export const createNodeRelationLine = async (relationLine) => {
  const response = await fetch(`${BASE_URL}/api/createNodeRelationLine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(relationLine),
  });

  if (!response.ok) {
    throw new Error('関係線の作成に失敗しました');
  }

  const data = await response.json();
  return data;
};

//ノード取得
export const SerchNodes = async () => {
  const response = await fetch(`${BASE_URL}/api/Nodes`);
  if (!response.ok) {
    throw new Error('ノードの取得に失敗しました');
  }
  const data = await response.json();
  return data;
};

//人物抽出
export const extractPeople = async (text) => {
  try {
    const response = await fetch(`${FLASK_URL}/extractNode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '人物名抽出エラー');
    }

    const data = await response.json();
    return data.people || [];
  } catch (error) {
    throw new Error(error.message || '人物名の抽出中にエラーが発生しました');
  }
};

//関係抽出
export const extractRelations = async (text, people) => {
  try {
    const response = await fetch(`${FLASK_URL}/extractRelations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, people }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '関係性抽出エラー');
    }

    const data = await response.json();
    return Array.isArray(data.relations) ? data.relations : [];
  } catch (error) {
    throw new Error(error.message || '関係性の抽出中にエラーが発生しました');
  }
};