// Base de datos de productos
const productos = {
  pizzas: [
    {
      id: "pizza-001",
      nombre: "Pizza Muzzarella",
      precio: 9000,
      categoria: "pizzas",
      imagen: "../img/pizza-muzza.jpg",
      peso: 800,
    },
    {
      id: "pizza-002",
      nombre: "Pizza Jamón y Morrón",
      precio: 11000,
      categoria: "pizzas",
      imagen: "../img/pizza-jamon.jpg",
      peso: 900,
    },
    {
      id: "pizza-003",
      nombre: "Pizza Fugazetta",
      precio: 11000,
      categoria: "pizzas",
      imagen: "../img/pizza-fuga.jpg",
      peso: 950,
    },
    {
      id: "pizza-004",
      nombre: "Pizza Calabreza",
      precio: 11000,
      categoria: "pizzas",
      imagen: "../img/pizza-calabreza.webp",
      peso: 900,
    },
  ],
  empanadas: [
    {
      id: "empanada-001",
      nombre: "Empanada de Carne",
      precioDocena: 10000,
      precioMediaDocena: 5500,
      categoria: "empanadas",
      imagen: "img/empanadas.jpeg",
    },
    {
      id: "empanada-002",
      nombre: "Empanada de Pollo",
      precioDocena: 10000,
      precioMediaDocena: 5500,
      categoria: "empanadas",
      imagen: "img/empanadas.jpeg",
    },
  ],
  pastas: [
    {
      id: "pasta-001",
      nombre: "Fideos de Morrón",
      precio: 0,
      categoria: "pastas",
      imagen: "../img/fideos-morron.jpg",
    },
    {
      id: "pasta-002",
      nombre: "Fideos Verdes",
      precio: 0,
      categoria: "pastas",
      imagen: "../img/fideos-verdes.jpg",
    },
    {
      id: "pasta-003",
      nombre: "Ñoquis",
      precio: 0,
      categoria: "pastas",
      imagen: "../img/ñoquis.jpg",
    },
  ],
};

// Función para renderizar productos
function renderizarProductos() {
  const pizzasGrid = document.getElementById("pizzas-grid");
  const empanadasGrid = document.getElementById("empanadas-grid");
  const pastasGrid = document.getElementById("pastas-grid");

  // Renderizar pizzas
  productos.pizzas.forEach((producto) => {
    const card = crearProductoCard(producto);
    pizzasGrid.appendChild(card);
  });

  // Renderizar empanadas
  productos.empanadas.forEach((producto) => {
    const card = crearProductoCard(producto);
    empanadasGrid.appendChild(card);
  });

  // Renderizar pastas
  productos.pastas.forEach((producto) => {
    const card = crearProductoCard(producto);
    pastasGrid.appendChild(card);
  });
}

