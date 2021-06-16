<p align="center"><img alt="Logo" src="https://github.com/PRz-IO/P01-G01-ChopTheBill/blob/main/views/public/icons/icon.svg"></p>
<h1 align="center">ChopTheBill</h1>

Aplikacja internetowa do łatwego podziału kosztów między ludźmi.

Stworzona w ramach łączonego projektu kierunków Zarządzania oraz Informatyki Politechniki Rzeszowskiej im. Ignacego Łukasiewicza.

## Sposób użycia
Aplikacja wymaga instalacji [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/) oraz [PostgreSQL](https://www.postgresql.org/).

### Pobieranie

Repozytorium można pobrać w formacie `.zip`, otworzyć w dedykowanej aplikacji [GitHub Desktop](https://desktop.github.com/) lub sklonować za pomocą jednej z poniższych komend:

```bash
# Klonowanie z użyciem protokołu HTTPS
git clone https://github.com/PRz-IO/P01-G01-ChopTheBill.git

# Klonowanie z użyciem protokołu SSH
git clone git@github.com:PRz-IO/P01-G01-ChopTheBill.git
```

### Instalacja

Instalacja zależności odbywa się poprzez wywołanie jednego z poniższych poleceń w katalogu głównym projektu.

```bash
npm install

# lub

npm i
```

### Import bazy danych

Korzystając z wiersza poleceń lub narzędzia [pgAdmin 4](https://www.pgadmin.org/) dostępnego po instalacji PostgreSQL należy utworzyć bazę danych.

Przykładowy skrypt SQL tworzący bazę danych.

```sql
CREATE DATABASE chopthebill
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
```

Tabele mogą zostać utworzone za pomocą skryptu SQL znajdującego się w pliku `data/db.sql` (z pominięciem pierwszeo polecenia, tworzącego samą bazę danych). Innym sposobem jest import danych z pliku `data/backup/plain.sql` odbywający się poprzez polecenie `psql`. Po wykonaniu komendy może być konieczne wprowadzenie hasła dla podanego użytkownika.

```
psql -U <nazwa_uzytkownika> -d <nazwa_bazy_danych> < <sciezka_do_pliku>
```

Przykład dla wiersza poleceń systemów z rodziny Windows.

```
psql -U postgres -d chopthebill < C:\dev\P01-G01-ChopTheBill\data\backup\plain.sql
```

### Zmienne środowiskowe

Aplikacja do nawiązania połączenia z bazą danych PostgreSQL wymaga utworzenia pliku `.env` w katalogu głównym projektu oraz wprowadzenia zmiennych środowiskowych.

Użytkownicy są uwierzytelniani z użyciem [JSONWebToken](https://jwt.io/). Sygnowanie oraz weryfikacja przesyłanych tokenów odbywa się poprzez wykorzystanie sekretnych kluczy zapisanych w zmiennych środowiskowych: `ACCESS_TOKEN_SECRET` oraz `REFRESH_TOKEN_SECRET`.

| Zmienna                    | Opis                           | Domyślna wartość |
| -------------------------- | ------------------------------ | ----------------:|
| `ACCESS_TOKEN_SECRET`      | sekretny klucz *access token*  |                  |
| `REFRESH_TOKEN_SECRET`     | sekretny klucz *refresh token* |                  |
| `PGHOST`                   | nazwa hosta                    |      `localhost` |
| `PGUSER`                   | nazwa użytkownika              |       `postgres` |
| `PGDATABASE`               | nazwa bazy danych              |    `chopthebill` |
| `PGPASSWORD`               | hasło użytkownika              |                  |
| `PGPORT`                   | port serwera bazy danych       |           `5432` |

Wygenerowanie losowych kluczy jest możliwe z poziomu katalogu głównego projektu.

```
npm run generate
```

Przykładowa zawartość pliku `.env`.

```
ACCESS_TOKEN_SECRET=063fb622691d955737712c46d9849c3f7f3c70e553cf56bead3b8e89e37a12dc
REFRESH_TOKEN_SECRET=762ff7a10ba43d91166b12be376c8fe54507201f870fd4608e4bbd2657020563
PGHOST='localhost'
PGUSER=postgres
PGDATABASE=chopthebill
PGPASSWORD=postgres
PGPORT=5432
```

### Adres serwera
W pliku `views/config/index.js` znajdują się adresy URL serwera dla trybu *"development"* oraz *"production"*. Domyślnym adresem jest [`http://localhost:5000`](http://localhost:5000/) dla trybu *"development"* oraz [`https://chopthebill.herokuapp.com`](https://chopthebill.herokuapp.com/) dla trybu *"production"*. Aplikacja powinna działać prawidłowo, jeżeli korzysta się z niej na tym samym urządzeniu, na którym została uruchomiona. Aby móc korzystać z aplikacji używajac innego urządzenia (np. smartfonu) należy ustawić powyższe adresy na adres IP hosta tak, jak w poniższym przykładzie.

> **Uwaga:** Wsparcie dla PWA (Progressive Web App) jest wyłączone w trybie *"development"*.

```js
const dev = process.env.NODE_ENV !== "production";

export const host = dev
	? `http://192.168.0.10:5000` //  development
	: `http://192.168.0.10:5000`; // production
```

### Uruchamianie

Uruchomienie aplikacji w trybie *"development"*, zoptymalizowanym do edycji kodu (z automatycznym odświeżaniem strony po zapisaniu wprowadzonych zmian, wyświetlaniem błędów, etc.).

```
npm run dev
```

Tworzenie zoptymalizowanej wersji aplikacji Next.js do trybu *"production"*.

```
npm run next-build
```

Uruchomienie aplikacji lokalnie w trybie *"production"*. Aplikacja powinna być najpierw zoptymalizowana za pomocą polecenia `npm run build`.

```
npm run start-local
```