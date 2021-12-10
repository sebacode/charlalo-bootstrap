// Script de administración general de la App Chárlalo

// Navega a una sección de la app (hijos directos de <main>)
function ir(seccionID) {
    Array.from(document.querySelectorAll("main>article")).forEach(
        seccion => { 
			seccion.style.display = 'none';
			document.querySelector("#nav_" + seccion.id).classList.remove("active");
		}
    );
    document.querySelector("#" + seccionID).style.display = 'block';
    document.querySelector("#" + seccionID).classList.remove("d-none");
	document.querySelector("#nav_" + seccionID).classList.add("active");
}
ir('charla');

// Confirma un mensaje a ser incorporado a la charla
function confirmar() {
    const texto = document.querySelector("textarea").value;
    if (texto.length > 0) {
        const mensaje = `<li class="list-group-item d-flex justify-content-between align-items-start">${texto}
          <a href="javascript:decir('${texto}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-megaphone-fill" viewBox="0 0 16 16"><path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-11zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25.222 25.222 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56V3.224zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009a68.14 68.14 0 0 1 .496.008 64 64 0 0 1 1.51.048zm1.39 1.081c.285.021.569.047.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a65.81 65.81 0 0 1 1.692.064c.327.017.65.037.966.06z"/></svg></a>
        </li>`;
        document.querySelector("#charla ul").innerHTML += mensaje;
        decir(texto);
    }
    document.querySelector("textarea").value = "";
}

// Limpia el chat de conversación
function limpiar() {
    if (confirm("¿Borramos toda la charla?")) {
        document.querySelector("#charla ul").innerHTML  = "";
    }
}

// Carga pictogramas
async function cargarPictogramas() {
   const respuesta = await fetch("./pictogramas.json");
   const lista = await respuesta.json();
   lista.forEach(pictograma => {
       const li = `<li class="list-group-item d-flex justify-content-between align-items-start border border-primary">
       <a class='container-fluid text-center' href='javascript:decir("${pictograma.nombre}")'>
        <img class="img-fluid" src='imagenes/pictogramas/${pictograma.archivo}' 
        alt='${pictograma.nombre}'>       
        <span class="d-block p-2 bg-primary text-white">${pictograma.nombre}</span>
       </a>
       </li>`;
       document.querySelector("#pictogramas ul").innerHTML += li;
   })
}
cargarPictogramas();

// Registro del Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./serviceworker.js");
}

// Para el botón de Instalar
let bipEvent = null;
window.addEventListener("beforeinstallprompt", event => {
    bipEvent = event;
    console.log("BIP");
    document.querySelector("#instalar").style.display = "block";
});
function instalar() {
    if (bipEvent) bipEvent.prompt();
}
