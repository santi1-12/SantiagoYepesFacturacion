document.getElementById('facturaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Tomar valores
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const tipoServicio = parseInt(document.getElementById('tipoServicio').value);
    const equipos = parseInt(document.getElementById('equipos').value);
    const dias = parseInt(document.getElementById('dias').value);
    const diasAdicionales = parseInt(document.getElementById('diasAdicionales').value);

    // Generar ID automático
    const idCliente = generarIdCliente();

    // Validaciones estrictas
    const nombreValido = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,}$/.test(nombre);
    const telefonoValido = /^[0-9]{7,15}$/.test(telefono);
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nombreValido) {
        alert("Nombre inválido. Debe contener solo letras y tener mínimo 3 caracteres.");
        return;
    }
    if (!telefonoValido) {
        alert("Teléfono inválido. Debe contener mínimo 7 dígitos numéricos.");
        return;
    }
    if (!emailValido) {
        alert("Email inválido. Debe ser un correo con formato correcto.");
        return;
    }
    if (isNaN(tipoServicio) || tipoServicio < 1 || tipoServicio > 3) {
        alert("Debe seleccionar un tipo de servicio válido.");
        return;
    }
    if (equipos < 2) {
        alert("Debe alquilar al menos 2 equipos.");
        return;
    }
    if (dias < 1) {
        alert("Debe alquilar por al menos 1 día.");
        return;
    }
    if (diasAdicionales < 0) {
        alert("Los días adicionales no pueden ser negativos.");
        return;
    }

    // Cálculo
    const valorPorDia = 35000;
    let valorAlquiler = equipos * dias * valorPorDia;
    let valorAdicionales = equipos * diasAdicionales * valorPorDia;

    // Descuento por días adicionales (1% por día, máx 6%)
    let descuentoAdicional = Math.min(diasAdicionales * 0.01, 0.06);
    let valorDescuentoAdicional = equipos * diasAdicionales * valorPorDia * descuentoAdicional;
    valorAdicionales *= (1 - descuentoAdicional);

    let incremento = 0;
    let descuento = 0;
    let tipoServicioTexto = "";
    let descripcionServicio = "";
    const beneficiosAplicados = [];

    // Determinar tipo de servicio y beneficios
    switch (tipoServicio) {
        case 1:
            tipoServicioTexto = "Dentro de la Ciudad";
            descripcionServicio = "No aplica descuento ni recargo.";
            break;
        case 2:
            tipoServicioTexto = "Fuera de la Ciudad";
            descripcionServicio = "Se aplica un recargo del 5% por servicio fuera de la ciudad.";
            incremento = 0.05 * (valorAlquiler + valorAdicionales);
            beneficiosAplicados.push("Se aplicó un recargo del 5% por alquiler fuera de la ciudad.");
            break;
        case 3:
            tipoServicioTexto = "Dentro del Establecimiento";
            descripcionServicio = "Se aplica un descuento del 5% por uso dentro del establecimiento.";
            descuento = 0.05 * (valorAlquiler + valorAdicionales);
            beneficiosAplicados.push("Se aplicó un descuento del 5% por uso dentro del establecimiento.");
            break;
    }

    // Beneficio por días adicionales
    if (diasAdicionales > 0) {
        beneficiosAplicados.push(`Se aplicó un descuento del ${Math.round(descuentoAdicional * 100)}% por ${diasAdicionales} días adicionales.`);
    }

    if (beneficiosAplicados.length === 0) {
        beneficiosAplicados.push("No se aplicó ningún descuento ni recargo.");
    }

    const total = valorAlquiler + valorAdicionales + incremento - descuento;

    // Construir factura con HTML
    const facturaHTML = `
        <div class="factura-box">
            <h2>Factura Generada - A L Q U I P C</h2>
            <p><strong>Nombre Cliente:</strong> ${nombre}</p>
            <p><strong>ID Cliente:</strong> ${idCliente}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr>
            <p><strong>Tipo de Servicio:</strong> ${tipoServicioTexto}</p>
            <p><em>${descripcionServicio}</em></p>
            <p><strong>Número de Equipos:</strong> ${equipos}</p>
            <p><strong>Días Iniciales:</strong> ${dias}</p>
            <p><strong>Valor Alquiler (Inicial):</strong> $${valorAlquiler.toLocaleString()}</p>
            <p><strong>Días Adicionales:</strong> ${diasAdicionales}</p>
            <p><strong>Valor Días Adicionales (con descuento ${Math.round(descuentoAdicional * 100)}%):</strong> $${valorAdicionales.toLocaleString()}</p>
            <p><strong>Descuento por días adicionales:</strong> $${valorDescuentoAdicional.toLocaleString()}</p>
            <p><strong>Descuento por tipo de servicio:</strong> $${descuento.toLocaleString()}</p>
            <p><strong>Incremento por tipo de servicio:</strong> $${incremento.toLocaleString()}</p>
            <hr>
            <p><strong>Resumen de beneficios aplicados:</strong></p>
            <ul>
                ${beneficiosAplicados.map(b => `<li>${b}</li>`).join('')}
            </ul>
            <hr>
            <p><strong>Total a pagar:</strong> <span style="color:#0077b6; font-size: 1.3em;">$${total.toLocaleString()}</span></p>
            <p style="margin-top:20px; font-style: italic; text-align: center;">Factura generada. Gracias por utilizar nuestros servicios.</p>
        </div>
    `;

    document.getElementById('resultado').innerHTML = facturaHTML;
});

// Función para generar ID Cliente aleatorio
function generarIdCliente() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ALQ-${timestamp.slice(-5)}-${random}`;
}
