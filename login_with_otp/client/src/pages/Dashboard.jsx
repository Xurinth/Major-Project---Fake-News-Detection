import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Dashboard.css";
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [predictionResult, setPredictionResult] = useState(null);

    useEffect(() => {
        const userValid = () => {
            let token = localStorage.getItem("userdbtoken");
            if (!token) {
                navigate("*");
            }
        };
        userValid();
    }, [navigate]);

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleSearch = async () => {
        try {
            // Fetch and preprocess data
            const response = await axios.get('http://localhost:5000/fetch_and_preprocess');
            const preprocessedData = response.data;

            // Find the matching title in the preprocessed data
            const matchingData = preprocessedData.find(item => item.title === text);

            if (matchingData) {
                // If a match is found, set the prediction result
                setPredictionResult({
                    text: matchingData.title,
                    predicted_class: matchingData.predicted_class === 0 ? 'True' : 'Fake'
                });
            } else {
                // If no match is found, make a prediction request
                try {
                    const predictionResponse = await axios.post('http://localhost:5000/predict', { text });
                    if (predictionResponse.data.error) {
                        setPredictionResult({ error: predictionResponse.data.error });
                    } else {
                        setPredictionResult({
                            text: predictionResponse.data.text,
                            predicted_class: predictionResponse.data.predicted_class === 0 ? 'True' : 'Fake'
                        });
                    }
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        setPredictionResult({ error: error.response.data.error });
                    } else {
                        console.error('Error:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="section">
            <div className="container">
                <div className="row full-height justify-content-center">
                    <div className="col-12 text-center align-self-center py-5">
                        <div className="section pb-5 pt-5 pt-sm-2 text-center">
                            <div className="card-3d-wrap mx-auto">
                                <div className="card-3d-wrapper">
                                    <div className="card-front">
                                        <div className="center-wrap">
                                            <div className="section text-center">
                                                <h4 className="mb-4 pb-3">Dashboard</h4>
                                                <div className="search-container">
                                                    <input
                                                        type="text"
                                                        name="Title"
                                                        className="form-style"
                                                        placeholder="Enter the title"
                                                        autoComplete="off"
                                                        value={text}
                                                        onChange={handleTextChange}
                                                    />
                                                    <button className="search-btn" onClick={handleSearch}>
                                                        <FaSearch className="search-icon" />
                                                    </button>
                                                </div>
                                                {predictionResult && (
                                                    <div className="prediction-result">
                                                        {predictionResult.error ? (
                                                            <p>{predictionResult.error}</p>
                                                        ) : (
                                                            <>
                                                                <h5>Prediction Result:</h5>
                                                                <p>Text: {predictionResult.text}</p>
                                                                <p>Predicted Class: {predictionResult.predicted_class}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-back">
                                        {/* Add content for card back if needed */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;