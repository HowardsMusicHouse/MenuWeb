document.addEventListener("DOMContentLoaded", function() {
    // Código para el acordeón (sin cambios)
    const sections = document.querySelectorAll(".menu-section");

    sections.forEach(section => {
        const toggle = section.querySelector(".section-toggle");
        
        toggle.addEventListener("click", () => {
            toggle.classList.add("clicked");
            setTimeout(() => {
                toggle.classList.remove("clicked");
            }, 500);
            section.classList.toggle("collapsed");
        });
    });

    // Código para el desplazamiento suave (smooth scroll) (sin cambios)
    const backToTopBtn = document.getElementById("back-to-top");
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // === INICIO: LÓGICA CORREGIDA PARA PERSONALIZADOR DE CARTEL (COMPATIBLE CON CELULARES) ===

    const cartelBtns = document.querySelectorAll('.cartel-btn');
    const modal = document.getElementById('cartel-modal');
    
    if (modal) {
        const closeModalBtn = document.getElementById('close-modal');
        const inputs = [
            document.getElementById('fila1'),
            document.getElementById('fila2'),
            document.getElementById('fila3')
        ];
        const disponiblesContainer = document.getElementById('disponibles-container');

        // Almacenará el último texto válido para poder revertir si el usuario se pasa de letras
        let lastValidValues = {
            fila1: "",
            fila2: "",
            fila3: ""
        };

        const inventarioLetras = {
            'A': 4, 'E': 4, 'I': 4, 'O': 4, 'U': 4,
            'B': 2, 'C': 2, 'D': 2, 'F': 2, 'G': 2, 'H': 2, 'J': 2, 'K': 2,
            'L': 2, 'M': 2, 'N': 2, 'Ñ': 2, 'P': 2, 'Q': 2, 'R': 2, 'S': 2,
            'T': 2, 'V': 2, 'W': 2, 'X': 2, 'Y': 2, 'Z': 2
        };

        function renderizarLetrasDisponibles(letrasUsadas = {}) {
            disponiblesContainer.innerHTML = '';
            for (const letra in inventarioLetras) {
                const restantes = inventarioLetras[letra] - (letrasUsadas[letra] || 0);
                const span = document.createElement('span');
                span.className = 'letra-count';
                if (restantes <= 0) {
                    span.classList.add('agotado');
                }
                span.textContent = `${letra}: ${restantes}`;
                disponiblesContainer.appendChild(span);
            }
        }

        function contarUso() {
            const uso = {};
            // Unimos el texto de los 3 inputs para el conteo total
            const textoCompleto = inputs.map(input => input.value).join('').toUpperCase();
            for (const char of textoCompleto) {
                if (inventarioLetras.hasOwnProperty(char)) {
                    uso[char] = (uso[char] || 0) + 1;
                }
            }
            return uso;
        }

        // Nueva función principal que se ejecuta con el evento 'input'
        function handleInputValidation(event) {
            const usoActual = contarUso();
            let esValido = true;

            // 1. Comprueba si alguna letra excede el inventario
            for (const letra in usoActual) {
                if (usoActual[letra] > inventarioLetras[letra]) {
                    esValido = false;
                    break;
                }
            }
            
            const input = event.target;
            const inputId = input.id;

            // 2. Si el texto NO es válido, revierte al valor anterior
            if (!esValido) {
                input.value = lastValidValues[inputId];
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 500);
            } else {
            // 3. Si ES válido, actualiza el valor guardado
                // Forzamos mayúsculas para consistencia
                input.value = input.value.toUpperCase();
                lastValidValues[inputId] = input.value;
            }

            // 4. Actualiza el contador de letras con el estado final (ya sea nuevo o revertido)
            renderizarLetrasDisponibles(contarUso());
        }
        
        function abrirModal() {
            // Resetea los campos y los valores guardados cada vez que se abre
            inputs.forEach(input => {
                input.value = '';
            });
            lastValidValues = { fila1: "", fila2: "", fila3: "" };
            renderizarLetrasDisponibles(); // Actualiza la UI al estado inicial
            modal.classList.add('visible');
        }

        function cerrarModal() {
            modal.classList.remove('visible');
        }

        // Asignación de eventos
        cartelBtns.forEach(btn => btn.addEventListener('click', abrirModal));
        closeModalBtn.addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });

        // Asignamos el nuevo manejador de eventos a los campos de texto
        inputs.forEach(input => {
            // El evento 'input' es el correcto para celulares y computadoras
            input.addEventListener('input', handleInputValidation);
        });
    }
    // === FIN: LÓGICA CORREGIDA PARA PERSONALIZADOR DE CARTEL ===
});
