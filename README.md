# Ceylon Compass

A web-based travel planning platform for Sri Lanka. Ceylon Compass helps users plan customized trips using smart itinerary planning, personalized recommendations, real-time travel alerts, and more.

---

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Django (Python)
- **Database**: PostgreSQL
- **APIs Used**: Google Maps, OpenWeatherMap, etc.

---

## ⚙️ Prerequisites

Install the following on your system:

- [Node.js & npm](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)
- [VS Code (optional)](https://code.visualstudio.com/)

---

## 🚀 Getting Started (Windows Guide)

### 1. Clone the Repository

```bash
git clone https://github.com/dilshanj02/ceylon-compass.git
cd ceylon-compass
git checkout dev
```

### 2. Set Up PostgreSQL

#### a. Create Database

Open **pgAdmin** or `psql`, and run:
```sql
CREATE DATABASE ceylon_compass_db;
```
#### b. Create `ceylon_user` Role

```sql
CREATE ROLE ceylon_user WITH LOGIN PASSWORD '4512'; 
ALTER ROLE ceylon_user CREATEDB; 
GRANT  ALL  ON SCHEMA public TO ceylon_user;
ALTER SCHEMA public OWNER TO ceylon_user;`
```
#### c. Restore the Development Data
```sql
psql -U ceylon_user -d ceylon_compass_db -f ceylon_compass_backup.sql
```

### 3. Backend Setup (Django)
```bash
cd backend
python -m venv env
.\env\Scripts\activate
pip install -r requirements.txt
```
Start the Django server:
```bash
python manage.py runserver
```
### 4. Frontend Setup (React)
```bash
cd ../frontend
npm install
npm run dev
```
## Authors
**Group Members**:

-   Don Jayamanna
-   Maha Sandaru
    
-   Don Chanuja
    
-   Manikkuge Navodya
    
-   Edirisinghe Edirisinghe
    
-   Galgana Gamlath
    
-   Kodippili Dinuradee
    
-   Amaraweera Daneesha
    
-   Kularathna Wimalarathne
    
-   Batarenage Sathsarani
