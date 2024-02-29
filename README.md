> _Fork_ deze leertaak en ga aan de slag. Onderstaande outline ga je gedurende deze taak in jouw eigen GitHub omgeving uitwerken. De instructie vind je in: [docs/INSTRUCTIONS.md](docs/INSTRUCTIONS.md)

# Pokemon squadpage
Dit is een website met een overzicht van alle eerste jaars FDND studenten met als thema pokemon.

## Inhoudsopgave
  * [Beschrijving](#beschrijving)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Gebruik](#gebruik)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
<!-- In de Beschrijving staat hoe je project er uit ziet, hoe het werkt en wat je er mee kan. -->
Als je de website opent krijg je een start pagina waar je een (starter) squad kunt kiezen. Als je op een squad klikt ga je naar die squadpage waar je alle leerlingen uit die squad kunt zien. Elke leerling heeft een (pokemon)kaartje met hun naam en een avatar/pokemon. Als je op dit kaartje klikt ga je naar die persoons z'n pagina die opgemaakt is als een pokedex.
<!-- Voeg een mooie poster visual toe 📸 -->


🌐 https://squadpage.onrender.com/

## Kenmerken
<!-- Bij Kenmerken staat welke technieken zijn gebruikt en hoe. Wat is de HTML structuur? Wat zijn de belangrijkste dingen in CSS? Wat is er met Javascript gedaan en hoe? Misschien heb je een framwork of library gebruikt? -->
Ik heb gebruik gemaakt van Node.js, Express, EJS, JavaScript en CSS bij het bouwen van de website. Ook heb ik gebruik gemaakt van de WHOIS API.
Met Node.js kun je server-side JavaScript schrijven, waardoor je gegevens uit een database kunt halen en erin kunt opslaan. Express is een framework voor Node.js waarmee je code gemakkelijker kunt schrijven. Het biedt een eenvoudigere manier om routes te definiëren en stelt je in staat om template talen zoals `ejs` te gebruiken. In je `ejs` schrijf je HTML gemengd met JavaScript om gegevens uit de database op je website weer te geven. Hierdoor kun je dynamische webpagina's maken voor elke leerling, zonder dat je voor elke leerling een apart HTML bestand hoeft aan te maken.

Ik heb 3 ejs-bestanden: 'index', 'squad' en 'person'. Deze bestanden zijn templates waarin gegevens uit de API worden opgehaald met JavaScript code. In mijn `server.js` heb ik routes aangemaakt voor elke squad en persoon, met behulp van `app.get('/squad/:id', function (request, response)` en `app.get('/person/:id', function (request, response)`. Door '/:id' toe te voegen aan het einde van de route, wordt er een unieke URL gemaakt voor elke squad/persoon. Als je een gedetailleerde uitleg wilt over hoe ik dat heb gedaan, kun je dit vinden in mijn [wiki](https://github.com/zoepje/connect-your-tribe-squad-page/wiki/3.-Bouwen).

## Installatie
<!-- Bij Installatie staat stap-voor-stap beschreven hoe je de development omgeving moet inrichten om aan de repository te kunnen werken. -->
1. Open deze repository in jouw editor (bijv. Visual Studio Code).
1. Open de terminal en voer het commando `npm install` in. Je gebruikt NPM om Express inclusief alle afhankelijkheden te installeren.
1. Start je server met `npm start`.
1. Pas alles aan naar eigen wens.

## Gebruik

## Bronnen

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
