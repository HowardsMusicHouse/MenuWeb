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
});