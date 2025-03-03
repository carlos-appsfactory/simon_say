/*
    Escena principal del juego, donde esta la acción.
 */

import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    click_button(graphics, name, base_color, bright_color){
        /* Si no se acepta input del usuario, no hace nada */
        if (!this.accept_input) return;

        /* Deja de aceptar input del usuario mientras dure la animación */
        this.accept_input = false;

        /* Pinta la figura del color brillante */
        graphics.fillStyle(bright_color, 1); 
        graphics.fillPath();

        /* Guarda el botón pulsado en la lista de botones pulsados por el usuario */
        this.player_pressed.push(name);

        /* Espera un segundo antes de continuar */
        this.time.delayedCall(1000, () => {

            /* Vuelve a poner el color base */
            graphics.fillStyle(base_color, 1); 
            graphics.fillPath();

            /* Vuelve a permitir input del usuario */
            this.accept_input = true;
        }, [], this);
    }

    draw_button(graphics, x, y, inner_radius, outer_radius, base_color, bright_color, start_rad, end_rad) {
        /* Empieza el dibujo del botón */
        graphics.beginPath();

        /* Situa el punto de dibujo en lo que sería el centro del circulo */
        graphics.moveTo(x, y);

        /* Dibuja la linea del borde exterior en base a los radianes definidos. False indica que el circulo se hace en sentido horario */
        graphics.arc(x, y, outer_radius, start_rad, end_rad, false);

        /* Hace una linea recta desde el final del angulo hacía abajo en la dirección del angulo, buscando el punto donde empezará el arco interior. Para saber como moverse de forma recta, se calcula el seno y el coseno para calcular el movimiento dentro del circulo. */
        graphics.lineTo(x + Math.cos(end_rad) * inner_radius, y + Math.sin(end_rad) * inner_radius);

        /* Dibuja el angulo interior del circulo. True indica que el circulo se hace en sentido antihorario */
        graphics.arc(x, y, inner_radius, end_rad, start_rad, true); 

        /* Cierra el dibujo */
        graphics.closePath();

        /* Define que los botones tendrán color en su interior */
        graphics.fillStyle(base_color, 1);

        /* Pinta el interior de los botones */
        graphics.fillPath();

        /* Establece un número de puntos para dibujar el arco
            Las zonas interactivas se crean en base a poligonos que funcionan en zonas rectas. Para suavizar los bordes del botón, necesitaremos establecer un número de puntos. En este son 20.
        */
        let numPoints = 20;

        /* Variable para guardar los puntos que formaran los arcos. */
        let points = [];

        /* Crea los puntos del arco exterior */
        for (let i = 0; i <= numPoints; i++) {
            let t = start_rad + (i / numPoints) * (end_rad - start_rad);
            points.push({ x: x + Math.cos(t) * outer_radius, y: y + Math.sin(t) * outer_radius });
        }

        /* Crea los puntos del arco interior en orden inverso para cerrar la forma. */
        for (let i = numPoints; i >= 0; i--) {
            let t = start_rad + (i / numPoints) * (end_rad - start_rad);
            points.push({ x: x + Math.cos(t) * inner_radius, y: y + Math.sin(t) * inner_radius });
        }

        /* Crea una forma con los puntos especificados */
        let interactive_shape = new Phaser.Geom.Polygon(points);

        /* Establece una zona interactiva en base al poligono creado */
        graphics.setInteractive(interactive_shape, Phaser.Geom.Polygon.Contains);
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
                name: 'red',
                base_color: 0x880000,
                bright_color: 0xff0000,
                start_rad: rad_0,
                end_rad: rad_90
            },
            {
                name: 'green',
                base_color: 0x008800,
                bright_color: 0x00ff00,
                start_rad: rad_90,
                end_rad: rad_180
            },
            {
                name: 'blue',
                base_color: 0x000088,
                bright_color: 0x0000ff,
                start_rad: rad_180,
                end_rad: rad_270
            },
            {
                name: 'yellow',
                base_color: 0x888800,
                bright_color: 0xffff00,
                start_rad: rad_270,
                end_rad: rad_360
            }
        ]

        /* Variable de separación de los botones */
        let button_gap = this.scale.width / 50;

        /* Calcula el centro del circulo que forma cada botón 
            Para que los botones formen entre todos un circulo pero sin que los botones se toquen, se debe calcular su centro y desplazarlo ligeramente. 
            Esto se hace calculando el angulo central del botón dibujado y desplazando de forma recta el punto central del botón en dirección a ese angulo central.
        */
        for (let i = 0; i < this.buttons.length; i++) {
            let button = this.buttons[i];

            /* Calcula el angulo central en base al angulo de inicio + el angulo final dividido entre 2 */
            let mid_rad = (button['start_rad'] + button['end_rad']) / 2;

            /* Calcula el desplazamiento en X e Y del angulo central para saber cuanto mover el punto central del circulo. Esto se multiplica por la separación definida y se suma al numero del centro del canva */
            this.buttons[i]['x'] = centerX + Math.cos(mid_rad) * button_gap;
            this.buttons[i]['y'] = centerY + Math.sin(mid_rad) * button_gap;
        }

        /* Bucle para dibujar los botones, se ejecuta 4 veces (una por botón) */
        for (let i = 0; i < this.buttons.length; i++) {
            /* Crea un objeto graphics, necesario para dibujar los botones */
            let button_graphics = this.add.graphics();

            /* Saca todas las variables del botón */
            let button_x = this.buttons[i]['x'];
            let button_y = this.buttons[i]['y'];
            let base_color = this.buttons[i]['base_color'];
            let bright_color = this.buttons[i]['bright_color'];
            let start_rad = this.buttons[i]['start_rad'];
            let end_rad = this.buttons[i]['end_rad'];
            let button_name = this.buttons[i]['name'];

            /* Dibuja el botón */
            this.draw_button(button_graphics, button_x, button_y, button_inner_radius, button_outer_radius, base_color, bright_color, start_rad, end_rad);

            /* Crea un evento para cambiar el color del botón cuando se pulsa */
            button_graphics.on('pointerdown', () => {
                this.click_button(button_graphics, button_name, base_color, bright_color);
            });
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

        /* Variable para guardar los botones pulsados por el jugador */
        this.player_pressed = []

        /* Variable para guardar los botones pulsados por la máquina */
        this.machine_pressed = []

        /* Variable para aceptar input del usuario */
        this.accept_input = true;
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
