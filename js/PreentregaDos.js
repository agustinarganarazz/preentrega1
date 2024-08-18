class Tareas {
    static id = 0;
    constructor(descripcion, fechaVencimiento, categoria, prioridad) {
        this.id = ++Tareas.id;
        this.descripcion = descripcion;
        this.fechaVencimiento = fechaVencimiento;
        this.categoria = categoria;
        this.prioridad = prioridad;
        this.completada = false;
    }
}

let tareas = [];
let tareasRealizadas = [];

try {
    tareas = JSON.parse(localStorage.getItem('tareas')) || [];
    tareasRealizadas = JSON.parse(localStorage.getItem('tareasRealizadas')) || [];
} catch (error) {
    console.error("Error al cargar las tareas desde el localStorage:", error);
    showTemporaryMessage('Error al cargar las tareas, se utilizarán datos predeterminados.', 'error');
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const storedTareas = JSON.parse(localStorage.getItem('tareas'));
        if (storedTareas && storedTareas.length > 0) {
            tareas = storedTareas;
        } else {
            
            const response = await fetch('tareas.json');
            tareas = await response.json();
            tareas.forEach(tarea => {
                Tareas.id = Math.max(Tareas.id, tarea.id); 
            });
        }
        renderTareas(tareas);
    } catch (error) {
        console.error("Error al cargar las tareas:", error);
        showTemporaryMessage('Error al cargar las tareas', 'error');
    }
});

const inputPrioridad = document.getElementById('prioridadTarea');
const inputTarea = document.getElementById('nuevaTarea');
const inputFecha = document.getElementById('fechaVencimiento');
const buttonAgregarTarea = document.getElementById('agregarTarea');
const tareasContainer = document.getElementById('tareas-container');
const filterButtons = document.querySelectorAll('.filter-button');
const inputCategoria = document.getElementById('categoriaTarea');



buttonAgregarTarea.onclick = () => {
    const descripcion = inputTarea.value;
    const fechaVencimiento = inputFecha.value;
    const categoria = inputCategoria.value;
    const prioridad = inputPrioridad.value;
    if (descripcion.trim() !== '' && fechaVencimiento !== '' && categoria !== '' && prioridad !== '') {
        let tarea = new Tareas(descripcion, fechaVencimiento, categoria, prioridad);
        tareas.push(tarea);
        inputTarea.value = '';
        inputFecha.value = '';
        inputCategoria.value = '';
        inputPrioridad.value = '';
        guardarTareas();
        renderTareas(tareas);
        showTemporaryMessage('Tarea agregada exitosamente');
    } else {
        showTemporaryMessage('La descripción y la fecha de vencimiento de la tarea no pueden estar vacías', 'danger');
    }
};

const showTemporaryMessage = (message, type = 'success') => {
    Swal.fire({
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 2000
    });
};

const showConfirmDialog = (message) => {
    return Swal.fire({
        title: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    });
};


const guardarTareas = () => {
    try {
        localStorage.setItem('tareas', JSON.stringify(tareas));
    } catch (error) {
        console.error("Error al guardar las tareas en localStorage:", error);
        showTemporaryMessage('Error al guardar las tareas', 'error');
    }
};



