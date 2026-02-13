// Carrito de compras
let carrito = [];

// Configuración del alias para pagos
const ALIAS_PAGO = "titopizzas";
const TITULAR_PAGO = "José María Billone";

// Función para incrementar cantidad en el selector
function incrementarCantidad(productoId) {
  const cantidadDisplay = document.getElementById(`cantidad-${productoId}`);
  let cantidad = parseInt(cantidadDisplay.textContent) || 0;
  cantidad++;
  cantidadDisplay.textContent = cantidad;

  const btnAgregar = document.getElementById(`btn-${productoId}`);
  btnAgregar.disabled = cantidad === 0;
}

// Función para decrementar cantidad en el selector
function decrementarCantidad(productoId) {
  const cantidadDisplay = document.getElementById(`cantidad-${productoId}`);
  let cantidad = parseInt(cantidadDisplay.textContent) || 0;
  if (cantidad > 0) {
    cantidad--;
    cantidadDisplay.textContent = cantidad;
  }

  const btnAgregar = document.getElementById(`btn-${productoId}`);
  btnAgregar.disabled = cantidad === 0;
}

// Función para agregar producto al carrito
function agregarAlCarrito(productoId) {
  const cantidadDisplay = document.getElementById(`cantidad-${productoId}`);
  const cantidad = parseInt(cantidadDisplay.textContent) || 0;

  if (cantidad === 0) {
    return;
  }

  const producto = obtenerProductoPorId(productoId);

  if (!producto) {
    return;
  }

  // Buscar si el producto ya está en el carrito
  const itemExistente = carrito.find((item) => item.id === productoId);

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
    });
  }

  // Resetear el contador
  cantidadDisplay.textContent = "0";
  const btnAgregar = document.getElementById(`btn-${productoId}`);
  btnAgregar.disabled = true;

  // Actualizar la vista del carrito
  actualizarCarrito();
}

// Función para agregar empanadas al carrito (docena o media docena)
function agregarEmpanadaAlCarrito(productoId) {
  const cantidadDisplay = document.getElementById(`cantidad-${productoId}`);
  const cantidad = parseInt(cantidadDisplay?.textContent || "0", 10);

  if (cantidad === 0) return;

  const producto = obtenerProductoPorId(productoId);
  if (!producto || producto.categoria !== "empanadas") return;

  const opcionRadio = document.querySelector(
    `input[name="opcion-${productoId}"]:checked`
  );
  const opcion = opcionRadio ? opcionRadio.value : "docena";
  const precio =
    opcion === "docena" ? producto.precioDocena : producto.precioMediaDocena;
  const opcionLabel = opcion === "docena" ? "Docena" : "Media docena";
  const idCarrito = `${productoId}-${opcion}`;
  const nombreCarrito = `${producto.nombre} - ${opcionLabel}`;

  const itemExistente = carrito.find((item) => item.id === idCarrito);
  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      id: idCarrito,
      nombre: nombreCarrito,
      precio: precio,
      cantidad: cantidad,
    });
  }

  cantidadDisplay.textContent = "0";
  const btnAgregar = document.getElementById(`btn-${productoId}`);
  if (btnAgregar) btnAgregar.disabled = true;

  actualizarCarrito();
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(productoId) {
  carrito = carrito.filter((item) => item.id !== productoId);
  actualizarCarrito();
}

// Función para actualizar la cantidad en el carrito
function actualizarCantidadCarrito(productoId, nuevaCantidad) {
  const item = carrito.find((item) => item.id === productoId);
  if (item) {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
    } else {
      item.cantidad = nuevaCantidad;
      actualizarCarrito();
    }
  }
}

// Función para renderizar el carrito
function actualizarCarrito() {
  const carritoItems = document.getElementById("carrito-items");
  const totalPrecio = document.getElementById("total-precio");
  const btnEnviar = document.getElementById("btn-enviar-whatsapp");
  const carritoBadge = document.getElementById("carrito-badge");

  // Actualizar badge del carrito
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  if (carritoBadge) {
    carritoBadge.textContent = totalItems > 0 ? totalItems : "";
  }

  // Limpiar el carrito
  carritoItems.innerHTML = "";

  if (carrito.length === 0) {
    carritoItems.innerHTML =
      '<p class="carrito-vacio">Tu carrito está vacío</p>';
    totalPrecio.textContent = "$0";
    btnEnviar.disabled = true;
    // Ocultar formulario si el carrito está vacío
    const formulario = document.getElementById("formulario-pedido");
    if (formulario) {
      formulario.style.display = "none";
    }
    return;
  }

  // Calcular total
  let total = 0;

  // Renderizar items
  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "carrito-item";
    itemDiv.innerHTML = `
      <div class="item-info">
        <div class="item-nombre">${item.nombre}</div>
        <div class="item-detalle">Cantidad: ${
          item.cantidad
        } x $${item.precio.toLocaleString("es-AR")}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div class="item-precio">$${subtotal.toLocaleString("es-AR")}</div>
        <div class="item-controls">
          <button class="btn-cantidad" onclick="actualizarCantidadCarrito('${
            item.id
          }', ${item.cantidad - 1})">-</button>
          <span class="cantidad-display">${item.cantidad}</span>
          <button class="btn-cantidad" onclick="actualizarCantidadCarrito('${
            item.id
          }', ${item.cantidad + 1})">+</button>
          <button class="btn-eliminar" onclick="eliminarDelCarrito('${
            item.id
          }')">Eliminar</button>
        </div>
      </div>
    `;

    carritoItems.appendChild(itemDiv);
  });

  // Actualizar total
  totalPrecio.textContent = `$${total.toLocaleString("es-AR")}`;
  btnEnviar.disabled = false;

  // Mostrar formulario si hay items en el carrito
  const formulario = document.getElementById("formulario-pedido");
  if (formulario) {
    formulario.style.display = "block";
  }
}

