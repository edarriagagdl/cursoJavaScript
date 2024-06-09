// Clase Producto
class Producto {
  constructor(id, nombre, categoria, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.imagen = imagen;
  }
}

// Funcion para leer los productos de la base de datos (simulada con un archivo JSON en este caso)
const leerProdutosDB = () => {
  // Se simula un tiempo de espera de 3 segundos para obtener los productos
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        fetch('js/productos.json') // Se hace una peticion GET al archivo productos.json
          .then((response) => response.json()) // Se convierte la respuesta a un objeto JSON
          .then((data) => {
            // Se crea un array de productos con los datos obtenidos del JSON
            const productos = data.map(
              (producto) =>
                new Producto(
                  producto.id,
                  producto.nombre,
                  producto.categoria,
                  producto.precio,
                  producto.imagen
                )
            );
            return productos;
          })
      );
    }, 3000); // 3 segundos
  });
};

// Clase Catalogo de Productos
class CatalogoProductos {
  productos = [];

  constructor(productos = []) {
    this.productos = productos || [];
  }

  // Metodo para agregar productos al catalogo
  agregarProducto(producto) {
    this.productos.push(producto);
  }

  // Metodo para crear el menu de productos que pertenecen a una categoria
  crearMenuProductos(categoria) {
    let idProductos = [];
    const contenedor = document.getElementById('contenedorProductos');
    contenedor.innerHTML = '';
    const row = document.createElement('div');
    row.classList.add('row');
    contenedor.appendChild(row);
    // Se recorren los productos del catalogo
    this.productos.forEach((producto) => {
      // Si el producto pertenece a la categoria proporcionada como parametro, se agrega al menu
      if (producto.categoria === categoria) {
        const col = document.createElement('div');
        col.classList.add('col');
        row.appendChild(col);
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = producto.id;
        const nombre = document.createElement('p');
        nombre.classList.add('card-header');
        nombre.textContent = producto.nombre;
        card.appendChild(nombre);
        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
        producto.cantidad = 1;
        imagen.classList.add('img-fluid');
        imagen.classList.add('card-img-top');
        card.appendChild(imagen);
        const precio = document.createElement('p');
        precio.classList.add('card-footer');
        precio.textContent = '$' + producto.precio;
        card.appendChild(precio);
        const boton = document.createElement('button');
        boton.classList.add('btn');
        boton.classList.add('btn-primary');
        boton.textContent = 'Agregar al Carrito';
        boton.addEventListener('click', () => {
          carrito.agregarProducto(producto);
        });
        card.appendChild(boton);
        col.appendChild(card);
        idProductos.push(producto.id);
      }
    });
    // Se retorna un objeto con los id de los productos y el menu de productos
    return {
      idProductos: idProductos,
      menuProductos: contenedor,
    };
  }
}

// Clase Carrito de Compras
class CarritoCompras {
  constructor() {
    this.productos = [];
  }
  // Metodo para agregar productos al carrito
  agregarProducto(producto) {
    const productIndex = this.productos.findIndex(
      (productoCarrito) => productoCarrito.id === producto.id
    );

    if (productIndex !== -1) {
      this.productos[productIndex].cantidad += producto.cantidad || 1;
    } else {
      this.productos.push(producto);
    }
    localStorage.setItem(
      'shoppingCart_' + user.id,
      JSON.stringify(this.productos)
    );
    this.mostrarCarrito();
  }

  // Metodo para remover productos del carrito
  removerProducto(id) {
    this.productos = this.productos.filter((producto) => producto.id !== id);
    localStorage.setItem(
      'shoppingCart_' + user.id,
      JSON.stringify(this.productos)
    );
  }

  // Metodo para mostrar el carrito de compras en un contenedor que se llama carritoProductos
  mostrarCarrito() {
    const contenedor = document.getElementById('carritoProductos');
    // Se vacia el contenedor
    contenedor.innerHTML = '';
    const row = document.createElement('div');
    row.classList.add('row');
    contenedor.appendChild(row);
    let total = 0;
    let cantidadProductos = 0;
    // Se recorren los productos del carrito, por cada producto se crea una card con la informacion del producto
    this.productos.forEach((producto) => {
      const col = document.createElement('div');
      col.classList.add('col');
      row.appendChild(col);
      const card = document.createElement('div');
      card.classList.add('card');
      card.id = producto.id;
      const nombre = document.createElement('p');
      nombre.classList.add('card-header');
      nombre.textContent = producto.nombre;
      card.appendChild(nombre);
      const imagen = document.createElement('img');
      imagen.src = producto.imagen;
      imagen.alt = producto.nombre;
      imagen.classList.add('img-fluid');
      imagen.classList.add('card-img-top');
      card.appendChild(imagen);
      const precio = document.createElement('p');
      precio.classList.add('card-footer');
      const totalProducto = producto.precio * producto.cantidad;
      cantidadProductos = cantidadProductos += producto.cantidad;
      precio.textContent =
        producto.cantidad + ' x $' + producto.precio + ' = $' + totalProducto;
      card.appendChild(precio);
      const boton = document.createElement('button');
      boton.classList.add('btn');
      boton.classList.add('btn-primary');
      boton.textContent = 'Remover del Carrito';
      boton.addEventListener('click', () => {
        this.removerProducto(producto.id);
        this.mostrarCarrito();
      });
      card.appendChild(boton);
      col.appendChild(card);
      total = total += totalProducto;
    });
    const precioTotal = document.createElement('h2');
    precioTotal.textContent = 'Total a pagar: $' + total;
    contenedor.appendChild(precioTotal);
    const cantidadProductosLabel = document.getElementById('cantidadProductos');
    cantidadProductosLabel.textContent = cantidadProductos;
  }