const renderTareas = (tareasArray) => {
    tareasContainer.innerHTML = '';
    tareasArray.forEach(tarea => {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-light');
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Tarea ${tarea.id}</h5>
                <p class="card-text">${tarea.descripcion}</p>
                <p class="card-text"><small class="text-muted">Vence el: ${tarea.fechaVencimiento || 'No especificada'}</small></p>
                <p class="card-text"><small class="text-muted">Categoría: ${tarea.categoria}</small></p>
                <p class="card-text"><small class="text-muted">Prioridad: ${tarea.prioridad}</small></p>
                <button class="editarTarea btn btn-warning" data-id="${tarea.id}"><i class="fas fa-edit"></i> Editar</button>
                <button class="eliminarTarea btn btn-danger" data-id="${tarea.id}"><i class="fas fa-trash-alt"></i> Eliminar</button>
                <button class="completarTarea btn btn-primary" data-id="${tarea.id}"><i class="fas fa-check"></i> ${tarea.completada ? 'Pendiente' : 'Completar'}</button>
            </div>
        `;
        tareasContainer.appendChild(card);
    });
    tareasRealizadasButton();
    editarTareaButton();
    eliminarTareaButton();
};



const tareasRealizadasButton = () => {
    const completeButtons = document.querySelectorAll('.completarTarea');
    completeButtons.forEach(button => {
        button.onclick = async (e) => {
            const tareasId = e.currentTarget.getAttribute('data-id');
            const selectedTarea = tareas.find(tarea => tarea.id == tareasId);
            if (selectedTarea) {
                selectedTarea.completada = !selectedTarea.completada;
                guardarTareas();
                renderTareas(tareas);
                showTemporaryMessage(`Tarea marcada como ${selectedTarea.completada ? 'completada' : 'pendiente'}`);
            }
        };
    });
};


const editarTareaButton = () => {
    const editButtons = document.querySelectorAll('.editarTarea');
    editButtons.forEach(button => {
        button.onclick = async (e) => {
            const tareasId = e.currentTarget.getAttribute('data-id');
            const selectTarea = tareas.find(tarea => tarea.id == tareasId);
            if (selectTarea) {
                const { value: nuevaDescripcion } = await Swal.fire({
                    title: 'Editar Tarea',
                    input: 'text',
                    inputLabel: 'Nueva descripción',
                    inputValue: selectTarea.descripcion,
                    showCancelButton: true,
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar'
                });

                if (nuevaDescripcion !== null && nuevaDescripcion.trim() !== '') {
                    selectTarea.descripcion = nuevaDescripcion.trim();
                    guardarTareas();
                    renderTareas(tareas);
                    showTemporaryMessage('Tarea editada exitosamente');
                }
            }
        };
    });
};


const eliminarTareaButton = () => {
    const deleteButtons = document.querySelectorAll('.eliminarTarea');
    deleteButtons.forEach(button => {
        button.onclick = async (e) => {
            const tareasId = e.currentTarget.getAttribute('data-id');
            const confirmResult = await showConfirmDialog('¿Estás seguro de que quieres eliminar esta tarea?');
            if (confirmResult.isConfirmed) {
                tareas = tareas.filter(tarea => tarea.id != tareasId);
                guardarTareas();
                renderTareas(tareas);
                showTemporaryMessage('Tarea eliminada exitosamente');
            }
        };
    });
};


const filterTareas = (filter) => {
    let filteredTareas = [];
    if (filter === 'all') {
        filteredTareas = tareas;
    } else if (filter === 'completed') {
        filteredTareas = tareas.filter(tarea => tarea.completada);
    } else if (filter === 'pending') {
        filteredTareas = tareas.filter(tarea => !tarea.completada);
    }
    renderTareas(filteredTareas);
};



filterButtons.forEach(button => {
    button.onclick = (e) => {
        const filter = e.currentTarget.getAttribute('data-filter');
        filterTareas(filter);
    };
});


filterButtons.forEach(button => {
    button.onclick = (e) => {
        const filter = e.currentTarget.getAttribute('data-filter');
        filterTareas(filter);
    }
})


renderTareas(tareas)
//////////////////////////////////////////

const filterTarea = () => {
    const searchValue = document.getElementById('searchTask').value.toLowerCase();
    const filteredTareas = tareas.filter(tarea => tarea.descripcion.toLowerCase().includes(searchValue));
    renderTareas(filteredTareas);
};

document.getElementById('searchTask').addEventListener('input', filterTarea);

const toggleTheme = () => {
    document.body.classList.toggle('dark-theme');
};

document.getElementById('themeToggle').addEventListener('click', toggleTheme);