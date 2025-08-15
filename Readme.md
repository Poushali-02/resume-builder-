# Django Resume Builder

A professional resume builder application built with Django that allows users to create, edit, and download resumes as PDFs.

## Quick Start

### Prerequisites
- Python 3.8+
- Git

### Installation & Setup

1. **Clone the repository**
```bash
git clone https://github.com/Poushali-02/resume-builder-.git
cd resume-builder-
```

2. **Create virtual environment**
```bash
python -m venv venv
```

3. **Activate virtual environment**
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Navigate to project directory**
```bash
cd resumeBuilder
```

6. **Run database migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Create superuser (admin account)**
```bash
python manage.py createsuperuser
```
Enter your desired username, email, and password when prompted.

8. **Start the development server**
```bash
python manage.py runserver
```

9. **Access the application**
- Open your browser and go to: http://127.0.0.1:8000/
- Admin panel: http://127.0.0.1:8000/admin/

## Docker Alternative

If you prefer using Docker:

```bash
# Pull and run the container
docker run -p 8000:8000 poushali02/resume-builder

# Access at: http://localhost:8000
```

## How to Use

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Resume**: Fill in your personal information, work experience, education, and skills
3. **Download PDF**: Generate and download your resume as a professional PDF
4. **Manage Resumes**: Edit, update, or delete your resumes from your profile

## Features

- User authentication and profiles
- PDF generation with WeasyPrint
- Responsive design
- Resume privacy settings (public/private)
- Admin panel for management

## Tech Stack

- **Backend**: Django 5.2.5
- **PDF Generation**: WeasyPrint
- **Database**: SQLite (default), PostgreSQL compatible
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Tailwind CSS

## Troubleshooting

If you encounter any issues:

1. Make sure you're in the correct directory (`resumeBuilder/`)
2. Ensure your virtual environment is activated
3. Check that all dependencies are installed: `pip install -r requirements.txt`
4. Run migrations if database errors occur: `python manage.py migrate`
