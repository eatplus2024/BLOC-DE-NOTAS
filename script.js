// Función para crear una nota
function createNote(id, title = '', content = '', color = '#E7E4E4', priority = '', tags = '', height = '150px') {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.backgroundColor = color;

    note.innerHTML = `
        <div class="note-content">
            <input type="text" value="${title}" placeholder="Título" class="note-title">
            <textarea placeholder="Escribe aquí:" class="note-textarea" style="height: ${height};">${content}</textarea>
        </div>
        <div class="options">
            <button class="color-btn" title="Color">Color</button>
            <select title="Elegir prioridad">
                <option value="" disabled selected>Elegir prioridad</option>
                <option value="alta" ${priority === 'alta' ? 'selected' : ''}>Alta</option>
                <option value="normal" ${priority === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="baja" ${priority === 'baja' ? 'selected' : ''}>Baja</option>
            </select>
            <input type="text" value="${tags}" placeholder="Etiquetas (separadas por comas)" title="Etiquetas">
            <button class="save" title="Guardar">Guardar</button>
            <button class="delete" title="Eliminar">Eliminar</button>
        </div>
    `;

    const titleInput = note.querySelector('.note-title');
    const textarea = note.querySelector('.note-textarea');
    const colorButton = note.querySelector('.color-btn');
    const prioritySelect = note.querySelector('select');
    const tagsInput = note.querySelector('input[placeholder^="Etiquetas"]');
    const saveButton = note.querySelector('.save');
    const deleteButton = note.querySelector('.delete');

    function saveCurrentNote() {
        updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value, textarea.style.height);
    }

    titleInput.addEventListener('input', saveCurrentNote);
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        saveCurrentNote();
    });

    colorButton.addEventListener('click', () => {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = note.style.backgroundColor;
        colorInput.addEventListener('input', (event) => {
            note.style.backgroundColor = event.target.value;
            saveCurrentNote();
        });
        colorInput.click();
    });

    prioritySelect.addEventListener('change', saveCurrentNote);
    tagsInput.addEventListener('input', saveCurrentNote);

    saveButton.addEventListener('click', () => {
        saveCurrentNote();
        note.classList.add('bordered');
    });

    deleteButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            deleteNote(id);
        }
    });

    return note;
}

// Código para cambiar tema claro/oscuro
const toggleThemeButton = document.getElementById('toggleTheme');
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleThemeButton.textContent = document.body.classList.contains('dark-mode') 
        ? 'Cambiar Color del Tema: Oscuro' 
        : 'Cambiar Color del Tema: Claro';
});

// Código faltante de funciones de ejemplo
// Estas funciones debes tenerlas ya en tu proyecto
function updateNote(id, title, content, color, priority, tags, height) {
    // Aquí deberías actualizar tu nota en el almacenamiento local o como manejes tus datos
}

function deleteNote(id) {
    const note = document.getElementById('notes').querySelector(`[data-id="${id}"]`);
    if (note) {
        note.remove();
    }
}
