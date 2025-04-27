const addNoteButton = document.getElementById('addNote');
const notesContainer = document.getElementById('notes');
const searchNotesInput = document.getElementById('searchNotes');
const toggleThemeButton = document.getElementById('toggleTheme');
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let undoStack = [];
let redoStack = [];

// Cargar tema
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    toggleThemeButton.textContent = 'Cambiar Color del Tema: Oscuro';
}

function createNote(id, title = '', content = '', color = '#f0f0f0', priority = '', tags = '', height = '') {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.backgroundColor = color;
    note.innerHTML = `
        <input type="text" value="${title}" placeholder="Título">
        <textarea placeholder="Escribe aquí:" style="height: ${height || 'auto'};">${content}</textarea>
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

    const titleInput = note.querySelector('input[type="text"]');
    const textarea = note.querySelector('textarea');
    const colorButton = note.querySelector('.color-btn');
    const prioritySelect = note.querySelector('select');
    const tagsInput = note.querySelector('input[placeholder^="Etiquetas"]');
    const saveButton = note.querySelector('.save');
    const deleteButton = note.querySelector('.delete');

    // Ajustar altura automática al cargar
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

    // Actualizar datos al escribir
    titleInput.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value, textarea.style.height));
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value, textarea.style.height);
    });

    colorButton.addEventListener('click', () => {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = note.style.backgroundColor;
        colorInput.addEventListener('change', (event) => {
            note.style.backgroundColor = event.target.value;
            updateNote(id, titleInput.value, textarea.value, event.target.value, prioritySelect.value, tagsInput.value, textarea.style.height);
        });
        colorInput.click();
    });

    prioritySelect.addEventListener('change', () => updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value, textarea.style.height));
    tagsInput.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value, textarea.style.height));

    saveButton.addEventListener('click', () => {
        updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value, textarea.style.height);
        note.classList.add('bordered');
    });

    deleteButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            deleteNote(id);
        }
    });

    return note;
}

// Función para actualizar nota en localStorage
function updateNote(id, title, content, color, priority, tags, height) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notes[index] = { id, title, content, color, priority, tags, height };
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

// Renderizar notas
function renderNotes(notes = JSON.parse(localStorage.getItem('notes')) || []) {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = createNote(note.id, note.title, note.content, note.color, note.priority, note.tags, note.height);
        notesContainer.appendChild(noteElement);
    });
}

// Crear nueva nota
addNoteButton.addEventListener('click', () => {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const id = Date.now();
    const newNote = { id, title: '', content: '', color: '#f0f0f0', priority: '', tags: '', height: 'auto' };
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
});

// Buscar notas
searchNotesInput.addEventListener('input', () => {
    const searchText = searchNotesInput.value.toLowerCase();
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const filteredNotes = notes.filter(note => note.title.toLowerCase().includes(searchText) || note.content.toLowerCase().includes(searchText));
    renderNotes(filteredNotes);
});

// Cambiar tema
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Cambiar Color del Tema: Oscuro' : 'Cambiar Color del Tema: Claro';
});

// Inicializar
renderNotes();
