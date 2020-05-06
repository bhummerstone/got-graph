"use strict";

const Gremlin = require('gremlin');
const config = require("./config");

let people = require('./people.json');
let orders = require('./orders.json');
let allegiances = require('./allegiances.json');
let houses = require('./houses.json');
let killings = require('./killings.json');

const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${config.database}/colls/${config.collection}`, config.primaryKey)

const client = new Gremlin.driver.Client(
    config.endpoint, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }
);

async function dropGraph()
{
    console.log('Running Drop');

    const query = "g.V().drop()"

    const opts = {}
    
    try {
        await client.submit(query, opts);
    } catch (err) {
        console.log(err)
    }
    
}

async function addPeople() {

    console.log('Adding people, total: ' + people.length);
   
      // 'person' for context
    people.forEach(async (person) => {
          const fullName = (person.lastName === "")
              ? person.firstName
              : person.firstName + "_" + person.lastName;
  
  
          const query = "g.addV(label).property('id', id).property('name', name).property('seasonOfDeath', seasonOfDeath).property('episodeOfDeath', episodeOfDeath).property('meansOfDeath', meansOfDeath).property('portrayedBy', portrayedBy).property('partkey', partkey)"
  
          const opts = {
              label: "person",
              id: fullName,
              name: fullName,
              seasonOfDeath: person.seasonOfDeath,
              episodeOfDeath: person.episodeOfDeath,
              meansOfDeath: person.meansOfDeath,
              portrayedBy: person.portrayedBy,
              partkey: "gphgot"
          }

          try {
            await client.submit(query, opts);
          } catch (err) {
              //console.log(err)
          }
    });
}

async function addOrders() {
    
    console.log('Adding orders, total: ' + orders.length);

    orders.forEach(async (order) => {

        const query = "g.addV(label).property('id', id).property('name', name).property('partkey', partkey)"

        const opts = {
            label: "order",
            id: "order_" + order.name,
            name: order.name,
            partkey: "gphgot"
        }

        try {
            await client.submit(query, opts);
        } catch (err) {
            //console.log(err);
        }
    });
}

async function addHouses()
{
    console.log('Adding houses, total: ' + houses.length);

    houses.forEach(async (house) => {

        const query = "g.addV(label).property('id', id).property('name', name).property('words', words).property('partkey', partkey)"

        const opts = {
            label: "house",
            id: "house_" + house.name,
            name: house.name,
            words: house.words,
            partkey: "gphgot"
        }

        try {
            await client.submit(query, opts);
        } catch (err) {
            //console.log(err);
        }
    });
}

async function addAllegiances()
{
    console.log('Adding allegiances, total: '+ allegiances.length);
    
    allegiances.forEach(async (allegiance) => {
        const query = "g.V(source).addE(relationship).to(g.V(target))"

        const opts = {
            source: allegiance.source,
            relationship: allegiance.relationship,
            target: allegiance.destination
        }

        try {
            await client.submit(query, opts);
        } catch (err) {
            console.log(err);
        }        
    });
}

async function addKillings()
{
    console.log('Adding killings, total: ' + killings.length); 
    
    killings.forEach(async (killing) => {
        const query = "g.V(source).addE(relationship).to(g.V(target))"

        const opts = {
            source: killing.killer,
            relationship: "killed",
            target: killing.killee
        }

        try {
            await client.submit(query, opts);
        } catch (err) {
            console.log(err)
        }
    });
}

async function run()
{
    await dropGraph();
    await addPeople();
    await addOrders();
    await addHouses();
    await addAllegiances();
    await addKillings();

    console.log("Finished");
    console.log('Press any key to exit');
    
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

run();