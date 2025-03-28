import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.100.25:5000';

async function generateCertificate(studentId, courseId, courseName) {
    try {
        // 1. Get certificate data from backend
        const response = await axios.get(
            `${API_BASE_URL}/payments/certificate-details/${studentId}/${courseId}`
        );

        const { studentName, issueDate } = response.data;

        // 2. Generate HTML with the fetched data
        const htmlContent = `
        <html>
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;500&display=swap');
                    
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }
                    
                    .certificate {
                        width: 800px;
                        height: 600px;
                        background: #fff;
                        border: 15px solid #4CAF50;
                        padding: 40px;
                        position: relative;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                        background-image: url('https://i.pinimg.com/736x/60/21/65/6021653b6477b75ed891b920d0535031.jpg');
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: 60% auto;
                        background-blend-mode: overlay;
                    }
                    
                    .certificate-border {
                        border: 2px solid #333;
                        height: 100%;
                        padding: 30px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                    }
                    
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    
                    .logo {
                        font-family: 'Roboto', sans-serif;
                        font-size: 24px;
                        font-weight: bold;
                        color: #4CAF50;
                        margin-bottom: 10px;
                    }
                    
                    h1 {
                        font-family: 'Playfair Display', serif;
                        font-size: 36px;
                        color: #333;
                        margin: 10px 0;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }
                    
                    .subtitle {
                        font-family: 'Roboto', sans-serif;
                        font-size: 18px;
                        color: #555;
                        margin: 20px 0;
                    }
                    
                    .student-name {
                        font-family: 'Playfair Display', serif;
                        font-size: 32px;
                        color: #4CAF50;
                        margin: 30px 0;
                        font-weight: 700;
                    }
                    
                    .course-name {
                        font-family: 'Roboto', sans-serif;
                        font-size: 24px;
                        color: #333;
                        font-weight: 500;
                        margin: 20px 0;
                    }
                    
                    .signatures {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        margin-top: 60px;
                    }
                    
                    .signature {
                        text-align: center;
                        width: 200px;
                    }
                    
                    .signature-line {
                        border-top: 1px solid #333;
                        width: 150px;
                        margin: 0 auto;
                        padding-top: 10px;
                    }
                    
                    .signature-title {
                        font-family: 'Roboto', sans-serif;
                        font-size: 14px;
                        color: #555;
                        margin-top: 5px;
                    }
                    
                    .footer {
                        position: absolute;
                        bottom: 20px;
                        font-family: 'Roboto', sans-serif;
                        font-size: 12px;
                        color: #888;
                        text-align: center;
                        width: 100%;
                    }
                    
                    .seal {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        width: 80px;
                        opacity: 0.8;
                    }
                    
                    .date {
                        font-family: 'Roboto', sans-serif;
                        font-size: 16px;
                        color: #555;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <div class="certificate-border">
                        <img src="https://i.pinimg.com/736x/12/53/96/1253966febe78a275efe93838473fcda.jpg" class="seal" alt="Official Seal">
                        
                        <div class="header">
                            <div class="logo">Oracle Language Centre</div>
                            <h1>Certificate of Achievement</h1>
                            <div class="subtitle">This is to certify that</div>
                        </div>
                        
                        <div class="student-name">${studentName}</div>
                        
                        <div class="subtitle">has successfully completed the course</div>
                        
                        <div class="course-name">${courseName}</div>
                        
                        <div class="subtitle">with distinction and demonstrated outstanding commitment to learning</div>
                        
                        <div class="date">Issued on ${new Date(issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        
                        <div class="signatures">
                            <div class="signature">
                                <div class="signature-line"></div>
                                <div class="signature-title">Director of Studies</div>
                            </div>
                            <div class="signature">
                                <div class="signature-line"></div>
                                <div class="signature-title">Principal</div>
                            </div>
                        </div>
                        
                        <div class="footer">
                            This is an official digital certificate issued by Oracle Language Centre<br>
                            Certificate ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}
                        </div>
                    </div>
                </div>
            </body>
        </html>
        `;

        // 3. Generate PDF locally
        const options = {
            html: htmlContent,
            fileName: `Certificate_${courseName.replace(/\s+/g, '_')}`,
            directory: 'Documents',
        };

        const file = await RNHTMLtoPDF.convert(options);
        return file.filePath;

    } catch (error) {
        console.error("Certificate generation error:", error);
        throw new Error("Failed to generate certificate. Please try again.");
    }
}

export default generateCertificate;