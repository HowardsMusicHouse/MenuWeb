document.addEventListener("DOMContentLoaded", function() {
    // Código para el acordeón
    const sections = document.querySelectorAll(".menu-section");

    sections.forEach(section => {
        const toggle = section.querySelector(".section-toggle");
        
        toggle.addEventListener("click", () => {
            // 1. Añade la clase .clicked para el efecto de parpadeo
            toggle.classList.add("clicked");
            
            // 2. Remueve la clase .clicked después de 500ms (0.5 segundos)
            setTimeout(() => {
                toggle.classList.remove("clicked");
            }, 500);

            // 3. Alterna la clase 'collapsed' para mostrar/ocultar el contenido
            section.classList.toggle("collapsed");
        });
    });

    // Código para el desplazamiento suave (smooth scroll)
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

    // === INICIO: LÓGICA PARA PERSONALIZADOR DE CARTEL ===

    // Elementos del DOM para el modal
    const cartelBtns = document.querySelectorAll('.cartel-btn');
    const modal = document.getElementById('cartel-modal');
    
    // Si el modal no existe en la página, no se ejecuta el resto del código para evitar errores.
    if (modal) {
        const closeModalBtn = document.getElementById('close-modal');
        const inputs = [
            document.getElementById('fila1'),
            document.getElementById('fila2'),
            document.getElementById('fila3')
        ];
        const disponiblesContainer = document.getElementById('disponibles-container');

        // Inventario de letras según tus reglas
        const inventarioLetras = {
            'A': 4, 'E': 4, 'I': 4, 'O': 4, 'U': 4,
            'B': 2, 'C': 2, 'D': 2, 'F': 2, 'G': 2, 'H': 2, 'J': 2, 'K': 2,
            'L': 2, 'M': 2, 'N': 2, 'Ñ': 2, 'P': 2, 'Q': 2, 'R': 2, 'S': 2,
            'T': 2, 'V': 2, 'W': 2, 'X': 2, 'Y': 2, 'Z': 2
        };

        // Función para mostrar el contador de letras restantes
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

        // Función para contar cuántas veces se ha usado cada letra en los 3 campos
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

        // Función que se ejecuta cada vez que el usuario escribe algo
        function actualizarUI() {
            const usoActual = contarUso();
            renderizarLetrasDisponibles(usoActual);
        }

        // Función que previene escribir una letra si ya no quedan disponibles
        function handleKeyDown(event) {
            // Permitir siempre teclas de control (borrar, flechas, tab, etc.)
            const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Shift', 'Home', 'End'];
            if (event.ctrlKey || event.metaKey || teclasPermitidas.includes(event.key)) {
                return;
            }

            const tecla = event.key.toUpperCase();

            // Si es una letra del inventario, verificar disponibilidad
            if (inventarioLetras.hasOwnProperty(tecla)) {
                const usoActual = contarUso();
                const restantes = inventarioLetras[tecla] - (usoActual[tecla] || 0);
                if (restantes <= 0) {
                    event.preventDefault(); // Bloquear la tecla
                    const input = event.target;
                    input.classList.add('error');
                    setTimeout(() => input.classList.remove('error'), 300); // Feedback visual
                }
            } else if (tecla !== ' ') { // Si no es una letra del inventario y tampoco es un espacio
                event.preventDefault(); // Bloquear cualquier otra tecla (números, símbolos, etc.)
            }
        }
        
        // Funciones para abrir y cerrar el modal
        function abrirModal() {
            inputs.forEach(input => input.value = ''); // Limpiar campos al abrir
            actualizarUI(); // Actualizar el contador de letras
            modal.classList.add('visible');
        }

        function cerrarModal() {
            modal.classList.remove('visible');
        }

        // Asignar eventos a los botones y al modal
        cartelBtns.forEach(btn => btn.addEventListener('click', abrirModal));
        closeModalBtn.addEventListener('click', cerrarModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Cerrar si se hace clic en el fondo oscuro
                cerrarModal();
            }
        });

        // Asignar eventos de escritura a los campos de texto
        inputs.forEach(input => {
            input.addEventListener('input', actualizarUI);
            input.addEventListener('keydown', handleKeyDown);
        });
    }
    // === FIN: LÓGICA PARA PERSONALIZADOR DE CARTEL ===
});
