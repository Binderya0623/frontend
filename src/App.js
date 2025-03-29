import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function EmailSender() {
  const MAILER_SERVICE_IP = "54.95.220.206";
  const FILEMANAGER_SERVICE_IP = "52.0.108.242";
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [fileType, setFileType] = useState('png');
  const [searchQuery, setSearchQuery] = useState('');
  const [emails, setEmails] = useState([]);
  const [previewContent, setPreviewContent] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, [searchQuery]);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`https://${MAILER_SERVICE_IP}/emails?search=${searchQuery}`);
      setEmails(response.data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const generateEmailBody = async () => {
    try {
      const images = await axios.get(`https://${FILEMANAGER_SERVICE_IP}/list-files?folder=${subject}&fileType=${fileType}`);
      return images.data.map(img => `
        <div style='text-align:center; margin:20px;'>
          <img src='${img}' style='
            border-radius:15px;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
            max-width: 100%;
            height: auto;
            border: 2px solid #fff;
          '/>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error generating email body:', error);
      return '';
    }
  };

  const handlePreview = async () => {
    if (!email || !subject) {
      alert('Please fill out both email and subject fields.');
      return;
    }
    const body = await generateEmailBody();
    setPreviewContent({ subject, to: email, body });
    setShowPreview(true);
  };
  
  const sendEmail = async () => {
    if (!email || !subject) {
      alert('Please fill out both email and subject fields.');
      return;
    }
    const body = await generateEmailBody();
    try {
      await axios.post(`https://${MAILER_SERVICE_IP}/send-email`, { 
        to: email, 
        subject, 
        body 
      });
      alert('🎉 Email sent successfully!');
      fetchEmails();
      setShowPreview(false);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email. Please try again later.');
    }
  };

  return (
    <div className='email-container'>
      {/* Preview Modal - Updated */}
      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <h3>🌸 Email Preview</h3>
            <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>
            <div className="preview-header">
              <p><span className="preview-label">To:</span> {previewContent.to}</p>
              <p><span className="preview-label">Subject:</span> {previewContent.subject}</p>
            </div>
            <div 
              className="email-body-preview"
              dangerouslySetInnerHTML={{ __html: previewContent.body }}
            />
            <div className="preview-actions">
              <button className="send-button" onClick={sendEmail}>Send Now 🎀</button>
              <button className="cancel-button" onClick={() => setShowPreview(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <h1 className="app-title">📩 Pink Mail Express</h1>
      
      <div className="email-form">
        <div className="form-section">
          <h2 className="section-title">💌 Compose Email</h2>
          <div className="form-grid compact">
            <div className="input-group">
              <label>📨 Recipient Email</label>
              <input 
                type="email" 
                placeholder="bestfriend@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>📝 Subject</label>
              <input 
                type="text" 
                placeholder="Cute Puppy Pics!" 
                value={subject} 
                onChange={e => setSubject(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>🖼️ Image Format</label>
              <select value={fileType} onChange={e => setFileType(e.target.value)}>
                <option value="png">PNG 🎨</option>
                <option value="jpeg">JPEG 🌸</option>
                <option value="jpg">JPG :33</option>
              </select>
            </div>
          </div>
          <div className="button-group compact">
            <button className="preview-button" onClick={handlePreview}>👀 Preview</button>
            <button className="send-button" onClick={sendEmail}>🚀 Send</button>
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">📚 Email History</h2>
          <div className="search-group">
            <input 
              type="text" 
              placeholder="Search past emails..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <div className="email-list compact">
            {emails.map((email, index) => (
              <div key={index} className="email-card">
                <div className="email-header">
                  <span className="email-subject">📌 {email.subject}</span>
                  <span className="email-date">
                    {new Date(email.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="email-details">
                  <span className="email-to">👉 {email.to}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
