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

    // === INICIO: LÓGICA REFORZADA PARA PERSONALIZADOR DE CARTEL ===

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
        
        // Función de conteo sin cambios, lee el estado actual de los inputs
        function contarUso() {
            const uso = {};
            const textoCompleto = inputs.map(input => input.value).join('').toUpperCase();
            for (const char of textoCompleto) {
                if (inventarioLetras.hasOwnProperty(char)) {
                    uso[char] = (uso[char] || 0) + 1;
                }
            }
            return uso;
        }

        // Nueva función de validación más robusta
        function handleInputValidation(event) {
            const input = event.target;
            const inputId = input.id;

            // 1. Tomamos una "foto" del estado actual de todos los inputs
            const currentValues = {};
            inputs.forEach(i => {
                currentValues[i.id] = i.value.toUpperCase();
            });

            // 2. Contamos el uso de letras basándonos en esa "foto"
            const usoActual = (function() {
                const uso = {};
                const textoCompleto = Object.values(currentValues).join('');
                for (const char of textoCompleto) {
                    if (inventarioLetras.hasOwnProperty(char)) {
                        uso[char] = (uso[char] || 0) + 1;
                    }
                }
                return uso;
            })();

            // 3. Verificamos si el estado actual es válido
            let esValido = true;
            for (const letra in usoActual) {
                if (usoActual[letra] > inventarioLetras[letra]) {
                    esValido = false;
                    break;
                }
            }

            // 4. Actuamos en consecuencia
            if (esValido) {
                // Si es válido, actualizamos el valor guardado y nos aseguramos de que esté en mayúsculas
                input.value = currentValues[inputId];
                lastValidValues[inputId] = currentValues[inputId];
            } else {
                // Si es inválido, forzamos la reversión al último estado bueno conocido
                input.value = lastValidValues[inputId];
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 500);
            }

            // 5. Al final, siempre actualizamos la interfaz de letras disponibles
            renderizarLetrasDisponibles(contarUso());
        }
        
        function abrirModal() {
            inputs.forEach(input => {
                input.value = '';
            });
            lastValidValues = { fila1: "", fila2: "", fila3: "" };
            renderizarLetrasDisponibles();
            modal.classList.add('visible');
        }

        function cerrarModal() {
            modal.classList.remove('visible');
        }

        // Asignación de eventos (sin cambios)
        cartelBtns.forEach(btn => btn.addEventListener('click', abrirModal));
        closeModalBtn.addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });

        inputs.forEach(input => {
            input.addEventListener('input', handleInputValidation);
        });
    }
    // === FIN: LÓGICA REFORZADA PARA PERSONALIZADOR DE CARTEL ===
});
