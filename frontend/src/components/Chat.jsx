import React, { useState } from 'react';
import { Upload, Send, FileText, MessageCircle, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const PdfQaBot = () => {
    const API_URL = import.meta.env.VITE_API_URL
    const [file, setFile] = useState(null);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isQuerying, setIsQuerying] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedTypes = ['application/pdf', 'text/plain', 'text/csv'];
        const allowedExtensions = ['.pdf', '.txt', '.csv'];

        if (selectedFile) {
            const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));

            if (allowedTypes.includes(selectedFile.type) || allowedExtensions.includes(fileExtension)) {
                setFile(selectedFile);
                setUploadStatus(null); // Reset upload status when new file is selected
            } else {
                alert('Please select a valid PDF, TXT, or CSV file');
            }
        }
    };

    const handleReplaceFile = () => {
        setFile(null);
        setUploadStatus(null);
        setMessages([]); // Clear chat history when replacing file
        // Trigger file input click
        document.getElementById('file-input').click();
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a document file first');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('success');
                setMessages([]);
            } else {
                setUploadStatus('error');
                console.error('Upload failed');
            }
        } catch (error) {
            setUploadStatus('error');
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleQuery = async () => {
        if (!query.trim()) return;

        const userMessage = { type: 'user', content: query };
        setMessages(prev => [...prev, userMessage]);
        setIsQuerying(true);

        try {
            const response = await fetch(`${API_URL}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                const botMessage = {
                    type: 'bot',
                    content: data.data || 'No response received'
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                const errorMessage = {
                    type: 'error',
                    content: 'Failed to get response. Please try again.'
                };
                setMessages(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            const errorMessage = {
                type: 'error',
                content: 'Network error. Please check your connection and try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
            console.error('Query error:', error);
        } finally {
            setIsQuerying(false);
            setQuery('');
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        padding: '1rem'
    };

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    };

    const headerStyle = {
        backgroundColor: '#4f46e5',
        color: 'white',
        padding: '1rem'
    };

    const buttonStyle = {
        backgroundColor: '#4f46e5',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.2s'
    };

    const disabledButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none'
    };

    const messageStyle = {
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '12px',
        marginBottom: '8px'
    };

    const userMessageStyle = {
        ...messageStyle,
        backgroundColor: '#4f46e5',
        color: 'white',
        marginLeft: 'auto'
    };

    const botMessageStyle = {
        ...messageStyle,
        backgroundColor: '#f3f4f6',
        color: '#1f2937'
    };

    const errorMessageStyle = {
        ...messageStyle,
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca'
    };

    return (
        <div style={containerStyle}>
            <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
                {/* Header */}
                <Header />

                {/* Upload Section */}
                <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                        <Upload size={20} style={{ marginRight: '8px' }} />
                        Upload Document (PDF, CSV, TXT)
                    </h2>

                    <div style={{ display: 'flex', flexDirection: window.innerWidth < 640 ? 'column' : 'row', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                id="file-input"
                                type="file"
                                accept=".pdf,.txt,.csv"
                                onChange={handleFileChange}
                                style={{
                                    ...inputStyle,
                                    border: '2px dashed #d1d5db',
                                    padding: '16px'
                                }}
                            />
                            {file && (
                                <p style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                                    Selected: {file.name}
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexDirection: window.innerWidth < 640 ? 'column' : 'row' }}>
                            {uploadStatus === 'success' && (
                                <button
                                    onClick={handleReplaceFile}
                                    style={{
                                        ...buttonStyle,
                                        backgroundColor: '#059669',
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#047857';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#059669';
                                    }}
                                >
                                    <FileText size={16} />
                                    Replace File
                                </button>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={!file || isUploading || uploadStatus === 'success'}
                                style={!file || isUploading || uploadStatus === 'success' ? disabledButtonStyle : buttonStyle}
                                onMouseOver={(e) => {
                                    if (!(!file || isUploading || uploadStatus === 'success')) {
                                        e.target.style.backgroundColor = '#4338ca';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!(!file || isUploading || uploadStatus === 'success')) {
                                        e.target.style.backgroundColor = '#4f46e5';
                                    }
                                }}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        Uploading...
                                    </>
                                ) : uploadStatus === 'success' ? (
                                    <>
                                        <CheckCircle size={16} />
                                        Uploaded
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        Upload Document
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Upload Status */}
                    {uploadStatus && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '12px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: uploadStatus === 'success' ? '#f0fdf4' : '#fef2f2',
                            color: uploadStatus === 'success' ? '#166534' : '#dc2626',
                            border: `1px solid ${uploadStatus === 'success' ? '#bbf7d0' : '#fecaca'}`
                        }}>
                            {uploadStatus === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {uploadStatus === 'success'
                                ? 'Document uploaded successfully! You can now ask questions.'
                                : 'Upload failed. Please try again.'
                            }
                        </div>
                    )}
                </div>

                {/* Chat Section */}
                <div style={cardStyle}>
                    <div style={headerStyle}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center' }}>
                            <MessageCircle size={20} style={{ marginRight: '8px' }} />
                            Ask Questions
                        </h2>
                    </div>

                    {/* Messages */}
                    <div style={{ height: '400px', overflowY: 'auto', padding: '1rem' }}>
                        {messages.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem 0' }}>
                                <MessageCircle size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
                                <p>Upload a document (PDF, CSV, or TXT) and start asking questions!</p>
                            </div>
                        ) : (
                            <div>
                                {messages.map((message, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start' }}>
                                        <div style={
                                            message.type === 'user'
                                                ? userMessageStyle
                                                : message.type === 'error'
                                                    ? errorMessageStyle
                                                    : botMessageStyle
                                        }>
                                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isQuerying && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <div style={botMessageStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                                Thinking...
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Query Input */}
                    <div style={{ borderTop: '1px solid #e5e7eb', padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask a question about the uploaded document..."
                                style={{ ...inputStyle, flex: 1 }}
                                disabled={isQuerying}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleQuery(e);
                                    }
                                }}
                            />
                            <button
                                onClick={handleQuery}
                                disabled={!query.trim() || isQuerying}
                                style={!query.trim() || isQuerying ? disabledButtonStyle : buttonStyle}
                                onMouseOver={(e) => {
                                    if (!(!query.trim() || isQuerying)) {
                                        e.target.style.backgroundColor = '#4338ca';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!(!query.trim() || isQuerying)) {
                                        e.target.style.backgroundColor = '#4f46e5';
                                    }
                                }}
                            >
                                {isQuerying ? (
                                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <Send size={16} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default PdfQaBot;