$(document).ready(function() {
  $('#fullpage').fullpage({
    anchors: ['inicio', 'nosotros', 'cazadores1', 'cazadores2', 'galeria', 'contacto'],
    menu: '#myMenu',
    autoScrolling: true,
    scrollHorizontally: true,
    navigation: true,
    navigationPosition: 'right',
    scrollingSpeed: 800,
    onLeave: function(origin, destination, direction) {
      $('.navbar-collapse').collapse('hide');
    }
  });

  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    alert('¡Solicitud enviada a la Asociacion de Cazadores!');
    this.reset();
  });
});