// Función para generar mensaje de WhatsApp
function generarMensajeWhatsApp() {
  if (carrito.length === 0) {
    return "";
  }

  // Obtener datos del formulario
  const nombre = document.getElementById("nombre-cliente").value.trim();
  const domicilio = document.getElementById("domicilio-cliente").value.trim();

  // Validar que los campos estén completos
  if (!nombre || !domicilio) {
    Swal.fire({
      icon: "warning",
      title: "Datos incompletos",
      text: "Por favor, completa todos los datos del pedido (nombre y domicilio)",
      confirmButtonColor: "#E98E02",
      confirmButtonText: "Entendido",
    });
    return "";
  }

  // Generar fecha y hora automáticamente
  const ahora = new Date();
  const fechaFormateada = ahora.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const horaFormateada = ahora.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let mensaje = "*PEDIDO PARA TITO - PIZZAS Y PASTAS*\n\n";

  // Información de envío
  mensaje += "*ENVÍO:*\n";
  mensaje += "Envío a cargo del cliente a través de Uber moto\n\n";

  // Datos del cliente
  mensaje += "*DATOS DEL CLIENTE:*\n";
  mensaje += `Nombre: ${nombre}\n`;
  mensaje += `Domicilio: ${domicilio}\n`;
  mensaje += `Fecha del pedido: ${fechaFormateada}\n`;
  mensaje += `Hora del pedido: ${horaFormateada}\n\n`;

  mensaje += "*DETALLE DEL PEDIDO:*\n\n";

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    mensaje += `${index + 1}. ${item.nombre}\n`;
    mensaje += `   Cantidad: ${item.cantidad}\n`;
    mensaje += `   Precio unitario: $${item.precio.toLocaleString("es-AR")}\n`;
    mensaje += `   Subtotal: $${subtotal.toLocaleString("es-AR")}\n\n`;
  });

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );
  mensaje += `*TOTAL: $${total.toLocaleString("es-AR")}*\n\n`;
  mensaje += `*DATOS PARA EL PAGO:*\n`;
  mensaje += `Alias: ${ALIAS_PAGO}\n`;
  mensaje += `Titular: ${TITULAR_PAGO}\n`;
  mensaje += `Enviar comprobante de pago para confirmar su compra\n\n`;
  mensaje += "Gracias por tu pedido!";

  return mensaje;
}

// Función para enviar pedido por WhatsApp
function enviarPedidoWhatsApp() {
  if (carrito.length === 0) {
    return;
  }

  const mensaje = generarMensajeWhatsApp();

  // Si el mensaje está vacío (por validación), no continuar
  if (!mensaje) {
    return;
  }

  const numeroWhatsApp = "5493813310252";

  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
    mensaje
  )}`;
  window.open(url, "_blank");

  // Limpiar todo después de enviar el pedido
  limpiarPedido();
}

// Función para limpiar el pedido completo
function limpiarPedido() {
  // Limpiar el carrito
  carrito = [];

  // Limpiar los campos del formulario
  const nombreInput = document.getElementById("nombre-cliente");
  const domicilioInput = document.getElementById("domicilio-cliente");
  if (nombreInput) nombreInput.value = "";
  if (domicilioInput) domicilioInput.value = "";

  // Resetear todos los contadores de cantidad de productos
  const todosLosProductos = [
    ...productos.pizzas,
    ...productos.empanadas,
    ...productos.pastas,
  ];
  todosLosProductos.forEach((producto) => {
    const cantidadDisplay = document.getElementById(`cantidad-${producto.id}`);
    if (cantidadDisplay) {
      cantidadDisplay.textContent = "0";
    }
    const btnAgregar = document.getElementById(`btn-${producto.id}`);
    if (btnAgregar) {
      btnAgregar.disabled = true;
    }
  });

  // Actualizar la vista del carrito
  actualizarCarrito();
}
