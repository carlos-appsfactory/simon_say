/*
    Escena de inicio en la que se precargan los assets necesarios para el juego.
*/

import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');

        this.load.audio('red_sound', 'assets/red_sound.mp3')
        this.load.audio('green_sound', 'assets/green_sound.mp3')
        this.load.audio('blue_sound', 'assets/blue_sound.mp3')
        this.load.audio('yellow_sound', 'assets/yellow_sound.mp3')
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
