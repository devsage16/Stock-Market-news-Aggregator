import React from 'react';


const Article = ({ title, description, url }) => {
    return (
        <div>
            <h2>{title}</h2>
            <p>{description}</p>
            <a href={url} target="_blank" rel="noopener noreferrer">Read more</a>
        </div>
    );
};

export default Article;
