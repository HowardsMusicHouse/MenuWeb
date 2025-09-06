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

    // === INICIO: LÓGICA FINAL PARA PERSONALIZADOR DE CARTEL (CON FILTRO DE CARACTERES) ===

    const cartelBtn = document.getElementById('cartel-btn');
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
            'A': 5, 'E': 3, 'I': 4, 'O': 4, 'U': 4,
            'B': 2, 'C': 2, 'D': 2, 'F': 3, 'G': 2, 'H': 2, 'J': 2, 'K': 2,
            'L': 2, 'M': 2, 'N': 2, 'Ñ': 2, 'P': 2, 'Q': 2, 'R': 2, 'S': 2,
            'T': 1, 'V': 2, 'W': 2, 'X': 2, 'Y': 2, 'Z': 2
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
            const textoCompleto = inputs.map(input => input.value).join('').toUpperCase();
            for (const char of textoCompleto) {
                if (inventarioLetras.hasOwnProperty(char)) {
                    uso[char] = (uso[char] || 0) + 1;
                }
            }
            return uso;
        }

        // Función de validación con el nuevo filtro de caracteres
        function handleInputValidation(event) {
            const input = event.target;
            const inputId = input.id;

            // 1. **FILTRO DE CARACTERES**: Limpiamos el texto al instante.
            // Se convierte a mayúsculas y se elimina cualquier carácter que NO sea A-Z, Ñ o un espacio.
            // Por ejemplo, "aá1!" se convierte en "AA".
            const sanitizedValue = input.value.toUpperCase().replace(/[^A-ZÑ ]/g, '');
            
            // Forzamos al campo de texto a mostrar únicamente el valor limpio.
            // Esto le da al usuario una respuesta inmediata, ya que los caracteres no válidos ni siquiera aparecerán.
            input.value = sanitizedValue;

            // 2. **VALIDACIÓN DE INVENTARIO**: Ahora que el texto está limpio, contamos las letras.
            const usoActual = contarUso();
            let exceedsInventory = false;
            for (const letra in usoActual) {
                if (usoActual[letra] > inventarioLetras[letra]) {
                    exceedsInventory = true;
                    break;
                }
            }
            
            // 3. **ACCIÓN FINAL**: Decidimos si revertir o aceptar el nuevo texto.
            if (exceedsInventory) {
                // Si se excede el inventario, revertimos al último estado válido conocido.
                input.value = lastValidValues[inputId];
                input.classList.add('error');
                setTimeout(() => input.classList.remove('error'), 500);
            } else {
                // Si el conteo es correcto, el texto limpio es el nuevo estado válido.
                lastValidValues[inputId] = input.value;
            }

            // 4. **ACTUALIZACIÓN DE UI**: Reflejamos el estado final en el contador de letras.
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
        cartelBtn.addEventListener('click', abrirModal);
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
    // === FIN: LÓGICA FINAL PARA PERSONALIZADOR DE CARTEL ===
});
