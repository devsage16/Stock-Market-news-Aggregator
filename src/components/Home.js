// src/components/Home.js
import React, { useEffect, useState } from 'react';
import fetchArticles from './fetchArticle';
import CategoryFilter from './CategoryFilter';

const Home = () => {
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('latest news'); 

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const fetchedArticles = await fetchArticles(query);
        setArticles(fetchedArticles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.search.value.trim();
    if (searchTerm) {
      setQuery(searchTerm);
    }
  };

  const handleCategoryChange = (category) => {
    setQuery(category.toLowerCase());
  };

  return (
    <div>
      <h1>Market News Aggregator</h1>
      
      {/* Search Bar */}
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

      {/* Category Filter */}
      <CategoryFilter onCategoryChange={handleCategoryChange} />

      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div>
          {articles.length > 0 ? (
            <ul>
              {articles.map((article, index) => (
                <li key={index}>
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No articles found for "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
