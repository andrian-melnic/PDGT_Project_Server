## Studente 
- Nome: Andrian
- Cognome: Melnic
- Matricola: 279412

# Repository del server per il progetto PDGT

## Servizio

Servizio web RESTful che permette all utente di svolgere operazioni sulle
posizioni delle fontanelle di acqua potabile presenti nella regione Marche. Le
operazioni messe a disposizione sono:
  - Registrasi al servizio (tramite maill e password)
  - Accedere al servizio se si è già registrati
  - Visualizzare (non necessita di login)
  - Modificare  (necessita di login e proprietà della posizione)
  - Eliminare (necessita di login e proprietà della posizione)
  - Aggiungere (neccessita solamente di login)
  Il servizio è accessibile tramite un applicatione web dotata di mappa
interattiva.

## Implementazione
  
  Sia il server che il client sono basati su nodeJS, nello specifico:
  
  ### Server
  E' un applicazione basata sul framework ExpressJS. Altri moduli utilizzati 
  sono elencati di seguito:

  ```js
    "axios": "^0.19.2"
    "body-parser": "^1.19.0"
    "crypto": "^1.0.1"
    "dotenv": "^8.2.0"
    "express": "^4.17.1"
    "express-jwt": "^5.3.1"
    "express-session": "^1.17.0"
    "jsonwebtoken": "^8.5.1"
    "mongoose": "^5.9.5"
    "nodemon": "^2.0.2"
    "passport": "^0.4.1"
    "passport-local": "^1.0.0"
  ```

  - **axios**: modulo per effettuare le richieste all'API di geocoding di 
    OSM/ Nominatim.
  - **body-parser**: middleware per parsare le richieste in arrivo.
  - **crypto**: collezione di algoritmi di crittografia.
  - **dotenv**: modulo che carica le variabili d'ambiente da un file .env.
  - **express-jwt**: middleware che valida i java web tokens.
  - **express-session**: permette di create un middleware session.
  - **jsonwebtoken**: utlizzato per generare jwt.
  - **mongoose**: set di strumenti per la creazione e gestione di modelli
    MongoDB.
  - **nodeamon**: utilizzato durante lo sviluppo. Riavvia automaticamente l'app
    ad ogni aggiornamento di un file js.
  - **passport** e **passport-local**: rispettivamente middleware di 
    autenticazione per nodeJS e strategia locale basata su username e password.

  #### Database
  Come DB è stato scelto MongoDB data la sua natura object oriented e NoSQL.
  I dati sono interpretati come oggetti e salvati in documenti JSON separati e
  identificati da id univoci. I documenti sono poi raccolti nelle collezioni.
  Questo si traduce in un elevata semplicità di utilizzo.

  Le collezioni create per il progetto sono 2:

  **- Quella per gli utenti:**
  ```js
  email: {
    type: String,
    require: true
  },

  hash: String,

  salt: String,

  // Drinking water positions added by the user
  createdLocations: [{
    type: Schema.Types.ObjectId,
    ref: 'Location'
  }]
  ```

  **- Quella per le posizioni:**
  ```js
  lng: String,
  lat: String,
  address: String,
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
  ```
#### Sistema di autenticazione
L'autenticazione è basata su username(email) e password. L'utente che desidera
registrarsi compila il form, il server riceve la richiesta e se l'email non è 
già presente l'utente viene inserito nel DB. Il server cripta la password 
generando un salt che viene poi utilizzato per codificare un hash. 
Nel DB quindi non viene esplicitamente salvata la password ma l'hash e il salt.

Durante il login passport richiama il metodo che verifica la validità della 
password confrontando gli hash generati dal salt. Se l'operazione si conclude 
con successo, passport permette alla richiesta di arrivare al handler di login,
inserendo anche un campo user al suo interno. L'handler poi genera un jwt e
risponde al client con un json contenente token, email, e id dell'utente nel DB.

Infine ci sono altri 2 middleware che si occupano di verificare se l'utente è
loggato, per registringere l'accesso a determinate operazioni, e se l'utente è
il proprietario del oggetto che desidera eliminare/ modificare.
## Dati e servizi esterni

  I dati delle posizioni delle singole fontanelle, utilizzati per popolare
inizialmente il database, sono stati estratti da OpenStreetMap in forma di 
coordinate. Dopodichè, tramite Nominatim Geocoding API, è stato effettuato il 
reverse geocoding in bulk per ottenere gli indirizzi. Vengono effettuate
ulteriori richieste quando l'untente aggiunge o modifica le coordinate di 
una posizione.

### Aggiunta di nuove posizioni e reverse geocoding

  L'utente ha la possibilità di inserire nuove posizioni tramite coordinate.
