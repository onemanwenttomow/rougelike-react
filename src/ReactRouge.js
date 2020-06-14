import React, {useRef, useEffect, useState} from 'react';
import InputManager from './inputManager';
import Player from './Player';

const ReactRouge = ({height, width, tileSize}) => {
    const canvasRef = useRef();
    const [player, setPlayer] = useState(new Player(1, 2, tileSize))
    let inputManager = new InputManager();


    const handleInput = (action, data) => {
        console.log(`handle input: ${action}: ${JSON.stringify(data)}`);
        let newPlayer = new Player()
        Object.assign(newPlayer, player);
        newPlayer.move(data.x, data.y)
        setPlayer(newPlayer);
    }

    useEffect(() => {
        // binding uinput manager
        inputManager.bindKeys();
        inputManager.subscribe(handleInput);
        return () => {
            inputManager.unbindKeys();
            inputManager.unsubscribe(handleInput)
        }
    });

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, width*tileSize, height*tileSize);
        player.draw(ctx);
    });



    return (
        <canvas 
            ref={canvasRef}
            width={width * tileSize} 
            height={height * tileSize} 
            style={{border: '1px solid black'}}
        ></canvas>
    )
}

export default ReactRouge;