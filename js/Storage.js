let tareasStorage = localStorage.getItem("tareasRealizadas")
tareasStorage = JSON.parse(tareasStorage)

let tareaContainer = document.getElementById("tareas-section")

function renderCard (tareaItems) {
    tareaItems.forEach (tarea => {
        const card = document.createElement("div")
        card.innerHTML = `
                        <div class="card">
                        <div class="card-header">
                            TAREA N #${tarea.id}
                        </div>
                        <div class="card-body"> 
                            <p class="card-text">${tarea.descripcion}</p>
                            <a href="#" class="eliminarTarea btn btn-danger" data-id=${tarea.id}>ELIMINAR</a>
                        </div>
                        </div>
        `
        tareaContainer.appendChild(card)
    })
}
renderCard(tareasStorage)

const eliminarTarea=()=>{
    const deleteButton = document.querySelectorAll('.eliminarTarea');
    deleteButton.forEach(button => {
        button.onclick = (e) => {
            const tareasID = e.currentTarget.getAttribute('data-id');
            tareas = tareasStorage.filter(tarea => tarea.id != tareasID);
            renderTareas(tareas);
        };
    });
}
