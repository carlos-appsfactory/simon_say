/*
    Escena principal del juego, donde esta la acción.
 */

import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    init(){
        /* Variables para guardar los botones pulsados por el jugador y la máquina */
        this.player_pressed = []
        this.machine_pressed = []

        /* Variables para saber de quien es el turno */
        this.player_turn = false;
        this.machine_turn = true;

        /* Variable para guardar la puntuación del jugador */
        this.score = 0;

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
                end_rad: rad_90,
                sound: this.sound.add('red_sound')
            },
            {
                base_color: 0x008800,
                bright_color: 0x00ff00,
                start_rad: rad_90,
                end_rad: rad_180,
                sound: this.sound.add('green_sound')
            },
            {
                base_color: 0x000088,
                bright_color: 0x0000ff,
                start_rad: rad_180,
                end_rad: rad_270,
                sound: this.sound.add('blue_sound')
            },
            {
                base_color: 0x888800,
                bright_color: 0xffff00,
                start_rad: rad_270,
                end_rad: rad_360,
                sound: this.sound.add('yellow_sound')
            }
        ];
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

        /* Establece el color de fondo */
        this.cameras.main.setBackgroundColor(0xeeeeee);

        /* Crea la base del tablero
            La base del tablero es un circulo gris sobre el que se colocarán los 4 botones

            Este botón se crea en el centro del canva y se le da un radio de un tercio del canva.
        */
        this.add.circle(centerX, centerY, this.scale.width / 3, 0x303030);

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

            /* Guarda el objeto graphics del botón para poder utilizarlo más tarde */
            this.buttons[i]['graphics'] = button_graphics;

            /* Saca todas las variables del botón */
            let button_x = this.buttons[i]['x'];
            let button_y = this.buttons[i]['y'];
            let base_color = this.buttons[i]['base_color'];
            let bright_color = this.buttons[i]['bright_color'];
            let start_rad = this.buttons[i]['start_rad'];
            let end_rad = this.buttons[i]['end_rad'];
            let sound = this.buttons[i]['sound'];

            /* Dibuja el botón */
            this.draw_button(button_graphics, button_x, button_y, button_inner_radius, button_outer_radius, base_color, start_rad, end_rad);

            /* Crea un evento para cambiar el color del botón cuando se pulsa */
            button_graphics.on('pointerdown', () => {
                this.click_button(i, button_graphics, base_color, bright_color, sound);
            });
        }

        /* Crea un cuadro de texto en el centro de la pantalla para mostrar la puntuación.
            Se tiene que poner el origin en 0.5 para que el texto este centrado en base a su propio centro, de lo contrario estaría alineado en base a su esquina superior izquierda.

            Además, sube la resolución para que el texto no se vea tan borroso
        */
        this.score_board = this.add.text(centerX, centerY, '0', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            resolution: 2
        }).setOrigin(0.5, 0.5);
    }

    update(){
        /* Actua si es el turno de la máquina */
        if (this.machine_turn){
            /* Desactiva el turno de la máquina para que no se repita el bucle infinitamente */ 
            this.machine_turn = false;

            /* Selecciona un botón aleatorio en base a su indice (entre 0 y 3) */
            let new_button = Math.floor(Math.random() * 4);

            /* Guarda el botón pulsado en la lista de botones pulsados por la máquina */
            this.machine_pressed.push(new_button);

            /* Crea un bucle para pulsar la secuencia de botones
                Este bucle se ejecuta una vez por cada botón registrado en la secuencia, dejando una separación de un segundo y medio entre ejecuciones.

            */
            let counter = 0;
            let press_length = this.machine_pressed.length;
            let press_buttons_event = this.time.addEvent({
                delay: 1500,
                loop: true,
                callback: () => {
                    /* Identifica el indice del botón pulsado y lo utiliza para saber que botón se ha pulsado. */
                    let pressed_button_index = this.machine_pressed[counter];
                    let pressed_button = this.buttons[pressed_button_index];

                    /* Guarda las variables del botón y las pasa al método para iluminar el botón */
                    let graphics = pressed_button['graphics'];
                    let base_color = pressed_button['base_color'];
                    let bright_color = pressed_button['bright_color'];
                    let sound = pressed_button['sound'];

                    this.enlighten_button(graphics, base_color, bright_color, sound);

                    /* Aumenta el contador para leer el siguiente botón en la próxima iteración */
                    counter++;

                    /* Cuando el contador iguale la longitud de la lista de botones pulsados, devuelve el turno al jugador y rompe el bucle. */
                    if (counter >= press_length) {
                        this.player_turn = true;
                        press_buttons_event.remove();
                    }
                }
            });
        }
    }

    click_button(pressed_button, graphics, base_color, bright_color, sound){
        /* Si no es el turno del usuario, no se puede pulsar el botón */
        if (!this.player_turn) return;

        /* Pausa el turno del usuario mientras dure la animación */
        this.player_turn = false;

        /* Crea el efecto de iluminado en el botón */
        this.enlighten_button(graphics, base_color, bright_color, sound);

        /* Coge el indice para comprobar la posición del botón en la secuencia */
        let pressed_index = this.player_pressed.length

        /* Coge el botón correcto de la lista de botones pulsados por la máquina */
        let correct_button = this.machine_pressed[pressed_index];

        if (correct_button != pressed_button){
            this.scene.start('GameOver', { score: this.score });
        }

        /* Guarda el botón pulsado en la lista de botones pulsados por el jugador */
        this.player_pressed.push(pressed_button);

        /* Espera un segundo antes de continuar */
        this.time.delayedCall(1000, () => {
            /* Si el jugador ya ha pulsado la secuencia de botones completa */
            if (this.machine_pressed.length == this.player_pressed.length){
                /* Vacía la lista de botones pulsados por el jugador para el siguiente turno */
                this.player_pressed = [];

                /* Aumenta la puntuación en 1 y actualiza el texto */
                this.score += 1;
                this.score_board.setText(this.score);

                /* Devuelve el turno a la máquina para que pulse el siguiente botón */
                this.player_turn = false;
                this.machine_turn = true;

            /* Si al jugador aun le quedan botones en la secuencia por pulsar */
            } else {
                /* Reanuda el turno del jugador para que siga clicando */
                this.player_turn = true;
            }
        }, [], this);
    }

    draw_button(graphics, x, y, inner_radius, outer_radius, color, start_rad, end_rad) {
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
        graphics.fillStyle(color, 1);

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

    enlighten_button(graphics, base_color, bright_color, sound){
        /* Pinta la figura del color brillante */
        graphics.fillStyle(bright_color, 1); 
        graphics.fillPath();

        /* Reproduce el sonido del botón pulsado */
        sound.play();

        /* Espera un segundo antes de continuar */
        this.time.delayedCall(1000, () => {
            /* Vuelve a poner el color base */
            graphics.fillStyle(base_color, 1); 
            graphics.fillPath();
        }, [], this);
    }
}