  // Metodo para vaciar el carrito de compras
  vaciarCarrito() {
    this.productos = [];
  }
}

// Creamos el catalogo de productos
let catalogoProductos = new CatalogoProductos();
const contenedor = document.getElementById('contenedorProductos');
contenedor.classList.add('text-center');
const spinner = document.getElementById('spinner');
spinner.style.display = 'block';

// Se leen los productos de la base de datos
leerProdutosDB().then((productos) => {
  spinner.style.display = 'none';
  console.log('productos', productos);
  catalogoProductos.productos = productos;
  // Creamos los botones para mostrar los productos del catalogo
  let botonPastel = document.getElementById('botonPasteles');
  let botonGalleta = document.getElementById('botonGalletas');
  let botonHelado = document.getElementById('botonHelados');
  let botonMuffin = document.getElementById('botonMuffins');
  // Se agregan los eventos a los botones
  botonPastel.addEventListener('click', () => {
    let pasteles = catalogoProductos.crearMenuProductos('Pastel');
    botonPastel.classList.add('active');
    botonGalleta.classList.remove('active');
    botonHelado.classList.remove('active');
    botonMuffin.classList.remove('active');
    console.log('pasteles', pasteles);
  });
  botonGalleta.addEventListener('click', () => {
    let galletas = catalogoProductos.crearMenuProductos('Galleta');
    botonPastel.classList.remove('active');
    botonGalleta.classList.add('active');
    botonHelado.classList.remove('active');
    botonMuffin.classList.remove('active');
    console.log('galletas', galletas);
  });
  botonHelado.addEventListener('click', () => {
    let helados = catalogoProductos.crearMenuProductos('Helado');
    botonPastel.classList.remove('active');
    botonGalleta.classList.remove('active');
    botonHelado.classList.add('active');
    botonMuffin.classList.remove('active');
    console.log('helados', helados);
  });
  botonMuffin.addEventListener('click', () => {
    let muffins = catalogoProductos.crearMenuProductos('Muffin');
    botonPastel.classList.remove('active');
    botonGalleta.classList.remove('active');
    botonHelado.classList.remove('active');
    botonMuffin.classList.add('active');
    console.log('muffins', muffins);
  });
  botonPastel.click();
});

// Obtenemos del localStorage el usuario logueado
const user = JSON.parse(localStorage.getItem('currentUser')) || false;
if (!user) {
  location.href = 'login.html';
}
console.log('user', user.id);
// Le damos la bienvenida al usuario logueado
const welcome = document.querySelector('#welcome');
welcome.innerHTML = `Bienvenido ${user.nombre} al carrito de compras de la pasteleria de Eduardo!`;
const logout = document.querySelector('#logout');
logout.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  location.href = 'login.html';
});

// Obetener el carrito de compras asociado al usuario del localStorage
const carrito = new CarritoCompras();
const shoppingCart =
  JSON.parse(localStorage.getItem('shoppingCart_' + user.id)) || false;
if (shoppingCart) {
  shoppingCart.forEach((producto) => {
    carrito.agregarProducto(producto);
  });
}
// mostramos el carrito en el contenedor carritoProductos
console.log('carrito', carrito);
carrito.mostrarCarrito();

// agregamos la logica para el icono del carrito de compras
const iconCart = document.querySelector('.icon-cart');
const body = document.querySelector('body');
iconCart.addEventListener('click', () => {
  body.classList.toggle('carrito-activo');
});
// agregamos la logica para el boton para vaciar el carrito de compras
// const vaciarCarrito = document.querySelector('.vaciarCarrito');
// vaciarCarrito.addEventListener('click', () => {
//   carrito.vaciarCarrito();
//   carrito.mostrarCarrito();
//   localStorage.removeItem('shoppingCart_' + user.id);
// });

// agregamos la logica para el boton de cerrar
const cerrar = document.querySelector('.cerrar');
cerrar.addEventListener('click', () => {
  body.classList.remove('carrito-activo');
});

// agregamos la logica para el boton de finalizar compra
const finalizarCompra = document.querySelector('.finalizarCompra');
finalizarCompra.addEventListener('click', () => {
  carrito.vaciarCarrito();
  carrito.mostrarCarrito();
  localStorage.removeItem('shoppingCart_' + user.id);
  Swal.fire('Gracias por tu compra!');
});
