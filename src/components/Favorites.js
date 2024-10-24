import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

const Favorites = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setFavorites(userSnap.data().favorites || []);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return <p>Loading your favorites...</p>;
  }

  return (
    <div>
      <h2>Your Favorite Articles</h2>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((article, index) => (
            <li key={index}>
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no favorites yet!</p>
      )}
    </div>
  );
};

export default Favorites;
