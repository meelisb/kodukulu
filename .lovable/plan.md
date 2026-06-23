## Kasuta icon-192 favicon'ina

Manifest juba viitab `icon-192.png` ja `icon-512.png` ikoonidele PWA jaoks — see osa on korras ja jääb muutmata.

Brauseri favicon viidet `index.html`-is praegu pole, seega brauser laeb vaikimisi vana `/favicon.ico` faili. Lisame `<head>` sektsiooni:

```html
<link rel="icon" type="image/png" href="/icon-192.png" />
```

Kustutame ka `public/favicon.ico` faili, et brauserid ei laeks enam vana ikooni vaikimisi `/favicon.ico` päringuga.

### Märkused

- 192×192 PNG on favicon'ina suurem kui vaja, aga brauser skaleerib selle ja see on visuaalselt korrektne. Kui hiljem soovid teravamat väikest ikooni, saan genereerida eraldi 32×32 või 48×48 `favicon.png` faili olemasoleva 192-st.
- Juba paigaldatud PWA kasutajatel võib vana ikoon vahemällu jääda — uuendus jõuab pärale, kui brauser/OS ikoonid värskendab.
