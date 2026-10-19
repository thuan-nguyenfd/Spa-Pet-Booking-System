# Spa Pet Booking System

Foundation for the team's pet spa booking project. The frontend and backend are separate applications, and the existing MariaDB dump is the source of truth for entity mappings. This phase provides project structure and persistence mappings; it does not implement business workflows.

## Technology Stack

- Frontend: React, Vite, JavaScript, React Router, Axios
- Backend: Spring Boot, Java 23, Maven, Spring Web, Spring Data JPA, Validation, Security, OAuth2 Client, Spring Mail
- Database: MySQL/MariaDB through XAMPP

## Project Structure

```text
frontend/   React/Vite application
backend/    Spring Boot application (com.petspa.petbooking)
docs/       Database and future-work notes
database/   MariaDB schema dump
uploads/    Local upload storage (pets/, services/)
```

## Requirements

- JDK 23 (use the same major version across the backend team)
- Node.js and npm
- XAMPP with MySQL/MariaDB
- IntelliJ IDEA or VS Code
- No Java preview features are used

## Database

1. Start MySQL in XAMPP.
2. Import `database/spathucung.sql` into the `spathucung` database.
3. The application uses `ddl-auto: validate`; Hibernate checks mappings and does not create or alter schema.

## Run Backend

From the repository root on Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Alternatively, open `backend` in IntelliJ and run `com.petspa.petbooking.PetSpaApplication` with JDK 23. The wrapper can also be run from `backend` as `./mvnw` on macOS/Linux.

Database settings are read from `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. Local defaults point to `localhost:3306/spathucung` and user `root` with a blank password. Override these variables if your XAMPP setup differs. `SERVER_PORT` can override the backend port (default `8080`). No production credentials are included.

## Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend (public): <http://localhost:5173>  
Admin placeholder: <http://localhost:5173/admin>  
Backend: <http://localhost:8080>

The Axios client reads `VITE_API_BASE_URL`; copy `frontend/.env.example` to `.env.local` to set the local backend URL.

## Future integration settings

Google OAuth2, VNPay, and email are dependencies/configuration placeholders only. Email configuration reserves `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, and `MAIL_PASSWORD`. Google login will use `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` when implemented. VNPay merchant settings and signing secret will be introduced through environment variables with the payment integration. No credentials are included.

## Scope

Entity mappings and empty package scaffolding are ready for team development. Registration, authentication flows, booking, payment, email sending, admin CRUD, and other business APIs are intentionally not implemented in this foundation phase.
