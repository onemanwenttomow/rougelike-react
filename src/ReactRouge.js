import React, { useRef, useEffect, useState } from "react";
import InputManager from "./inputManager";
import Player from "./Player";
import World from "./World";
import Spawner from "./Spawner";

const ReactRouge = ({ height, width, tileSize }) => {
    const canvasRef = useRef();
    //const [player, setPlayer] = useState(new Player(1, 2, tileSize))
    const [world, setWorld] = useState(new World(width, height, tileSize));
    let inputManager = new InputManager();

    const handleInput = (action, data) => {
        console.log(`handle input: ${action}: ${JSON.stringify(data)}`);
        let newWorld = new World();
        Object.assign(newWorld, world);
        newWorld.movePlayer(data.x, data.y);
        setWorld(newWorld);
    };

    useEffect(() => {
        // binding uinput manager
        inputManager.bindKeys();
        inputManager.subscribe(handleInput);
        return () => {
            inputManager.unbindKeys();
            inputManager.unsubscribe(handleInput);
        };
    });

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, width * tileSize, height * tileSize);
        world.draw(ctx);
    });

    useEffect(() => {
        let newWorld = new World();
        Object.assign(newWorld, world);
        newWorld.createCellularMap();
        setWorld(newWorld);
        newWorld.moveToSpace(world.player);
        let spawner = new Spawner(newWorld);
        spawner.spawnLoot(10);
        console.log('spawner: ',spawner);
        spawner.spawnMonsters(5);
        spawner.spawnStairs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={width * tileSize}
                height={height * tileSize}
                style={{ border: "1px solid black", background: 'DimGrey' }}
            ></canvas>
            <ul>
                {world.player.inventory.map((item, index) => 
                    ( 
                        <li key={index}>
                           {item.attributes.name}
                        </li>
                    )
                )}
            </ul>
            <ul>
                {world.history.map((item, index) => 
                    ( 
                        <li key={index}>
                           {item}
                        </li>
                    )
                )}
            </ul>
        </div>
        
    );
};

export default ReactRouge;
