import React, { useEffect, useState } from 'react';
import './styles/App.css'; // Importing global CSS
import fetchArticles from './components/fetchArticle';
import CategoryFilter from './components/CategoryFilter';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from './firebaseConfig';
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Favorites from './components/Favorites'; // New Favorites component

const db = getFirestore(); // Moved db initialization outside functions to avoid re-initializing

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('latest news'); // Default query value
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false); // For managing loading state when saving favorites
  const navigate = useNavigate();

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  // Fetch articles when the component mounts or query changes
  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      console.log("Fetching articles with query:", query);
      try {
        let searchTerm = query;
        const favoriteCategories = await getFavoriteCategories();
        if (favoriteCategories.length > 0) {
          searchTerm = favoriteCategories.join(" OR ");
        }

        const fetchedArticles = await fetchArticles(searchTerm);
        console.log("Fetched Articles: ", fetchedArticles);
        setArticles(fetchedArticles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [query, user]);

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value.trim();
    if (searchTerm) {
      console.log("Search Term: ", searchTerm);
      setQuery(searchTerm);
    } else {
      console.log("No search term entered");
    }
  };

  // Handle Category Change
  const handleCategoryChange = (category) => {
    if (!category) {
      setQuery('latest news'); // Default query when no category is selected
    } else {
      setQuery(category.toLowerCase());
    }
  };

  // Handle Sign-Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        favorites: [] // Initialize with an empty array
      });

      navigate("/");
    } catch (error) {
      console.error("Error during sign-up:", error.message);
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  // Save Favorite Article
  const saveFavoriteArticle = async (article) => {
    if (!user) return;

    setFavoriteLoading(true); // Set loading to true while saving
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        favorites: arrayUnion({
          title: article.title,
          description: article.description,
          url: article.url,
          category: article.category || 'Uncategorized' // Handle missing categories
        })
      });
      console.log('Article added to favorites!');
    } catch (error) {
      console.error("Error saving favorite article:", error.message, error);
    } finally {
      setFavoriteLoading(false); // Set loading to false after saving
    }
  };

  // Get Favorite Categories
  const getFavoriteCategories = async () => {
    if (!user) return [];

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const favorites = userSnap.data().favorites || [];
      const favoriteCategories = favorites.map(article => article.category);
      return [...new Set(favoriteCategories)];
    }

    return [];
  };

  return (
    <div>
      <h1>Market News Aggregator</h1>

      {/* Authentication UI */}
      {!user ? (
        <div>
          <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
          <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
            {isSignUp && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Switch to Login" : "Switch to Sign Up"}
          </button>
        </div>
      ) : (
        <div>
          <div>
            <h2>Welcome, {user.email}</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* Links to Home and Favorites */}
          <nav>
            <Link to="/">Home</Link>
            <Link to="/favorites">Favorites</Link>
          </nav>

          <Routes>
            {/* Home Route */}
            <Route
              path="/"
              element={
                <div>
                  {/* Search Form */}
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      name="search"
                      placeholder="Search articles..."
                      style={{ padding: '10px', fontSize: '16px' }}
                    />
                    <button type="submit" style={{ padding: '10px', marginLeft: '5px' }}>
                      Search
                    </button>
                  </form>

                  {/* Updated Category Filter */}
                  <CategoryFilter onCategoryChange={handleCategoryChange} />

                  {/* Articles and Favorites UI */}
                  {loading ? (
                    <p>Getting some spicy news for you...</p>
                  ) : (
                    <div>
                      {Array.isArray(articles) && articles.length > 0 ? (
                        <ul>
                          {articles.map((article, index) => (
                            <li key={index}>
                              <h2>{article.title}</h2>
                              <p>{article.description}</p>
                              <a href={article.url} target="_blank" rel="noopener noreferrer">
                                Read more
                              </a>
                              <button
                                onClick={() => saveFavoriteArticle(article)}
                                disabled={favoriteLoading}
                              >
                                {favoriteLoading ? "Saving..." : "Add to Favorites"}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No articles found for "{query}".</p>
                      )}
                    </div>
                  )}
                </div>
              }
            />

            {/* Favorites Route */}
            <Route path="/favorites" element={<Favorites user={user} />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
