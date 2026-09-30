const form = document.querySelector('#inscripcion');
const campoSede = document.querySelector('#campo-sede');
const contador = document.querySelector('#contador');
const barraFuerza = document.querySelector('#fuerza-barra');
const textoFuerza = document.querySelector('#fuerza-texto');
const confirmacion = document.querySelector('#confirmacion');

const tocados = new Set();   
const campo = nombre => form.querySelector(`[name="${nombre}"]`);


const requisitosClave = [
  ['mínimo 8 caracteres', v => v.length >= 8],
  ['una mayúscula',       v => /[A-ZÁÉÍÓÚÜÑ]/.test(v)],
  ['una minúscula',       v => /[a-záéíóúüñ]/.test(v)],
  ['un número',           v => /\d/.test(v)],
  ['un símbolo',          v => /[^A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ\s]/.test(v)],
];

function faltantesClave(v) {
  return requisitosClave.filter(([, cumple]) => !cumple(v)).map(([texto]) => texto);
}


const reglas = {
  nombre: v => {
    const t = v.trim();
    const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/.test(t);
    return (soloLetras && t.length >= 5 && t.length <= 60) || 'Escribe tu nombre y apellido.';
  },

  cedula: v => /^([1-9]|1[0-3]|PE|E|N)-\d{1,4}-\d{1,6}$/.test(v.trim())
    || 'Usa el formato 8-123-4567.',

  correo: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
    || 'Usa un correo como nombre@dominio.com.',

  celular: v => /^6\d{3}-?\d{4}$/.test(v.trim())
    || 'El celular debe tener 8 dígitos y empezar con 6.',

  nacimiento: v => {
    if (!v) return 'Ingresa tu fecha de nacimiento.';
    const fecha = new Date(v + 'T00:00:00');         
    if (fecha > new Date()) return 'La fecha no puede ser futura.';
    const limite = new Date();
    limite.setFullYear(limite.getFullYear() - 16);
    return fecha <= limite || 'Debes tener al menos 16 años.';
  },

  curso: v => v !== '' || 'Elige un curso.',

  modalidad: v => v !== '' || 'Elige una modalidad.',

  sede: v => v !== '' || 'Elige una sede.',

  clave: v => {
    const faltan = faltantesClave(v);
    return faltan.length === 0 || `Te falta: ${faltan.join(', ')}.`;
  },

  clave2: v => v === campo('clave').value || 'Las contraseñas no coinciden.',

  comentarios: v => v.length <= 200 || 'Máximo 200 caracteres.',

  terminos: v => v === true || 'Debes aceptar los términos.',
};

function leerValor(input) {
  if (input.type === 'checkbox') return input.checked;
  if (input.type === 'radio') {
    const marcado = form.querySelector(`input[name="${input.name}"]:checked`);
    return marcado ? marcado.value : '';
  }
  return input.value;
}

function validarCampo(input) {
  if (input.disabled) return true;              
  const resultado = reglas[input.name](leerValor(input));
  const valido = resultado === true;
  const error = document.getElementById(`${input.name}-error`);
  form.querySelectorAll(`[name="${input.name}"]`).forEach(el => {
    el.setAttribute('aria-invalid', String(!valido));
  });
  error.textContent = valido ? '' : resultado;
  return valido;
}

function limpiarError(input) {
  form.querySelectorAll(`[name="${input.name}"]`).forEach(el => el.removeAttribute('aria-invalid'));
  document.getElementById(`${input.name}-error`).textContent = '';
}

function actualizarFuerza() {
  const v = campo('clave').value;
  const cumplidos = requisitosClave.length - faltantesClave(v).length;
  let nivel = 0, texto = '—';
  if (v) {
    if (cumplidos <= 2)      { nivel = 1; texto = 'Débil'; }
    else if (cumplidos <= 4) { nivel = 2; texto = 'Media'; }
    else                     { nivel = 3; texto = 'Fuerte'; }
  }
  barraFuerza.dataset.nivel = nivel;
  textoFuerza.textContent = `Fuerza: ${texto}`;
}

