# Laboratorio DOM, eventos y validación de formularios

- **Estudiantes:**
  - José Luis Sánchez · 8-1038-670
  - Alexander Meneses · 8-1035-623
- **Grupo:** 1SF133
- **Curso:** Ingeniería Web · Facultad de Ingeniería de Sistemas Computacionales · UTP
- **Profesora:** Dra. Elba Valderrama Bahamóndez


## Contenido

| Carpeta | Qué es |
|---|---|
| `lab-dom/` | Laboratorio guiado: `index.html` y `app.js` con los fragmentos de las Partes 1, 2 y 3. |
| `inscripcion/` | Tarea 4: formulario de inscripción validado con JS puro (`index.html`, `estilos.css`, `validacion.js`). |

## Capturas

<img width="814" height="433" alt="image" src="https://github.com/user-attachments/assets/a00b859e-0475-4a16-90a9-f885bef44efe" />

<img width="744" height="378" alt="image" src="https://github.com/user-attachments/assets/59f6cb9e-555a-4094-99b5-ea5e841ca11b" />


## Preguntas de control

1. **¿Qué devuelve `document.querySelector('.inexistente')` y qué pasa si luego escribes `.textContent = 'x'`?**
   Devuelve `null`. Como `null` no es un objeto, asignarle una propiedad lanza un `TypeError`. Conviene comprobar el resultado antes de usarlo.
2. **Con 100 tareas nuevas, ¿cuántos manejadores de clic hay con delegación y sin ella?**
   Con delegación hay uno solo, en el contenedor `<ul>`. Sin delegación habría que registrar uno por cada botón, es decir, 100.
3. **¿Por qué `blur` se registra con `true` como tercer argumento?**
   Porque `blur` no burbuja. Con `true` el `<form>` lo escucha en la fase de captura y un solo manejador sirve para todos los campos.

## Tarea 4: decisiones de diseño

- `novalidate` en el formulario; los mensajes aparecen debajo de cada campo, sin `alert()`.
- Objeto `reglas` y una sola función `validarCampo`.
- Patrón: primero al salir del campo (`blur`), luego en vivo (`input`), y todo al enviar con el foco en el primer error.
- `aria-invalid="true"` en los campos inválidos y mensajes enlazados con `aria-describedby`.
- Sede: aparece y es obligatoria solo con modalidad Presencial; en Virtual se oculta y se deshabilita.
- La tarjeta de confirmación se crea con `createElement` y `textContent`, sin mostrar la contraseña.
