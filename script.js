document.getElementById('facturaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Tomar valores
    const nombre = document.getElementById('nombre').value.trim();
    const idCliente = document.getElementById('idCliente').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const tipoServicio = parseInt(document.getElementById('tipoServicio').value);
    const equipos = parseInt(document.getElementById('equipos').value);
    const dias = parseInt(document.getElementById('dias').value);
    const diasAdicionales = parseInt(document.getElementById('diasAdicionales').value);

    // Validaciones estrictas
    const nombreValido = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,}$/.test(nombre);
    const idValido = /^[0-9]{3,}$/.test(idCliente);
    const telefonoValido = /^[0-9]{7,15}$/.test(telefono);
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!nombreValido) {
        alert("Nombre inválido. Debe contener solo letras y tener mínimo 3 caracteres.");
        return;
    }
    if (!idValido) {
        alert("ID Cliente inválido. Debe contener solo números y tener mínimo 3 dígitos.");
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

    // Descuento por días adicionales (máx 10%)
    let descuentoAdicional = Math.min(diasAdicionales * 0.02, 0.10);
    valorAdicionales *= (1 - descuentoAdicional);

    let incremento = 0;
    let descuento = 0;
    let tipoServicioTexto = "";

    switch (tipoServicio) {
        case 1:
            tipoServicioTexto = "Dentro de la Ciudad";
            break;
        case 2:
            tipoServicioTexto = "Fuera de la Ciudad";
            incremento = 0.05 * (valorAlquiler + valorAdicionales);
            break;
        case 3:
            tipoServicioTexto = "Dentro del Establecimiento";
            descuento = 0.05 * (valorAlquiler + valorAdicionales);
            break;
    }

    const total = valorAlquiler + valorAdicionales + incremento - descuento;

    // Construir factura con HTML para mejor presentación
    const facturaHTML = `
        <div class="factura-box">
            <h2>Factura Generada - A L Q U I P C</h2>
            <p><strong>Nombre Cliente:</strong> ${nombre}</p>
            <p><strong>ID Cliente:</strong> ${idCliente}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr>
            <p><strong>Tipo de Servicio:</strong> ${tipoServicioTexto}</p>
            <p><strong>Número de Equipos:</strong> ${equipos}</p>
            <p><strong>Días Iniciales:</strong> ${dias}</p>
            <p><strong>Valor Alquiler:</strong> $${valorAlquiler.toLocaleString()}</p>
            <p><strong>Días Adicionales:</strong> ${diasAdicionales}</p>
            <p><strong>Valor Días Adicionales:</strong> $${valorAdicionales.toLocaleString()}</p>
            <p><strong>Descuentos:</strong> $${descuento.toLocaleString()}</p>
            <p><strong>Incrementos:</strong> $${incremento.toLocaleString()}</p>
            <hr>
            <p><strong>Total a pagar:</strong> <span style="color:#0077b6; font-size: 1.3em;">$${total.toLocaleString()}</span></p>
            <p style="margin-top:20px; font-style: italic; text-align: center;">Factura generada. Gracias por utilizar nuestros servicios.</p>
        </div>
    `;

    document.getElementById('resultado').innerHTML = facturaHTML;
});
