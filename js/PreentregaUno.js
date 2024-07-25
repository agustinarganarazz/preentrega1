// Función para agregar una tarea
function agregarTarea(tareas, tarea) {
  tareas.push({ descripcion: tarea, completada: false });
  return tareas;
}

// Función para marcar una tarea como comletada/realizada
function completarTarea(tareas, indice) {
  if (indice >= 0 && indice < tareas.length) {
    tareas[indice].completada = true;
  }
  return tareas;
}

// Función para imprimir todas las tareas
function imprimirTareas(tareas) {
  
  for (let i = 0; i < tareas.length; i++) {
    let estado = tareas[i].completada ? "Completada" : "Pendiente";
      console.log(`${i + 1}. ${tareas[i].descripcion} - ${estado}`);
}
}



// array para almacenar las tareas del usuario
let tareas = [];


// ofrece el servicio hasta que el usuario quiera salir
let salir = false;
while (!salir) {
  let opcion = prompt(
    "Seleccione una opción:\n1. Agregar tarea\n2. Completar tarea\n3. Mostrar todas las tareas\n4. Salir"
  );

  switch (opcion) {
    case "1":
      let nuevaTarea = prompt("Ingrese la descripción de la nueva tarea:");
      tareas = agregarTarea(tareas, nuevaTarea);
      break;
    case "2":
      let indice =
        parseInt(prompt("Ingrese el número de la tarea a completar:")) - 1;
      tareas = completarTarea(tareas, indice);
      break;3
    case "3":
      console.log("Lista de tareas:");
      imprimirTareas(tareas);
      break;
    case "4":
      salir = true;
      break;
    default:
      console.log(
        "Opción no válida, por favor seleccione una opción del 1 al 4."
      );
  }
}

console.log("Gracias por usar el servicio de gestión de tareas."); 
