/*
    Escena que se muestra cuando el juego acaba.
 */

import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init(data){
        /* Recoge la puntuación enviada desde la otra escena. Si no hay puntuación, pone 0. */
        this.final_score = data.score || 0;
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        /* Pone el texto de puntuación final con el texto de la puntuación conseguida */
        this.add.text(this.scale.width / 2, this.scale.height / 2, `Puntuación Final:\n${this.final_score}`, {
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5, 0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
