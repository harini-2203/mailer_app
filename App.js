import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState([]);

    // Handle file changes and add files to state
    const handleFileChange = (e) => {
        setAttachments([...attachments, ...Array.from(e.target.files)]);
    };

    // Handle removing a specific file from the attachments list
    const removeAttachment = (indexToRemove) => {
        setAttachments(attachments.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('content', content);
        attachments.forEach(file => {
            formData.append('attachments', file);
        });

        try {
            const response = await axios.post('http://localhost:5000/send-email', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data.message);
            setEmail('');
            setSubject('');
            setContent('');
            setAttachments([]);
            setTimeout(() => {
                window.location.reload(); // Refresh the page after 5 seconds
            }, 5000);
        } catch (error) {
            alert('Error sending email: ' + error.response.data.message);
        }
    };

    return (
        <div className="app-container">
            <h1>Send Email with Attachments</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Recipient Email:</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Recipient Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="subject">Subject:</label>
                <input
                    type="text"
                    id="subject"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />

                <label htmlFor="content">Email Content:</label>
                <textarea
                    id="content"
                    placeholder="Email Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                <label htmlFor="attachments">Attachments:</label>
                <input
                    type="file"
                    id="attachments"
                    onChange={handleFileChange}
                    multiple
                />

                {/* Display attached files with remove option */}
                <ul>
                    {attachments.map((file, index) => (
                        <li key={index}>
                            {file.name}
                            <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                style={{
                                    marginLeft: '10px',
                                    backgroundColor: '#ff4d4d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '2px 8px',
                                    borderRadius: '5px',
                                    cursor: 'pointer'
                                }}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>

                <button type="submit">Send Email</button>
            </form>
        </div>
    );
};

export default App;
