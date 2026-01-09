// Base de datos de productos
const productos = {
  pizzas: [
    {
      id: "pizza-001",
      nombre: "Pizza Muzzarella",
      precio: 8000,
      categoria: "pizzas",
      imagen: "../img/pizza-muzza.jpg",
    },
    {
      id: "pizza-002",
      nombre: "Pizza Jamón y Morrón",
      precio: 11000,
      categoria: "pizzas",
      imagen: "../img/pizza-jamon.jpg",
    },
    {
      id: "pizza-003",
      nombre: "Pizza Fugazetta",
      precio: 10000,
      categoria: "pizzas",
      imagen: "../img/pizza-fuga.jpg",
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
  const pastasGrid = document.getElementById("pastas-grid");

  // Renderizar pizzas
  productos.pizzas.forEach((producto) => {
    const card = crearProductoCard(producto);
    pizzasGrid.appendChild(card);
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
      <div class="producto-porciones">8 porciones</div>
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

// Función para obtener un producto por ID
function obtenerProductoPorId(id) {
  const todosLosProductos = [...productos.pizzas, ...productos.pastas];
  return todosLosProductos.find((p) => p.id === id);
}