// Función para crear una tarjeta de producto
function crearProductoCard(producto) {
  const card = document.createElement("div");
  const esPasta = producto.categoria === "pastas";
  const esEmpanada = producto.categoria === "empanadas";

  if (esPasta) {
    card.className = "producto-card producto-deshabilitado";
  } else {
    card.className = "producto-card";
  }

  card.dataset.productoId = producto.id;

  // URL alternativa para ñoquis (gnocchi) si la principal falla
  const imagenAlternativa =
    producto.id === "pasta-003"
      ? "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=600&h=400&fit=crop&q=80"
      : producto.imagen;

  // Si es empanada: docena o media docena
  if (esEmpanada) {
    const docenaFormato = producto.precioDocena.toLocaleString("es-AR");
    const mediaFormato = producto.precioMediaDocena.toLocaleString("es-AR");
    card.innerHTML = `
      <div class="producto-imagen-container">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen"
             onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'placeholder-imagen\\'><span>${producto.nombre}</span></div>';">
      </div>
      <div class="producto-nombre">${producto.nombre}</div>
      <div class="producto-porciones">Docena $${docenaFormato} · Media docena $${mediaFormato}</div>
      <div class="producto-opciones-empanada">
        <label class="opcion-empanada">
          <input type="radio" name="opcion-${producto.id}" value="docena" checked>
          <span>Docena</span>
        </label>
        <label class="opcion-empanada">
          <input type="radio" name="opcion-${producto.id}" value="media">
          <span>Media docena</span>
        </label>
      </div>
      <div class="producto-precio" id="precio-display-${producto.id}">$${docenaFormato}</div>
      <div class="producto-controls">
        <div class="cantidad-control">
          <button class="btn-cantidad" onclick="decrementarCantidad('${producto.id}')">-</button>
          <span class="cantidad-display" id="cantidad-${producto.id}">0</span>
          <button class="btn-cantidad" onclick="incrementarCantidad('${producto.id}')">+</button>
        </div>
        <button class="btn-agregar" onclick="agregarEmpanadaAlCarrito('${producto.id}')" id="btn-${producto.id}" disabled>
          Agregar
        </button>
      </div>
    `;
    // Actualizar precio mostrado al cambiar opción
    card
      .querySelectorAll(`input[name="opcion-${producto.id}"]`)
      .forEach((radio) => {
        radio.addEventListener("change", function () {
          const precioDisplay = document.getElementById(
            `precio-display-${producto.id}`
          );
          if (precioDisplay) {
            precioDisplay.textContent =
              this.value === "docena"
                ? `$${producto.precioDocena.toLocaleString("es-AR")}`
                : `$${producto.precioMediaDocena.toLocaleString("es-AR")}`;
          }
        });
      });
    return card;
  }

  // Si es pasta, mostrar "Próximamente" en lugar de controles
  if (esPasta) {
    card.innerHTML = `
      <div class="producto-imagen-container">
        <img src="${producto.imagen}" alt="${
      producto.nombre
    }" class="producto-imagen" 
             onerror="if(this.src !== '${imagenAlternativa}') { this.src='${imagenAlternativa}'; } else { this.style.display='none'; this.parentElement.innerHTML='<div class=\\'placeholder-imagen\\'><span>${
      producto.nombre
    }</span></div>'; }">
        <div class="overlay-proximamente">
          <span class="texto-proximamente">Próximamente</span>
        </div>
      </div>
      <div class="producto-nombre">${producto.nombre}</div>
      <div class="producto-porciones">2 porciones</div>
      <div class="producto-precio">$${producto.precio.toLocaleString(
        "es-AR"
      )}</div>
      <div class="producto-controls">
        <div class="cantidad-control">
          <button class="btn-cantidad" disabled>-</button>
          <span class="cantidad-display" id="cantidad-${producto.id}">0</span>
          <button class="btn-cantidad" disabled>+</button>
        </div>
        <button class="btn-agregar" disabled id="btn-${producto.id}">
          Agregar
        </button>
      </div>
    `;
  } else {
    card.innerHTML = `
      <div class="producto-imagen-container">
        <img src="${producto.imagen}" alt="${
      producto.nombre
    }" class="producto-imagen" 
             onerror="if(this.src !== '${imagenAlternativa}') { this.src='${imagenAlternativa}'; } else { this.style.display='none'; this.parentElement.innerHTML='<div class=\\'placeholder-imagen\\'><span>${
      producto.nombre
    }</span></div>'; }">
      </div>
      <div class="producto-nombre">${producto.nombre}</div>
      <div class="producto-porciones">${
        producto.peso || 0
      } grs (8 porciones)</div>
      <div class="producto-precio">$${producto.precio.toLocaleString(
        "es-AR"
      )}</div>
      <div class="producto-controls">
        <div class="cantidad-control">
          <button class="btn-cantidad" onclick="decrementarCantidad('${
            producto.id
          }')">-</button>
          <span class="cantidad-display" id="cantidad-${producto.id}">0</span>
          <button class="btn-cantidad" onclick="incrementarCantidad('${
            producto.id
          }')">+</button>
        </div>
        <button class="btn-agregar" onclick="agregarAlCarrito('${
          producto.id
        }')" id="btn-${producto.id}">
          Agregar
        </button>
      </div>
    `;
  }

  return card;
}

// Función para obtener un producto por ID (id base, sin sufijo docena/media)
function obtenerProductoPorId(id) {
  const idBase = id.replace(/-docena$|-media$/, "");
  const todosLosProductos = [
    ...productos.pizzas,
    ...productos.empanadas,
    ...productos.pastas,
  ];
  return todosLosProductos.find((p) => p.id === idBase || p.id === id);
}
