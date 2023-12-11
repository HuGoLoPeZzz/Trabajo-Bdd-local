// 1. Escucha el evento 'DOMContentLoaded', que se dispara cuando el DOM ha sido completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
  // 2. Inicia la base de datos y agrega y muestra los datos existentes al cargar la página.
  iniciarBaseDeDatos();
  agregarDato();
  mostrarDatos();
});

// 3. Declaración de la variable global para almacenar la conexión a la base de datos.
let db;

// 4. Función para inicializar la base de datos.
function iniciarBaseDeDatos() {
  // 5. Abre o crea una base de datos llamada 'miBaseDeDatos' con la versión 1.
  const solicitud = indexedDB.open('miBaseDeDatos', 1);

  // 6. Se ejecuta cuando se necesita actualizar la estructura de la base de datos (creación o modificación de almacén de objetos).
  solicitud.onupgradeneeded = (evento) => {
    db = evento.target.result;

    // 7. Crea un almacén de objetos llamado 'datos' con un identificador automático ('id') y un índice llamado 'dato'.
    const almacenObjetos = db.createObjectStore('datos', { keyPath: 'id', autoIncrement: true });
    almacenObjetos.createIndex('dato', 'dato', { unique: false });
  };

  // 8. Se ejecuta cuando la base de datos se abre correctamente.
  solicitud.onsuccess = (evento) => {
    db = evento.target.result;
  };

  // 9. Maneja errores si hay algún problema al abrir la base de datos.
  solicitud.onerror = (evento) => {
    console.error('Error al abrir la base de datos', evento.target.error);
  };
}

// 10. Función para agregar un nuevo dato a la base de datos.
function agregarDato() {
  // 11. Obtiene el formulario y el valor del campo de entrada.
  const formularioDatos = document.getElementById('formularioDatos');
  const inputDato = document.getElementById('inputDato').value;

  // 12. Inicia una transacción de lectura/escritura en el almacén de objetos 'datos'.
  const transaccion = db.transaction(['datos'], 'readwrite');
  const almacenObjetos = transaccion.objectStore('datos');

  // 13. Crea un nuevo objeto con el dato ingresado.
  const nuevoDato = { dato: inputDato };

  // 14. Agrega el nuevo objeto al almacén de objetos.
  const solicitud = almacenObjetos.add(nuevoDato);

  // 15. Se ejecuta cuando se ha agregado el dato correctamente.
  solicitud.onsuccess = () => {
    // 16. Reinicia el formulario y muestra los datos actualizados.
    formularioDatos.reset();
    mostrarDatos();
  };

  // 17. Maneja errores si hay algún problema al agregar el dato.
  solicitud.onerror = (evento) => {
    console.error('Error al agregar datos', evento.target.error);
  };
}

// 18. Función para mostrar todos los datos almacenados en la base de datos.
function mostrarDatos() {
  // 19. Obtiene el contenedor donde se mostrarán los datos.
  const listaDatos = document.getElementById('listaDatos');
  listaDatos.innerHTML = '';

  // 20. Inicia una transacción de solo lectura en el almacén de objetos 'datos'.
  const almacenObjetos = db.transaction('datos').objectStore('datos');

  // 21. Abre un cursor para recorrer todos los objetos almacenados.
  almacenObjetos.openCursor().onsuccess = (evento) => {
    const cursor = evento.target.result;

    // 22. Si hay un objeto, crea un elemento HTML y lo agrega a la lista.
    if (cursor) {
      const elementoLista = document.createElement('div');
      elementoLista.innerHTML = `<p>${cursor.value.dato}</p>`;
      listaDatos.appendChild(elementoLista);

      // 23. Continúa moviéndose al siguiente objeto.
      cursor.continue();
    }
  };
}

