# CenyPaliwek 

##  Opis projektu
CenyPaliwek to aplikacja webowa umożliwiająca zarządzanie stacjami paliw, dodawanie propozycji cen przez użytkowników oraz ich moderację przez administratorów.  
Aplikacja składa się z backendu napisanego w **Node.js** oraz frontendowej części stworzonej w **Vue.js**.

🔗 [https://www.cenypaliwek.pl](https://www.cenypaliwek.pl)

---

##  Stos technologiczny

### **Backend**
- **Node.js** – Serwer backendowy
- **Express.js** – Framework do tworzenia API
- **MySQL** – Relacyjna baza danych
- **Sequelize** – ORM do obsługi MySQL
- **JWT** – Autoryzacja użytkowników
- **Passport.js** – Logowanie przez Facebook OAuth
- **Swagger UI** – Dokumentacja API
- **Multer** – Obsługa przesyłania plików JPG/PNG

### **Frontend**
- **Vue.js** – Framework do tworzenia interfejsu użytkownika
- **Vue Router** – Nawigacja po stronach aplikacji
- **Pinia** – Zarządzanie stanem aplikacji
- **Tailwind CSS** – Stylowanie komponentów

---

##  Struktura katalogów

```
/backend
├── controllers/    # Logika obsługi żądań API
├── middlewares/    # Middleware do autoryzacji i walidacji
├── models/         # Definicje modeli bazy danych
├── routes/         # Definicje endpointów API
├── utils/          # Funkcje pomocnicze
├── config/         # Konfiguracja bazy danych i środowiska
├── swagger.js      # Konfiguracja Swagger UI
├── app.js          # Główna aplikacja serwera
├── package.json    # Plik zależności Node.js
└── .env            # Plik zmiennych środowiskowych

/frontend
├── src/
│   ├── assets/       # Zasoby statyczne (obrazy, style)
│   ├── components/   # Komponenty Vue.js
│   ├── models/       # Struktura danych aplikacji
│   ├── router/       # Konfiguracja tras Vue Router
│   ├── stores/       # Zarządzanie stanem aplikacji
│   ├── views/        # Widoki aplikacji
│   ├── App.vue       # Główny komponent aplikacji
│   ├── http.ts       # Konfiguracja axios dla API
│   ├── main.ts       # Główna konfiguracja Vue.js
├── package.json      # Plik zależności Frontend
```

---

##  Opis najważniejszych klas

### **1. User Model (`models/User.js`)**
- Przechowuje dane użytkowników (email, hasło, rola, liczba punktów).
- Obsługuje operacje CRUD na użytkownikach.
- Sprawdza, czy użytkownik jest zbanowany.

### **2. Station Model (`models/Station.js`)**
- Reprezentuje stacje paliw w bazie danych.
- Przechowuje nazwy, lokalizacje i ceny paliw.

### **3. Auth Controller (`controllers/authController.js`)**
- Obsługuje rejestrację i logowanie użytkowników.
- Implementuje logowanie przez Facebook OAuth.

### **4. Station Controller (`controllers/stationController.js`)**
- Odpowiada za operacje CRUD na stacjach paliw.
- Obsługuje propozycje zmian cen.

### **5. User Controller (`controllers/userController.js`)**
- Zarządza użytkownikami.
- Obsługuje banowanie i pobieranie listy użytkowników.

### **6. Middleware (`middlewares/authMiddleware.js`)**
- Sprawdza, czy użytkownik jest zalogowany.
- Weryfikuje token JWT.
- Ogranicza dostęp do endpointów tylko dla administratorów.

  ---

##  Instalacja i uruchomienie (lokalnie)

###  Wymagania
- **Node.js v18+**
- **MySQL**
- **NPM v10.8.2+**

### **1. Konfiguracja Backend**

1. **Zainstaluj zależności**
   ```bash
   cd backend
   npm install
   ```

2. **Skonfiguruj plik `.env`**  
   Tworzymy plik `.env` i uzupełniamy go danymi:
   ```env
   DATABASE_HOST=localhost
   DATABASE_USER=root
   DATABASE_PASSWORD=password
   DATABASE_NAME=ceny_paliwek
   JWT_SECRET=super_secret_key
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   FACEBOOK_CALLBACK_URL=https://www.cenypaliwek.pl/api/auth/facebook/callback
   ```

3. **Uruchom serwer backend**
   ```bash
   npm start
   ```

### **2. Konfiguracja Frontend**

 **Zainstaluj zależności**
   ```bash
   cd frontend
   npm install
   npm run build
   ```


Aplikacja powinna być dostępna pod `http://localhost:3001/`

---

##  Instalacja i wdrożenie na serwer

Aplikacja jest wdrożona na maszynie wirtualnej, gdzie zostały wykonane następujące kroki:

### **1. Konfiguracja serwera**
- Instalacja Node.js oraz PM2
- Ustawienie certyfikatu SSL i HTTPS
- Konfiguracja domeny i DNS

### **2. Klonowanie projektu**
   ```bash
   git clone https://github.com/KRacz0/FuelManage
   cd /var/www/cenypaliwek
   ```

### **3. Instalacja zależności i konfiguracja**
   ```bash
   cd /var/www/cenypaliwek/backend
   npm install
   cp .env  # Wypełnij plik .env odpowiednimi wartościami
   ```

### **4. Uruchomienie bazy danych**
   *Tabele w bazie danych są tworzone automatycznie przy pierwszym uruchomieniu serwera.*

### **5. Uruchomienie aplikacji na serwerze**
   ```bash
   pm2 start app.js --name cenypaliwek
   pm2 save
   pm2 restart cenypaliwek
   ```
---

##  Dokumentacja API

Po uruchomieniu backendu dokumentacja API jest dostępna pod adresem:
🔗 [https://www.cenypaliwek.pl/api-docs/](https://www.cenypaliwek.pl/api-docs/)

---

##  Grupa Projektowa

- Krystian Raczyński **- Lider, Project Manager, Devops, Programista backend**
- Gerard Hagel **- Programista frontend**
- Damian Domański **- Tester**

---

## ❔ Wnioski projektowe

- **Ułatwienie zarządzania stacjami paliw** – Administratorzy mogą łatwo dodawać i edytować stacje oraz moderować zgłoszenia cen.
- **Łatwość wdrożenia** – Backend w Node.js + Express.js i frontend w Vue.js zapewniają wysoką skalowalność.
- **Bezpieczeństwo** – Autoryzacja JWT i logowanie przez Facebook zwiększają bezpieczeństwo użytkowników i administratorów.

