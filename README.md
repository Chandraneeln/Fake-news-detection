# Honest Eye: AI-Powered Tool for Combating Misinformation

## 🏆 Hackathon Submission

**Honest Eye** is an innovative AI-powered solution designed to empower users in India to effectively combat the spread of misinformation. In an era where fake news and digital scams pose significant threats to social harmony, public health, and financial security, Honest Eye provides users with the tools to verify information and develop critical media literacy skills.

## ✨ Key Features

### 🎯 AI-Powered Analysis
- **Multi-format Support**: Analyze text, URLs, and images
- **Google Gemini Integration**: Advanced AI analysis with Indian context
- **Credibility Scoring**: 0-100 credibility assessment
- **Red Flag Detection**: Identifies common misinformation patterns
- **Fact-Check Integration**: Cross-references with Google Fact Check API

### 🇮🇳 India-Focused
- **WhatsApp University Detection**: Identifies viral misinformation patterns
- **Communal Content Analysis**: Specialized detection for divisive content
- **Indian Source Recommendations**: Curated list of trusted Indian news sources
- **Cultural Context**: Understanding of Indian digital misinformation landscape

### 📚 Educational Platform
- **Media Literacy Guide**: Comprehensive learning resources
- **Critical Thinking Tools**: Step-by-step verification process
- **Interactive Learning**: Hands-on content analysis
- **Best Practices**: Indian-specific verification techniques

### 🔒 Production-Ready
- **Enterprise Security**: Rate limiting, input validation, CORS
- **Scalable Architecture**: Docker containerization
- **Performance Optimized**: Parallel processing, caching
- **Monitoring & Logging**: Comprehensive error tracking

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Google Cloud API Key (Gemini + Fact Check APIs)
- Node.js 18+ (for development)

### 1. Clone Repository
```bash
git clone <repository-url>
cd honest-eye-app-main
```

### 2. Configure Environment
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env and add your Google API key
# GOOGLE_API_KEY=your_actual_api_key_here
```

### 3. Deploy with Docker
```bash
# Make deploy script executable (Linux/Mac)
chmod +x deploy.sh

# Production deployment
./deploy.sh

# OR Development mode
./deploy.sh --dev
```

### 4. Access Application
- **Frontend**: http://localhost (production) or http://localhost:8080 (dev)
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 API Setup Guide

### Google Cloud Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable these APIs:
   - **Generative Language API** (for Gemini)
   - **Fact Check Tools API** (for fact checking)
4. Create API Key in "Credentials"
5. Restrict API key to enabled APIs
6. Add key to `backend/.env`

## 📊 API Endpoints

### Analysis Endpoint
```http
POST /api/misinfo
Content-Type: application/json

{
  "content": "Text, URL, or image to analyze",
  "type": "text|url|image"
}
```

### Response Format
```json
{
  "score": 85,
  "content": "Analyzed content",
  "type": "text",
  "explanation": "Detailed AI analysis",
  "redFlags": ["List of warning signs"],
  "trustedSources": ["Recommended sources"],
  "educationalTips": ["Media literacy tips"],
  "factCheck": [],
  "confidence": 90,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         Frontend (React)            │
│  ┌─────────────┐ ┌───────────────┐  │
│  │ Analysis UI │ │ Learning Hub  │  │
│  └─────────────┘ └───────────────┘  │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│         Backend (Node.js)           │
│  ┌─────────────┐ ┌───────────────┐  │
│  │ Security    │ │ AI Analysis   │  │
│  │ & Rate      │ │ Engine        │  │
│  │ Limiting    │ └───────────────┘  │
│  └─────────────┘                    │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│      Google Cloud AI Services       │
│  ┌─────────────┐ ┌───────────────┐  │
│  │ Gemini AI   │ │ Fact Check    │  │
│  │ Model       │ │ API           │  │
│  └─────────────┘ └───────────────┘  │
└─────────────────────────────────────┘
```

## 🎯 Hackathon Evaluation Criteria

### Technical Merit (40%)
- ✅ **Google Cloud AI Integration**: Advanced Gemini model usage
- ✅ **Scalable Architecture**: Production-ready containerized deployment
- ✅ **Code Quality**: TypeScript, error handling, security measures

### User Experience (10%)
- ✅ **Intuitive Interface**: Clean, mobile-responsive design
- ✅ **Seamless AI Integration**: Real-time analysis with visual feedback

### Alignment with Cause (15%)
- ✅ **Perfect Problem Fit**: Directly addresses Indian misinformation crisis
- ✅ **Positive Community Impact**: Builds informed digital citizenship

### Innovation & Creativity (20%)
- ✅ **Unique Indian Focus**: WhatsApp University detection, cultural context
- ✅ **Educational Approach**: Beyond fact-checking to skill building
- ✅ **Multi-modal Analysis**: Text, URL, and image verification

### Market Feasibility (15%)
- ✅ **Large Market**: 600M+ internet users in India
- ✅ **Proven Demand**: Government and NGO initiatives against misinformation
- ✅ **Scalable Business Model**: API-based service with educational content

## 🌍 Social Impact

### Problem Alignment
- **Communal Harmony**: Reduces spread of divisive content
- **Public Health**: Combats medical misinformation
- **Financial Security**: Protects against online scams
- **Democratic Process**: Ensures informed voting decisions

### Community Benefits
- **Digital Literacy**: Improves critical thinking skills
- **Social Cohesion**: Reduces polarization
- **Economic Protection**: Prevents financial fraud
- **Educational Empowerment**: Creates informed citizens

## 🔧 Development

### Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
npm install
npm run dev
```

### Docker Development
```bash
# Start development containers
docker-compose --profile dev up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 📈 Performance & Security

- **Rate Limiting**: 10 requests/5min per IP for analysis
- **Input Validation**: Comprehensive request sanitization
- **CORS Protection**: Configured for production domains
- **Security Headers**: Helmet.js implementation
- **Error Handling**: Structured logging and monitoring
- **Caching**: Optimized for repeated queries

## 🚀 Deployment Options

### Vercel (Recommended for Production)
For detailed Vercel deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Vercel Setup:**
```bash
# Deploy backend
cd backend
vercel --prod

# Deploy frontend  
cd ..
vercel --prod
```

### Docker (Alternative)
- Production-ready containers
- Automated health checks
- Scalable configuration

### Cloud Platforms
- **Vercel**: Frontend + Backend deployment (serverless)
- **Railway/Render**: Backend deployment
- **Google Cloud Run**: Containerized deployment

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**Built with ❤️ for a more informed India**