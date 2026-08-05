# 🎓 PredictMyCollege

<p align="center">
  <img src="https://img.shields.io/badge/Project-AI%20College%20Predictor-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Domain-Education%20Technology-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
</p>

<p align="center">
  <b>An AI-powered, data-driven college prediction platform that helps students discover the best colleges based on MHT-CET & JEE Main scores, CAP round cutoffs, categories, ranks, and branch preferences.</b>
</p>

---

## 🌟 About The Project

**PredictMyCollege** is an intelligent college prediction web application designed to simplify the admission decision process for engineering and pharmacy aspirants.

The platform analyzes historical **Maharashtra CAP Round cutoff data**, college details, branches, categories, and student scores to provide personalized college recommendations.

Students can enter their:

- 📊 MHT-CET Percentile / Score
- 🏆 JEE Main Rank
- 🎓 Candidate Category
- 🏫 Preferred Stream
- 🌐 Branch Preferences

and get a list of colleges where they have higher admission chances.

The goal of PredictMyCollege is to reduce confusion during the admission process and help students make smarter career decisions using data-driven predictions.

---

# 🚀 Key Features

## 🎯 Smart College Prediction

- Predict eligible colleges based on:
  - MHT-CET percentile
  - JEE Main rank
  - Previous CAP cutoff trends
  - Candidate category
  - Branch preference

---

## 🏫 Multi-Domain Support

Currently supports:

### Engineering
- B.Tech / B.E.
- Computer Science Engineering
- Information Technology
- AI & Data Science
- Electronics & Telecommunication
- Mechanical
- Civil
- Other Engineering branches

### Pharmacy
- B.Pharm
- Pharmacy admission prediction using CAP cutoff analysis

---

## 🏷️ Category & Quota Support

Supports Maharashtra admission categories:

- Open
- OBC
- SC
- ST
- NT
- VJ
- EWS
- TFWS
- Minority Seats

---

## 📊 Interactive Student Dashboard

Features:

- College prediction results
- Previous CAP round cutoff analysis
- College codes
- Branch availability
- University information
- Location details
- Admission probability insights

---

## ⚡ Fast Prediction Engine

Built with a high-performance backend system that processes:

- Historical cutoff datasets
- College master data
- Branch information
- Seat matrix details

and provides instant prediction results.

---

# 🧠 How It Works

```
Student Input
      |
      ↓
MHT-CET / JEE Score Analysis
      |
      ↓
Category & Branch Filtering
      |
      ↓
Historical CAP Cutoff Matching
      |
      ↓
Prediction Algorithm
      |
      ↓
Recommended Colleges
```

---

# 🛠️ Technology Stack

## 🎨 Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | User Interface |
| TypeScript | Type Safety |
| Vite | Fast Development Environment |
| CSS3 | Responsive Design |
| Axios / Fetch API | API Communication |

---

## ⚙️ Backend

| Technology | Purpose |
|------------|---------|
| Python | Core Programming |
| Flask / FastAPI | REST API Development |
| Pandas | Data Processing |
| NumPy | Numerical Computation |
| REST API | Frontend Backend Communication |

---

## 🗄️ Data Layer

The system uses structured datasets:

- CAP Round Cutoffs
- College Master Data
- Branch Information
- Seat Matrix
- Pharmacy Cutoffs

Dataset Format:

```
CSV Based Data Storage
        |
        |
College Information
Branch Details
Cutoff History
Admission Data
```

---

# 📂 Project Structure

```
PredictMyCollege/

│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   │
│   ├── prediction/
│   │   └── engine.py
│   │
│   └── routes/
│       ├── metadata.py
│       └── prediction.py
│
├── data/
│   ├── cap_cutoffs.csv
│   ├── colleges.csv
│   ├── branches.csv
│   ├── seat_matrix.csv
│   └── pharmacy_cutoffs.csv
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## ✅ Prerequisites

Make sure you have:

- Python 3.9+
- Node.js 18+
- npm / yarn
- Git

---

# 🔹 Backend Setup

Clone repository:

```bash
git clone https://github.com/yourusername/PredictMyCollege.git
```

Navigate backend:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate environment:

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
python app.py
```

Backend will start:

```
http://localhost:5000
```

---

# 🔹 Frontend Setup

Navigate frontend:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend will start:

```
http://localhost:5173
```

---

# 🔌 API Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Predict eligible colleges |
| GET | `/api/metadata/branches` | Get available branches |
| GET | `/api/metadata/colleges` | Get college information |
| GET | `/api/metadata/categories` | Get supported categories |

---

# 📈 Future Enhancements

Planned improvements:

- 🤖 Machine Learning based prediction model
- 📍 College comparison system
- ⭐ Student reviews and ratings
- 📄 CAP round PDF automatic data extraction
- 📱 Mobile application
- 🔔 Admission alerts
- 🧠 AI career guidance assistant

---

# 🏆 Project Achievement

🥈 **Silver Medal Winner – College Project Exhibition**

🏅 **2nd Rank among Final Year Projects**

Built as a final-year BCA project with the vision of solving real admission challenges faced by students.

---

# 👨‍💻 Developer

**Pranav Chaudhari**

🎓 Bachelor of Computer Applications (BCA)  
💻 Full Stack Developer | AI/ML Enthusiast  

Skills:
- Python
- Java
- React.js
- Flask
- Machine Learning
- Data Analysis
- Web Development

---

# 🤝 Contributing

Contributions are welcome!

If you have suggestions, improvements, or feature requests:

1. Fork this repository
2. Create a new branch
3. Commit changes
4. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

<p align="center">
⭐ If you find this project useful, consider giving it a star!
</p>
