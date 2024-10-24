import React, { useEffect, useState } from 'react';
import axios from 'axios';

const fetchArticles = async (query) => {
    const apiKey = '31cde3cb67aae91ba0e38eec2fcb49ee';
    const response = await axios.get(`https://gnews.io/api/v4/search?q=${query}&from=${startDate}&to=${endDate}&token=${API_KEY}
`);
    return response.data.articles;
};

const NewsList = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            const articlesData = await fetchArticles('stock market');
            setArticles(articlesData);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <p>Getting some spicy news for you...</p>;

    return (
        <div>
            {articles.map(article => (
                <div key={article.url}>
                    <h2>{article.title}</h2>
                    <p>{article.description}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
            ))}
        </div>
    );
};

export default NewsList;
