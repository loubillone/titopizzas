// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
  // Renderizar productos
  renderizarProductos();

  // Event listener para el botón de WhatsApp
  document.getElementById('btn-enviar-whatsapp').addEventListener('click', enviarPedidoWhatsApp);

  // Smooth scroll para los enlaces del menú
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

