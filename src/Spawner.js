import Loot from "./Loot";
import Monster from "./Monster";
import Stairs from "./Stairs";

const lootTable = [
    {
        name: "Long Sword",
        color: "drakgrey",
        ascii: "/",
        offset: { x: 6, y: 3 },
    },
    {
        name: "Health Potion",
        color: "red",
        ascii: "!",
        offset: { x: 6, y: 3 },
    },
    {
        name: "Gold Coin",
        color: "yellow",
        ascii: "$",
        offset: { x: 3, y: 3 },
    },
    {
        name: "Light Armour",
        color: "lightgrey",
        ascii: "]",
        offset: { x: 6, y: 3 },
    },
];

const monsterTable = [
    {
        name: 'Orc',
        color: 'darkgreen',
        ascii: 'o',
        offset: {x: 4, y: 3},
        health: 5
    },
    {
        name: 'Goblin',
        color: 'lightgreen',
        ascii: 'g',
        offset: {x: 4, y: 1},
        health: 3
    }
]

class Spawner {
    constructor(world) {
        this.world = world;
    }

    spawn(spawnCount, createEntity) {
        for (let count = 0; count < spawnCount; count++) {
            let entity = createEntity();
            this.world.add(entity);
            this.world.moveToSpace(entity);
        }
    }

    spawnLoot(spawnCount) {
        this.spawn(spawnCount, () => {
            return new Loot(
                getRandomInt(this.world.width - 1),
                getRandomInt(this.world.height - 1),
                this.world.tileSize,
                lootTable[getRandomInt(lootTable.length)]
            );
        });
    }

    spawnMonsters(spawnCount) {
        this.spawn(spawnCount, () => {
            return new Monster(
                getRandomInt(this.world.width - 1),
                getRandomInt(this.world.height - 1),
                this.world.tileSize,
                monsterTable[getRandomInt(monsterTable.length)]
            );
        });
    }

    spawnStairs() {
        const stairs = new Stairs(this.world.width - 10, this.world.height -10, this.world.tileSize);
        console.log('stairs: ',stairs);
        this.world.add(stairs);
        this.world.moveToSpace(stairs);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export default Spawner;
