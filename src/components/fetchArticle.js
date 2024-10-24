const API_KEY = '31cde3cb67aae91ba0e38eec2fcb49ee'; // Make sure your API key is here

const fetchArticles = async (query) => {
  const url = `https://gnews.io/api/v4/search?q=${query}&token=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.articles; // Return the articles
};

export default fetchArticles;
