# Tracker Js

La libreria permette l'invio di eventi i traking al server.


# Log

I log contengono questi dati

- Client -> id del cliente impostato nella pagina html
- Instance -> id della istanza del cliente impostato nella pagina html
- Timestamp -> preso automaticamente al momento dell'invio del log
- DeviceID -> calcolato dalla classe DeviceID
- Action -> tipo di azione tracciata ["view","buy","click","interest","merge"]
- UserAgent -> Serve per calcolare le informazioni sottostanti
  - OS -> Sistema operativo
  - Browser
  - Mobile
- Geo ? -> Se disponibile il modulo con MaxMind
- PageTitle -> titolo della pagina visistata
- Prodotto -> in casi di acquisto possono essere passate le informazioni sull'acquisto
  - category
  - brand
  - quantity
  - price
  - currency
- referrer -> preso da document.referrer
- topics -> API di Google topics per registrare gli interessi degli utenti
