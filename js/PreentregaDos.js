class Tareas {
    static id = 0;
    constructor(descripcion) {
        this.id = ++Tareas.id;
        this.descripcion = descripcion;
    }
}

let tareas = [];

const inputTarea = document.getElementById('nuevaTarea');
const buttonAgregarTarea = document.getElementById('agregarTarea');
const tareasContainer = document.getElementById('tareas-container');

buttonAgregarTarea.onclick = () => {
    const value = inputTarea.value;
    if (value.trim() !== '') { 
        let tarea = new Tareas(value);
        tareas.push(tarea);
        inputTarea.value = '';
        renderTareas(tareas);
        console.log(tareas);
    }
};

let tareasRealizadas = [];

const renderTareas = (tareasArray) => {
    tareasContainer.innerHTML = ''
    tareasArray.forEach(tarea => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th class="col col-1" scope="row">${tarea.id}</th>
            <td class="col col-7">${tarea.descripcion}</td>
            <td class="text-center col col-4">
                <button class="editarTarea btn btn-warning" data-id="${tarea.id}">Editar</button>
                <button class="eliminarTarea btn btn-danger" data-id="${tarea.id}">Eliminar</button>
                <button class="agregarTarea btn btn-primary" id="${tarea.id}">Realizar</button>
            </td>
        `;
        tareasContainer.appendChild(row);
    });
    tareasRealizadasButton();
    editarTareaButton();
    eliminarTareaButton();
};

const tareasRealizadasButton = () => {
    addButton = document.querySelectorAll(".agregarTarea")
    addButton.forEach(button => {
        button.onclick = (e) => {
            const tareasId = e.currentTarget.id
            const selectedTarea = tareas.find(tarea => tarea.id == tareasId)
            tareasRealizadas.push(selectedTarea)
            console.log(tareasRealizadas)
            localStorage.setItem("tareasRealizadas", JSON.stringify(tareasRealizadas))
        }
    })
};

const editarTareaButton = () => {
    const editButton = document.querySelectorAll('.editarTarea');
    editButton.forEach(button => {
        button.onclick = (e) => {
            const tareasID = e.currentTarget.getAttribute('data-id');
            const selectTarea = tareas.find(tarea => tarea.id == tareasID);
            if (selectTarea) {
                const nuevaDescripcion = prompt("Editar Tarea:", selectTarea.descripcion);
                if (nuevaDescripcion !== null && nuevaDescripcion.trim() !== '') {
                    selectTarea.descripcion = nuevaDescripcion.trim();
                    renderTareas(tareas);
                }
            }
        };
    });
};

const eliminarTareaButton = () => {
    const deleteButton = document.querySelectorAll('.eliminarTarea');
    deleteButton.forEach(button => {
        button.onclick = (e) => {
            const tareasID = e.currentTarget.getAttribute('data-id');
            tareas = tareas.filter(tarea => tarea.id != tareasID);
            renderTareas(tareas);
        };
    });
};

