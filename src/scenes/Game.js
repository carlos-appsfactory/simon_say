/*
    Escena principal del juego, donde esta la acción.
 */

import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create_button_hitbox(graphics, x, y, radius, start_rad, end_rad) {
        /* Calcula los puntos del tablero para */
        let p1 = { x: x, y: y }; // Centro
        let p2 = { x: x + Math.cos(start_rad) * radius, y: y + Math.sin(start_rad) * radius }; // Punto inicial del arco
        let p3 = { x: x + Math.cos(end_rad) * radius, y: y + Math.sin(end_rad) * radius }; // Punto final del arco

        /* Crear polígono interactivo */
        let hitArea = new Phaser.Geom.Polygon([p1.x, p1.y, p2.x, p2.y, p3.x, p3.y]);

        /* 🔹 Hacer clickeable */
        graphics.setInteractive(hitArea, Phaser.Geom.Polygon.Contains);
    }

    draw_button(graphics, x, y, inner_radius, outer_radius, color, start_rad, end_rad) {
        graphics.clear();
        
        graphics.fillStyle(color, 1);

        graphics.beginPath();
        graphics.moveTo(x, y);
        graphics.arc(x, y, outer_radius, start_rad, end_rad, false);
        graphics.lineTo(x + Math.cos(end_rad) * inner_radius, y + Math.sin(end_rad) * inner_radius);
        graphics.arc(x, y, inner_radius, end_rad, start_rad, true); 
        graphics.closePath();

        graphics.fillPath();
    }

    draw_board(centerX, centerY, button_inner_radius, button_outer_radius) {
        /* Establece el color de fondo */
        this.cameras.main.setBackgroundColor(0xeeeeee);

        /* Crea la base del tablero
            La base del tablero es un circulo gris sobre el que se colocarán los 4 botones

            Este botón se crea en el centro del canva y se le da un radio de un tercio del canva.
        */
        this.add.circle(centerX, centerY, this.scale.width / 3, 0x303030);

        /* Calcula los radios convertidos en radianes para dibujar los botones */
        let rad_0 = Phaser.Math.DegToRad(0);
        let rad_90 = Phaser.Math.DegToRad(90);
        let rad_180 = Phaser.Math.DegToRad(180);
        let rad_270 = Phaser.Math.DegToRad(270);
        let rad_360 = Phaser.Math.DegToRad(360);

        /* Arrray de botones, aquí se guardarán los botones con toda la información necesaria */
        this.buttons = [
            {
                base_color: 0x880000,
                bright_color: 0xff0000,
                start_rad: rad_0,
                end_rad: rad_90
            },
            {
                base_color: 0x008800,
                bright_color: 0x00ff00,
                start_rad: rad_90,
                end_rad: rad_180
            },
            {
                base_color: 0x000088,
                bright_color: 0x0000ff,
                start_rad: rad_180,
                end_rad: rad_270
            },
            {
                base_color: 0x888800,
                bright_color: 0xffff00,
                start_rad: rad_270,
                end_rad: rad_360
            }
        ]

        /* Bucle para dibujar los botones, se ejecuta 4 veces (una por botón) */
        for (let i = 0; i < this.buttons.length; i++) {
            /* Crea un objeto graphics, necesario para dibujar botones */
            let button_graphics = this.add.graphics();

            /* Saca todas las variables del botón */
            let base_color = this.buttons[i]['base_color'];
            let start_rad = this.buttons[i]['start_rad'];
            let end_rad = this.buttons[i]['end_rad'];

            /* Dibuja el botón */
            this.draw_button(button_graphics, centerX, centerY, button_inner_radius, button_outer_radius, base_color, start_rad, end_rad);

            /* Añade el boton al array para poder usarlo posteriormente */
            this.buttons[i]['graphics'] = button_graphics;
        }
    }

    create() {
        /* Centro horizontal del canva */
        let centerX = this.scale.width / 2;

        /* Centro vertical del canva */
        let centerY = this.scale.height / 2;

        /* Calcula el radio interior de los botones en base a la altura del canva */
        let button_inner_radius = this.scale.width / 3.5;

        /* Calcula el radio exterior de los botones en base a la altura del canva */
        let button_outer_radius = this.scale.width / 8;

        /* Dibuja el tablero */
        this.draw_board(centerX, centerY, button_inner_radius, button_outer_radius);
    }


    /*
    create ()
    {
        this.cameras.main.setBackgroundColor(0x00ff00);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
        */
}
