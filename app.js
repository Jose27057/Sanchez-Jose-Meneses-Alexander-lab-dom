// Autores: José Luis Sánchez (8-1038-670) y Alexander Meneses (8-1035-623) · Grupo 1SF133
/* ===================== Parte 1 · El DOM ===================== */

// 1.1 Seleccionar elementos
const titulo = document.querySelector('#titulo');     // primer elemento que coincide
const items  = document.querySelectorAll('li');       // NodeList con todos
console.log(titulo.textContent);
items.forEach(li => console.log(li.textContent));

// 1.2 Cambiar texto, clases y atributos
titulo.textContent = '¡Hola DOM!';          // texto seguro
titulo.classList.add('destacado');          // add / remove / toggle / contains
titulo.setAttribute('title', 'Encabezado');
titulo.dataset.estado = 'activo';           // crea data-estado="activo"
titulo.style.color = 'steelblue';           // estilo en línea (úsalo poco)

// 1.3 Crear y eliminar nodos
const lista = document.querySelector('#lista');
const lenguajes = ['HTML', 'CSS', 'JavaScript'];

for (const nombre of lenguajes) {
  const li = document.createElement('li');
  li.textContent = nombre;
  lista.append(li);                         // lo agrega al final
}
lista.lastElementChild.remove();            // elimina "JavaScript"

// Pregunta de control 1
console.log(document.querySelector('.inexistente'));   // null
// document.querySelector('.inexistente').textContent = 'x';  // TypeError: Cannot set properties of null


/* ===================== Parte 2 · Eventos ===================== */

// 2.1 addEventListener y el objeto event
const boton = document.querySelector('#saludar');
boton.addEventListener('click', (event) => {
  console.log(event.type);     // "click"
  console.log(event.target);   // el elemento que recibió el clic
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') console.log('Cerrar modal');
});

// 2.2 Delegación de eventos: un solo manejador en el contenedor
const tareas = document.querySelector('#tareas');
tareas.addEventListener('click', (e) => {
  const borrar = e.target.closest('.borrar');
  if (borrar) {
    borrar.closest('li').remove();
    return;
  }
  const texto = e.target.closest('.texto');
  if (texto) texto.closest('li').classList.toggle('hecha');
});

// 2.3 preventDefault (usa el formulario #contacto para no mezclarlo con la Parte 3)
const formContacto = document.querySelector('#contacto');
formContacto.addEventListener('submit', (e) => {
  e.preventDefault();                       // no recargar la página
  const datos = new FormData(formContacto);
  console.log(Object.fromEntries(datos));
});


/* ===================== Parte 3 · Validación ===================== */

const form = document.querySelector('#registro');

// 3.2 API de validación del navegador (probar en la consola)
const correo = document.querySelector('#correo');
console.log(correo.checkValidity());        // false, porque está vacío y es required
console.log(correo.validity.valueMissing);  // true
// correo.setCustomValidity('Ese correo ya está registrado');

// 3.3 Reglas propias, reutilizables
const reglas = {
  nombre: v => v.trim().length >= 3 || 'Escribe al menos 3 caracteres.',
  correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Usa un correo como nombre@dominio.com.',
  cedula: v => /^([1-9]|1[0-3]|PE|E|N)-\d{1,4}-\d{1,6}$/.test(v) || 'Formato: 8-123-4567.',
  clave:  v => (v.length >= 8 && /[A-Z]/.test(v) && /\d/.test(v))
               || 'Mínimo 8 caracteres, una mayúscula y un número.',
  clave2: v => v === form.clave.value || 'Las contraseñas no coinciden.',
};

function validarCampo(input) {
  const resultado = reglas[input.name](input.value);
  const valido = resultado === true;
  const error = document.getElementById(`${input.name}-error`);
  input.setAttribute('aria-invalid', String(!valido));
  error.textContent = valido ? '' : resultado;
  return valido;
}

// 3.4 Cuándo mostrar los errores: al salir (blur), luego en vivo (input), todo al enviar (submit)
const tocados = new Set();

form.addEventListener('blur', (e) => {
  if (!reglas[e.target.name]) return;
  tocados.add(e.target.name);
  validarCampo(e.target);
}, true);   // true = fase de captura (blur no burbujea)

form.addEventListener('input', (e) => {
  if (tocados.has(e.target.name)) validarCampo(e.target);
});

// El lab llama a mostrarResumen sin definirla; aquí una versión sencilla
function mostrarResumen(datos) {
  const resumen = document.querySelector('#resumen');
  const p = document.createElement('p');
  p.textContent = `Registro de ${datos.get('nombre')} (${datos.get('correo')}), cédula ${datos.get('cedula')}.`;
  resumen.append(p);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const campos = [...form.elements].filter(el => reglas[el.name]);
  const invalidos = campos.filter(el => !validarCampo(el));
  if (invalidos.length) { invalidos[0].focus(); return; }
  mostrarResumen(new FormData(form));
  form.reset();
});
