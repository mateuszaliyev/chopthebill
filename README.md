# ChopTheBill
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

Import danych z pliku `data/db.sql` odbywa się poprzez polecenie `psql`. Po wykonaniu komendy może być konieczne wprowadzenie hasła dla podanego użytkownika.

```
psql -U <nazwa_uzytkownika> -d <nazwa_bazy_danych> < <sciezka_do_pliku>
```

Przykład dla wiersza poleceń systemów z rodziny Windows.

```
psql -U postgres -d chopthebill < C:\dev\P01-G01-ChopTheBill\data\db
```

### Zmienne środowiskowe

Aplikacja do nawiązania połączenia z bazą danych PostgreSQL wymaga utworzenia pliku `.env` w katalogu głównym projektu oraz wprowadzenia zmiennych środowiskowych.

- `PGHOST` - nazwa hosta, z którym aplikacja nawiązuje połączenie,
- `PGUSER` - nazwa użytkownika PostgreSQL (domyślnie `postgres`),
- `PGDATABASE` - nazwa bazy danych,
- `PGPASSWORD` - hasło użytkownika `PGUSER`,
- `PGPORT` - port, na którym można połączyć się z hostem.

Przykładowa zawartość pliku `.env`.

```
PGHOST='localhost'
PGUSER=postgres
PGDATABASE=chopthebill
PGPASSWORD=postgres
PGPORT=5432
```

### Uruchamianie

Uruchomienie aplikacji w trybie *"development"*, zoptymalizowanym do edycji kodu (z automatycznym odświeżaniem strony po zapisaniu wprowadzonych zmian, wyświetlaniem błędów, etc.).

```
npm run dev
```

Tworzenie zoptymalizowanej wersji aplikacji do trybu *"production"*.

```
npm run build
```

Uruchomienie aplikacji w trybie *"production"*. Aplikacja powinna być najpierw zoptymalizowana za pomocą polecenia `npm run build`.

```
npm run start
```