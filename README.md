# Ac_scrum_vol2 - projekt pri predmetu SMRPO na FRI, 2019
* oddaja 1, 25.03.2019
* Skupina S1(5): Jaka Kokošar, Jaka Krajnc, Janez Škrlj, Ladislav Škufca

# How to install


### Potrebujemo:

```
* nodejs - v10.13.0 - https://nodejs.org/en/
* docker - https://www.docker.com/
```

### Setup:
* npm install (če ne gre, uporabimo sudo)
* (zaženemo docker)
* docker run -d --name pg-database -e POSTGRES_USER=userDB -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgresDB -p 5432:5432 postgres:11.2

### Podatkovna baza
 - Nastavimo pravi ip baze v models/index.js ter config/config.json
 - Če želimo dodati novo tabelo (model) to dodamo v direktorij /models, lahko ga dodamo tudi z ukazom sequelize model:generate (gled dokumentacijo)
 - Za nov model kreiramo še seed file s katerim bomo napolnili bazo s testnimi podatki 
 - Tabele s testnimi podatki napolnimo z ukazom: sequelize db:seed:all (to storimo po tem, ko vsaj enkrat prej poženemo npm start)
 - ob ponovnem zagonu ukaza bo ukaz najverjetneje neuspešen, ker se izvede še en insert istih podatkov v bazo
 - zato se za polnjenje samo ene tabele (npr. nove) požene le delni seed primer:  sequelize db:seed --seed 20190306184731-project_roles
 - Za več info: [Sequelize dokumentacija](http://docs.sequelizejs.com/)


### Credentials za bazo (v IntelliJu v nastavitvah baze (Schemas) ne pozabit obkljukat "All databases"): 
 Priporočena namestitev uradnega Database plugina v kolikor uporabljate JetBrainsove produkte
 * POSTGRES_USER: userDB
 * POSTGRES_PASSWORD: postgres
 * POSTGRES_DB: postgresDB


### Ko smo zadevo že vzpostavili:
```
* npm start
* sequelize db:seed:all (samo prvič, da napolnimo testne podatke v bazo)
```

Odpremo localhost:3000.

Debagiranje:
https://stackoverflow.com/questions/9633280/can-i-add-a-debug-script-to-npm
Poženemo: npm run-script debug

### Uporabni linki:
* https://pugjs.org/api/getting-started.html
* https://html2jade.org/ - avtomatski pretvornik HTML v pug