function actualizarContador() {
  const n = campo('comentarios').value.length;
  contador.textContent = `${n} / 200`;
  contador.classList.toggle('alerta', n > 180);
  contador.classList.toggle('excedido', n > 200);
}

function actualizarSede() {
  const marcada = form.querySelector('input[name="modalidad"]:checked');
  const presencial = marcada !== null && marcada.value === 'presencial';
  campoSede.hidden = !presencial;
  campo('sede').disabled = !presencial;      
  if (!presencial) {
    campo('sede').value = '';
    limpiarError(campo('sede'));
    tocados.delete('sede');
  }
}

function reiniciarInterfaz() {
  tocados.clear();
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  form.querySelectorAll('.error').forEach(p => { p.textContent = ''; });
  actualizarSede();
  actualizarFuerza();
  actualizarContador();
}

function mostrarConfirmacion(datos) {
  const modalidad = datos.get('modalidad') === 'presencial' ? 'Presencial' : 'Virtual';
  const filas = [
    ['Nombre', datos.get('nombre').trim()],
    ['Cédula', datos.get('cedula').trim()],
    ['Correo', datos.get('correo').trim()],
    ['Celular', datos.get('celular').trim()],
    ['Nacimiento', datos.get('nacimiento').split('-').reverse().join('/')],
    ['Curso', datos.get('curso')],
    ['Modalidad', modalidad],
  ];
  if (datos.get('sede')) filas.push(['Sede', datos.get('sede')]);
  if (datos.get('comentarios').trim()) filas.push(['Comentarios', datos.get('comentarios').trim()]);

  const tarjeta = document.createElement('article');
  tarjeta.className = 'tarjeta';
  tarjeta.tabIndex = -1;

  const titulo = document.createElement('h2');
  titulo.textContent = 'Inscripción recibida';

  const lista = document.createElement('dl');
  for (const [etiqueta, valor] of filas) {
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = etiqueta;
    dd.textContent = valor;
    lista.append(dt, dd);
  }

  const cerrar = document.createElement('button');
  cerrar.type = 'button';
  cerrar.className = 'cerrar';
  cerrar.textContent = 'Cerrar';

  tarjeta.append(titulo, lista, cerrar);
  confirmacion.textContent = '';
  confirmacion.append(tarjeta);
  tarjeta.focus();
}

form.addEventListener('blur', (e) => {
  if (!reglas[e.target.name]) return;
  tocados.add(e.target.name);
  validarCampo(e.target);
}, true);

form.addEventListener('input', (e) => {
  const nombre = e.target.name;
  if (!reglas[nombre]) return;

  if (nombre === 'clave') {
    actualizarFuerza();
    if (tocados.has('clave2')) validarCampo(campo('clave2')); 
  }
  if (nombre === 'comentarios') actualizarContador();

  if (tocados.has(nombre)) validarCampo(e.target);
});

form.addEventListener('change', (e) => {
  if (e.target.name === 'modalidad') actualizarSede();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const vistos = new Set();
  const campos = [...form.elements].filter(el => {
    if (!reglas[el.name] || el.disabled || vistos.has(el.name)) return false;
    vistos.add(el.name);
    return true;
  });

  campos.forEach(el => tocados.add(el.name));
  const invalidos = campos.filter(el => !validarCampo(el));

  if (invalidos.length) {
    invalidos[0].focus();
    return;
  }

  const datos = new FormData(form);
  form.reset();
  reiniciarInterfaz();
  mostrarConfirmacion(datos);
});

confirmacion.addEventListener('click', (e) => {
  if (e.target.closest('.cerrar')) {
    confirmacion.textContent = '';
    campo('nombre').focus();
  }
});

// Estado inicial
reiniciarInterfaz();