Tale coordinate poi vengono tradotte in indirizzi tramite l'operazione di 
reverse geocoding e sia le coordinate che l'indirizzi vengono salvati nel DB.
L'operazione viene svolta dall' API di geocoding di Nominatim. Inizialmente
si era optato per l'equivalente di Google Maps ma ho scoperto in seguito che 
il salvare dati ottenuti tramite l'API in un DB violava i ToS. Nominatim non
presenta tale restrizione. 

## Documentazione API

```yaml
servers:
  - url: 'https://pdgt-project-app.herokuapp.com'
```
### Endpoint:

#### --> Tutte le posizioni
```json
GET /drink_water

  headers: {
    "Content-Type": "application/json"
  }

-> Risposta
  [
      {
          "_id": "5e85c9a832632d07b07822a1",
          "lng": "12.2985222",
          "lat": "43.7854061",
          "address": "Il Mandriano, Via Cantoniera, Carpegna, Pesaro e Urbino, Marche, 61021, Italia",
          "addedBy": "5e838630e1fc2447886d0452"
      },
      {
          "_id": "5e85c9a832632d07b07822a3",
          "lng": "12.7819438",
          "lat": "43.5096847",
          "address": "Podere, Località Podere, Podere, Serra Sant'Abbondio, Pesaro e Urbino, Marche, Italia",
          "addedBy": "5e838630e1fc2447886d0452"
      }, ... ]
  ```

#### --> Restituisce una posizione in base al id
```json
GET /drink_water/location?id=<id posizione>

-> Richiesta

    https://pdgt-project-app.herokuapp.com/drink_water/location?id=5e85c9a832632d07b07822a1

  headers: {
    "Content-Type": "application/json"
  }
-> Risposta
  {
    "_id": "5e85c9a832632d07b07822a1",
    "lng": "12.2985222",
    "lat": "43.7854061",
    "address": "Il Mandriano, Via Cantoniera, Carpegna, Pesaro e Urbino, Marche, 61021, Italia",
    "addedBy": "5e838630e1fc2447886d0452"
  }
```

#### --> Registrazione
```json
POST /users/register

-> Richiesta
  {
    "user": {
      "email": "pinco_pallino@gmail.com",
      "password": "Pa55word"
    }
  }
  headers: {
    "Content-Type": "application/json"
  }

-> Risposta
  {
    "user": {
        "email": "pinco_pallino@gmail.com",
        "id": "5e88e4550a62940017d622e1"
    }
  }
```

#### --> Login
```json
POST /users/login
-> Richiesta
  {
    "user": {
      "email": "pinco_pallino@gmail.com",
      "password": "Pa55word"
    }
  }
  headers: {
    "Content-Type": "application/json"
  }

-> Risposta
  {
    "user": {
        "id": "5e88e4550a62940017d622e1",
        "email": "pinco_pallino@gmail.com",
        "token": "<token..>"
    }
  }
```

#### --> Crea posizione
```json
POST /drink_water/new

-> Richiesta
  {
      "latitude": "43.714501",
      "longitude": "12.855436"
  }
  headers: {
    Authorizaton: "Bearer <token utente>",
    "Content-Type": "application/json"
  }

-> Risposta
  {
      "_id": "5e88e6d60a62940017d622e2",
      "lat": "43.714501",
      "lng": "12.855436",
      "address": "Via Antonio Vivaldi, Ponte degli Alberi, Montefelcino, 
                  Pesaro e Urbino, Marche, 61034, Italia",
      "addedBy": "5e88e4550a62940017d622e1",
      "__v": 0
  }

```
#### --> Elimina posizione
```json
DELETE /drink_water/location/delete?id=<id posizione>

-> Richiesta

https://pdgt-project-app.herokuapp.com/drink_water/location/delete?id=5e88e6d60a62940017d622e2

  headers: {
    Authorizaton: "Bearer <token utente>",
    "Content-Type": "application/json"
  }

-> Risposta
  {
      "_id": "5e88e6d60a62940017d622e2",
      "lat": "43.714501",
      "lng": "12.855436",
      "address": "Via Antonio Vivaldi, Ponte degli Alberi, Montefelcino, 
                  Pesaro e Urbino, Marche, 61034, Italia",
      "addedBy": "5e88e4550a62940017d622e1",
      "__v": 0
  }

```
#### --> Modifica posizione
```json
PUT /drink_water/location/update?id=<id_posizione>

-> Richiesta

https://pdgt-project-app.herokuapp.com/drink_water/location/update?id=5e88e802913b3303309feb17

  headers: {
    Authorizaton: "Bearer <token utente>",
    "Content-Type": "application/json"
  }


-> Risposta
  {
      "lat": "43.748401",
      "lng": "12.914702",
      "address": "49, Via Vittorio Veneto, Borgaccio, Colli al Metauro, 
                  Pesaro e Urbino, Marche, 61036, Italia"
  }

```