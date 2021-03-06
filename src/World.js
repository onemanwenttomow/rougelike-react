import { Map } from 'rot-js';
import Player from './Player';

class World {
    constructor(width, height, tileSize) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.entities = [new Player(1, 1, tileSize)];
        this.history = ['You enter the dungeon', '-----'];


        // 2 dimensional array
        this.worldmap = new Array(this.width);
        for (let x = 0; x < this.width; x++) {
            this.worldmap[x] = new Array(this.height);
        }
        // wall or not a wall (1 and 0);
        // console.log('this.worldmap: ',this.worldmap);
    }

    get player() {
        return this.entities[0]
    }

    add(entity) {
        this.entities.push(entity);
    }

    remove(entity) {
        this.entities = this.entities.filter(e => e !== entity)
    }

    addToHistory(history) {
        this.history.push(history);
        if (this.history.length > 6) {
            this.history.shift();
        }
    }

    moveToSpace(entity) {
        for (let x = entity.x; x < this.width; x++) {
            for (let y = entity.y; y < this.height; y++) {
                if (this.worldmap[x][y] === 0 && !this.getEntityAtLocation(x, y)) {
                    entity.x = x;
                    entity.y = y;
                    return;
                }  
            }
        }
    }

    getEntityAtLocation(x, y) {
        return this.entities.find(entity => entity.x === x && entity.y === y);
    }

    movePlayer(dx, dy) {
        let tempPlayer = this.player.copyPlayer();
        tempPlayer.move(dx, dy);


        let entity = this.getEntityAtLocation(tempPlayer.x, tempPlayer.y);

        if (entity) {
            console.log("entity, ", entity);
            entity.action('bump', this);
            return;
        }

        if (this.isWall(tempPlayer.x, tempPlayer.y)) {
            console.log(`way blocked at ${tempPlayer.x} : ${tempPlayer.y}`);
            return;
        } 
        this.player.move(dx, dy);
    }

    isWall(x, y) {
        return(this.worldmap[x] === undefined || this.worldmap[y] === undefined || this.worldmap[x][y] === 1);
    }

    // createRandomMap() {
    //     for (let x = 0; x < this.width; x++) {
    //         for (let y = 0; y < this.height; y++) {
    //             this.worldmap[x][y] = Math.round(Math.random());
    //         }
    //     }
    // }

    createCellularMap() {
        // let map = new Map.Digger(this.width, this.height, {connected: true});
        let map = new Map.Cellular(this.width, this.height, {connected: true});
        map.randomize(0.5);
        let userCallback = (x, y, value) => {
            // console.log('value: ',value);
            if (x === 0 || y === 0 || x === this.width -1 || y === this.height -1) {
                this.worldmap[x][y] = 1; // create walls around edges of map
                return;
            }
            this.worldmap[x][y] = value === 0 ? 1 : 0;
        }
        map.create(userCallback);
        map.connect(userCallback, 1) // empty spaces considered 1
    }

    draw(context) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.worldmap[x][y] === 1) {
                    this.drawWall(context, x, y)
                };
            }
        }
        this.entities.forEach(entity => {
            entity.draw(context);
        })
        // console.log('this.worldmap after draw: ',this.worldmap);
    }

    drawWall(context, x, y) {
        context.fillStyle = '#000';
        context.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);

    }
}

export default World;