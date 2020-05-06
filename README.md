# Game of Thrones - Graph

This is a sample PoC utilising Gremlin. I built this on top of Cosmos DB in Azure, but any Gremlin-compatible endpoint should work.

Note: the datasets aren't complete by any means, but it is good enough to get started; please feel free to submit a PR with updates!

## Pre-requisites
* npm
* nodejs
* Cosmos DB account w/ Gremlin API: free tier is available! https://azure.microsoft.com/en-us/try/cosmosdb/

## Getting started
* Edit config.js with your Cosmos DB endpoint and primary key
* Run npm install to get the required modules
* Run node app.js to upload the dataset

## Sample queries
**g.V()** : get all vertices

**g.V('jon_snow')**: get a particular vertex by ID

**g.V().hasLabel('house').values('name', 'words')** : filter vertices and select specific properties

**g.V('margaery_tyrell').both('marriage')** : explore relationships both inbound and outbound

**g.V().hasLabel('person').order().by(outE('killed').count(), decr)** : all people, in descending order by number of people they've killed

**g.V('cersei_lannister').outE('killed').inV().values('name')** : the names that a particular person has killed

**g.V('cersei_lannister').outE('killed').inV().outE('blood').inV()** : the houses of the people killed by a person; good for identifying feuds!

**g.V().hasLabel('person').group().by('seasonOfDeath').by(count())** : the number of deaths per season

**g.V('cersei_lannister').until(has('name','jon_snow').or().loops().is(30)).repeat(out()).path().by('name').simplePath()** : identify a path between two people, based on the defined relationships