function checkGuess() {
    if (attemptCount >= maxAttempts) {
        alert("Has alcanzado el número máximo de intentos");
        return;
    }

    const guessSequence = [
        document.getElementById('gnum1').value.trim(),
        document.getElementById('gnum2').value.trim(),
        document.getElementById('gnum3').value.trim(),
        document.getElementById('gnum4').value.trim(),
        document.getElementById('gnum5').value.trim(),
        document.getElementById('gnum6').value.trim()
    ];

    // Verificar si algún campo está vacío
    if (guessSequence.includes("")) {
        alert("Por favor, completa todos los campos antes de continuar.");
        return;
    }

    let guessText = '';
    let lostTurn = false; 

    for (let i = 0; i < 6; i++) {
        const guessNum = guessSequence[i];
        const isCorrect = guessNum === secretSequence[i];
        const revealed = document.getElementById(`secret-num${i + 1}`).innerText !== 'X';

        guessText += `<span class="${isCorrect ? 'correct-guess' : 'incorrect-guess'}">${guessNum}</span> `;

        if (isCorrect) {
            document.getElementById(`secret-num${i + 1}`).innerText = guessNum;
        } else if (revealed) {
            lostTurn = true; 
        }
    }

    // Mostrar mensaje de "Perdió un turno"
    const lostTurnMessageElement = document.getElementById('lost-turn-message');
    lostTurnMessageElement.style.display = lostTurn ? 'block' : 'none';

    // Crear un nuevo intento y mostrarlo
    const attemptElement = document.createElement('div');
    attemptElement.classList.add('attempt');
    attemptElement.innerHTML = `<strong>Intento ${attemptCount + 1}:</strong> ${guessText}`;
    
    const attemptsContainer = document.getElementById('attempts');
    attemptsContainer.insertBefore(attemptElement, attemptsContainer.firstChild);
    attemptsContainer.style.display = 'block';

    clearGuessFields();
    document.getElementById('gnum1').focus(); 

    attemptCount++;

    // Verificar si ganó
    if (JSON.stringify(guessSequence) === JSON.stringify(secretSequence)) {
        document.getElementById('secret-sequence').classList.remove('hidden');
        document.getElementById('restart-btn').style.display = 'block';
        document.getElementById('guess-numbers').style.display = 'none';
        document.getElementById('win-message').style.display = 'block';
        disableInputs();
        showConfetti();
    } else if (attemptCount >= maxAttempts) {
        document.getElementById('secret-sequence').classList.remove('hidden');
        document.getElementById('game-over-message').style.display = 'block';
        document.getElementById('restart-btn').style.display = 'block';
        document.getElementById('guess-numbers').style.display = 'none';

        for (let i = 0; i < 6; i++) {
            document.getElementById(`secret-num${i + 1}`).innerText = secretSequence[i];
        }
    }
}

  let tiempoRestante = 40;
        let intervalo;

        document.getElementById('iniciar').addEventListener('click', function() {
            clearInterval(intervalo); // Limpiar cualquier intervalo existente
            tiempoRestante = 40; // Reiniciar el contador a 30 segundos
            document.getElementById('contador').innerText = tiempoRestante;

            intervalo = setInterval(function() {
                tiempoRestante--;
                document.getElementById('contador').innerText = tiempoRestante;

                if (tiempoRestante <= 0) {
                    clearInterval(intervalo); // Detener el contador
                    // Reiniciar el contador
                    setTimeout(function() {
                        tiempoRestante = 40;
                        document.getElementById('contador').innerText = tiempoRestante;
                    }, 1000);
                }
            }, 1000);
        });






        let codigoSecreto = '';
        let resultadoGuardado = [];

        // Cargar el código y el resultado del localStorage al cargar la página
        window.onload = function() {
            const codigoGuardado = localStorage.getItem('codigoSecreto');
            if (codigoGuardado) {
                codigoSecreto = codigoGuardado;
                for (let i = 0; i < 6; i++) {
                    document.getElementById(`digito${i + 1}`).value = codigoGuardado[i];
                }
            }

            const resultadoAnterior = localStorage.getItem('resultadoAdivinanza');
            if (resultadoAnterior) {
                resultadoGuardado = JSON.parse(resultadoAnterior);
                mostrarResultado();
            }

            // Agregar evento de salto a cada input
            agregarEventoSalto('digito');
            agregarEventoSalto('adivina');
        };

        document.getElementById('guardar').addEventListener('click', guardarCodigo);
        document.getElementById('limpiar').addEventListener('click', limpiarCodigo);
        document.getElementById('adivinar').addEventListener('click', hacerAdivinanza);

        // Función para agregar eventos de salto
        function agregarEventoSalto(baseId) {
            for (let i = 1; i <= 6; i++) {
                const input = document.getElementById(`${baseId}${i}`);
                input.addEventListener('input', function() {
                    if (this.value.length === 1) {
                        const nextInput = document.getElementById(`${baseId}${i + 1}`);
                        if (nextInput) {
                            nextInput.focus();
                        }
                    }
                });
            }
        }

        // Función para guardar el código
        function guardarCodigo() {
            let codigo = '';
            for (let i = 1; i <= 6; i++) {
                const digito = document.getElementById(`digito${i}`).value;
                if (digito === '') {
                    alert('Por favor, completa todos los dígitos.');
                    return;
                }
                codigo += digito;
            }

            localStorage.setItem('codigoSecreto', codigo);
            codigoSecreto = codigo; // Guardar en la variable
            document.getElementById('resultado').style.color = 'green';
        }

        // Función para limpiar el código y el resultado
        function limpiarCodigo() {
            for (let i = 1; i <= 6; i++) {
                document.getElementById(`digito${i}`).value = '';
                document.getElementById(`adivina${i}`).value = ''; // Limpiar adivinanza
                document.getElementById(`digito${i}-res`).textContent = 'X'; // Reiniciar resultado a 'X'
            }
            localStorage.removeItem('codigoSecreto');
            localStorage.removeItem('resultadoAdivinanza'); // Limpiar el resultado guardado
            codigoSecreto = ''; // Limpiar la variable
            resultadoGuardado = []; // Limpiar el resultado guardado
            document.getElementById('resultado').style.color = 'red';
        }

        // Función para adivinar el código
        function hacerAdivinanza() {
            let adivina = '';
            for (let i = 1; i <= 6; i++) {
                const digito = document.getElementById(`adivina${i}`).value;
                if (digito === '') {
                    alert('Por favor, completa todos los dígitos de la adivinanza.');
                    return;
                }
                adivina += digito;
            }

            let resultadoActual = '';

            for (let i = 0; i < 6; i++) {
                if (codigoSecreto[i] === adivina[i]) {
                    resultadoActual += adivina[i]; // Revelar el dígito correcto
                    resultadoGuardado[i] = adivina[i]; // Guardar el dígito adivinado
                    document.getElementById(`digito${i + 1}-res`).textContent = adivina[i]; // Mostrar el dígito
                } else {
                    resultadoActual += 'X'; // Mostrar "X" si no coincide
                }
            }

            localStorage.setItem('resultadoAdivinanza', JSON.stringify(resultadoGuardado)); // Guardar el resultado en localStorage
            mostrarResultado(); // Mostrar el resultado actualizado
            // Limpiar los campos de adivinanza
            for (let i = 1; i <= 6; i++) {
                document.getElementById(`adivina${i}`).value = '';
            }
        }

        // Función para mostrar el resultado
        function mostrarResultado() {
            for (let i = 0; i < 6; i++) {
                const digito = resultadoGuardado[i] || 'X'; // Obtener el dígito o 'X' si no existe
                document.getElementById(`digito${i + 1}-res`).textContent = digito; // Mostrar el dígito en el span correspondiente
            }
            document.getElementById('resultado').style.color = 'black';
        }