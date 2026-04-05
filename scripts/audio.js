function comenzarInvitacion() {
  const overlay = document.getElementById("overlay-inicio");
  const musica = document.getElementById("musica-fondo");
  const contenido = document.querySelector(".contenido-inicio");

  // 1. Reproducir música
  musica.play().catch((error) => {
    console.log("El navegador bloqueó el audio: ", error);
  });

  // 2. Animación de salida del botón
  contenido.classList.remove("animate__fadeIn");
  contenido.classList.add("animate__zoomOut");

  // 3. Ocultar el overlay suavemente
  setTimeout(() => {
    overlay.classList.add("overlay-hidden");
  }, 600);
}
