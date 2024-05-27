import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from './Loader';

const getExcerpt = (content, length = 100) => {
  return content.length > length ? content.substring(0, length) + '...' : content;
};

const SearchResults = () => {
  const { cat, search } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/${cat}/search/${search}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setResults(response.data[cat]);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : 'Error fetching search results');
        setLoading(false);
      }
    };

    fetchResults();
  }, [cat, search]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="ml-[19%] mx-8 p-8">
      <h1 className="text-xl font-bold mb-4">Search Results for "{search}" in {cat}</h1>
      <ul>
        {results.length > 0 ? (
          results.map((result) => (
            <li key={result.id} className="mb-2">
              {cat === 'channels' && (
                <div className="bg-white shadow-lg rounded-lg p-6">
                  <Link to={`/channels/${result.id}`} className="text-3xl font-bold text-gray-800">{result.name}</Link>
                  <p className="mt-2 text-gray-600">{result.description}</p>
                  <div className="mt-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      Status: {result.status}
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      Created at: {new Date(result.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
              {cat === 'discussions' && (
                <div className="mb-4 p-4 border rounded bg-white shadow">
                   <Link to={`/discussion/${result.id}`} className="text-xl font-semibold">{result.title}</Link>
                  <div className="my-5">
                    {getExcerpt(result.content)} <Link className="text-red-500" to={`/discussion/${result.id}`}>Read More ...</Link>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(result.created_at).toLocaleString()}</p>
                </div>
              )}
              {cat === 'groups' && (
                <div className="bg-white shadow rounded-lg p-6">
                  <Link to={`/groups/${result.id}`} className="text-3xl font-bold text-gray-800">{result.name}</Link>
                  <p className="mt-2 text-gray-600">{result.description}</p>
                  <div className="mt-4">
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      Created at: {new Date(result.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <div>No results found</div>
        )}
      </ul>
    </div>
  );
};

export default SearchResults;
