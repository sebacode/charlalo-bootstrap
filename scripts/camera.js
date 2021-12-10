// Uso de TextDetector, API experimental en Chrome https://web.dev/shape-detection/

if (!('TextDetector' in window)) {
    document.querySelector("#camara section").innerHTML = "Detectar texto con tu cámara no está soportado en esta versión de la app para tu dispositivo. Es un servicio experimental disponible en Google Chrome para Android activando el flag 'Experimental Web Features'"
}

function abrirCamara() {
    navigator.mediaDevices.getUserMedia({ video: {
        facingMode: 'environment'
    }, audio: false })
        .then(stream => {
            document.querySelector("video").srcObject = stream;
            document.querySelector("video").play();
        })
        .catch(err => {
            console.log("An error occurred: " + err);
        });
}

function sacarFoto() {
    const video = document.querySelector("video");
    const canvas = document.createElement("canvas");
    const width = 800, height = 1600;
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);
    detectarConCamara(canvas);

    video.srcObject = null;
    video.pause();
}


async function detectarConCamara(image) {
    const textDetector = new TextDetector();
    try {
        const texts = await textDetector.detect(image);
        if (texts.length==0) {
            decir("No hay textos en la imagen");
            document.querySelector("output").innerHTML = "No se encontraron textos";
        } else {
            const fullText = texts.map(t=>t.rawValue).join(". ");
            document.querySelector("output").innerHTML = `<ul class="list-group mt-3">
				<li class="list-group-item d-flex justify-content-between align-items-start">
					${fullText}&nbsp;<a href="javascript:decir('${fullText}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-megaphone-fill" viewBox="0 0 16 16"><path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-11zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25.222 25.222 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56V3.224zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009a68.14 68.14 0 0 1 .496.008 64 64 0 0 1 1.51.048zm1.39 1.081c.285.021.569.047.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a65.81 65.81 0 0 1 1.692.064c.327.017.65.037.966.06z"/></svg></a>
				</li>
			</ul>`;
        }
    } catch (e) {
        console.log(e);
        decir("Hubo un error, no pudimos detectar texto");
    }
}
