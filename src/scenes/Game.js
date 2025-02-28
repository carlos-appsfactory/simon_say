/*
    Escena principal del juego, donde esta la acción.
 */

import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    draw_button (x, y, radius, base_color, bright_color, start_angle, end_angle){
        /* Convierte los angulos de grados a radianes para poder dibujar la forma. */
        let start_rad = Phaser.Math.DegToRad(start_angle);
        let end_rad = Phaser.Math.DegToRad(end_angle);

        /* Crea un objeto graphics, necesario para dibujar botones */
        let graphics = this.add.graphics();
        
        /* Establece que el botón se rellenará con un color */
        graphics.fillStyle(base_color, 1);

        /* Dibuja un botón como triangulo curvo 
            Dibuja una porción de círculo partiendo del centro (x, y), trazando una línea recta hasta el borde del círculo según el radius, luego un arco curvo desde startAngle hasta endAngle, y finalmente cerrando la forma con otra línea recta de regreso al centro.

            x, y: Coordenadas del centro del botón
            radius: Radio del botón
            Phaser.Math.DegToRad(90 * i): Angulo de inicio del botón
            Phaser.Math.DegToRad(90 * (i + 1)): Angulo de final del botón
            false: Si se dibuja en el sentido de las agujas del reloj o en sentido contrario
        */
        graphics.slice(x, y, radius, start_rad, end_rad, false);

        /* Rellena el botón con el color establecido */
        graphics.fillPath();
    }

    draw_board ()
    {
        /* Centro horizontal del canva */
        let centerX = this.scale.width / 2;

        /* Centro vertical del canva */
        let centerY = this.scale.height / 2;

        /* Establece el color de fondo */
        this.cameras.main.setBackgroundColor(0xeeeeee);

        /* Crea la base del tablero
            La base del tablero es un circulo gris sobre el que se colocarán los 4 botones

            Este botón se crea en el centro del canva y se le da un radio de un tercio del canva.
        */
        this.add.circle(centerX, centerY, this.scale.width / 3, 0x303030);

        /* Calcula el radio de los botones en base a la altura del canva */
        let button_radius = this.scale.height / 2.5;

        /* Especifica las caracteristicas de cada bottón (colores y angulos) */
        let button_definitions = [
            {
                base_color: 0x880000,
                bright_color: 0xff0000,
                start_angle: 0,
                end_angle: 90
            },
            {
                base_color: 0x008800,
                bright_color: 0x00ff00,
                start_angle: 90,
                end_angle: 180
            },
            {
                base_color: 0x000088,
                bright_color: 0x0000ff,
                start_angle: 180,
                end_angle: 270
            },
            {
                base_color: 0x888800,
                bright_color: 0xffff00,
                start_angle: 270,
                end_angle: 360
            }
        ]

        /* Bucle para dibujar los botones, se ejecuta 4 veces (una por botón) */
        for (let definition of button_definitions){
            this.draw_button(centerX, centerY, button_radius, definition['base_color'], definition['bright_color'], definition['start_angle'], definition['end_angle'])
        }


    


    }

    create ()
    {
        /* Arrray de botones, aquí se guardarán los botones para ser utilizados en cada momento */
        this.buttons = [];

        /* Dibuja el tablero */
        this.draw_board();

        console.log(this.buttons)



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
