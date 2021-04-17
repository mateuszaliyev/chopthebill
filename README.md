# ChopTheBill
Aplikacja internetowa do łatwego podziału kosztów między ludźmi.

Stworzona w ramach łączonego projektu kierunków Zarządzania oraz Informatyki Politechniki Rzeszowskiej im. Ignacego Łukasiewicza.

## Sposób użycia
Aplikacja wymaga instalacji [Node.js](https://nodejs.org/) oraz [npm](https://www.npmjs.com/).

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

### Uruchamianie

Uruchomienie aplikacji w trybie *"development"*, zoptymalizowanym do edycji kodu (z automatycznym odświeżaniem strony po zapisaniu wprowadzonych zmian, wyświetlaniem błędów, etc.).

```bash
npm run dev
```

Tworzenie zoptymalizowanej wersji aplikacji do trybu *"production"*.

```bash
npm run build
```

Uruchomienie aplikacji w trybie *"production"*. Aplikacja powinna być najpierw zoptymalizowana za pomocą polecenia `npm run build`.

```bash
npm run start
```

Aplikacja domyślnie uruchamia się pod adresem [localhost](http://localhost:3000) na porcie 3000. Aby zmienić port należy utworzyć plik `.env.local` w katalogu głównym projektu oraz przypisać wybraną wartość zmiennej środowiskowej `PORT` (poniżej przykład dla portu 8080).

```
PORT=8080
```