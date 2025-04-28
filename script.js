const addNoteButton = document.getElementById('addNote');
const notesContainer = document.getElementById('notes');
const searchNotesInput = document.getElementById('searchNotes');
const toggleThemeButton = document.getElementById('toggleTheme');
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let undoStack = [];
let redoStack = [];

if (isDarkMode) {
    document.body.classList.add('dark-mode');
    toggleThemeButton.textContent = 'Cambiar Color del Tema: Oscuro';
}

function createNote(id, title = '', content = '', color = '#f0f0f0', priority = '', tags = '') {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.backgroundColor = color;
    note.innerHTML = `
        <input type="text" value="${title}" placeholder="Título" style="min-height: 30px;">
        <textarea placeholder="Escribe aquí:" style="min-height: 60px;">${content}</textarea>
        <div class="options">
            <button class="pin" title="Fijar">Fijar</button>
            <button class="move-up" title="Subir">↑</button>
            <button class="move-down" title="Bajar">↓</button>
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
    const tagsInput = note.querySelector('input[type="text"]:last-of-type');
    const saveButton = note.querySelector('.save');
    const deleteButton = note.querySelector('.delete');
    const pinButton = note.querySelector('.pin');
    const moveUpButton = note.querySelector('.move-up');
    const moveDownButton = note.querySelector('.move-down');

    function adjustTextarea() {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    titleInput.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value));
    
    textarea.addEventListener('input', () => {
        adjustTextarea();
        updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value);
    });

    adjustTextarea(); // Ajuste inicial

    colorButton.addEventListener('click', () => {
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = note.style.backgroundColor;
        colorInput.addEventListener('change', (event) => {
            note.style.backgroundColor = event.target.value;
            updateNote(id, titleInput.value, textarea.value, event.target.value, prioritySelect.value, tagsInput.value);
        });
        colorInput.click();
    });

    prioritySelect.addEventListener('change', () => updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value));
    tagsInput.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value));
    saveButton.addEventListener('click', () => {
        updateNote(id, titleInput.value, textarea.value, note.style.backgroundColor, prioritySelect.value, tagsInput.value);
        note.classList.add('bordered');
    });
    deleteButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            deleteNote(id);
        }
    });

    // Botón de fijar
    pinButton.addEventListener('click', () => {
        notesContainer.prepend(note);
        saveAllNotes();
    });

    // Botón de mover hacia arriba
    moveUpButton.addEventListener('click', () => {
        const prevNote = note.previousElementSibling;
        if (prevNote) {
            notesContainer.insertBefore(note, prevNote);
            saveAllNotes();
        }
    });

    // Botón de mover hacia abajo
    moveDownButton.addEventListener('click', () => {
        const nextNote = note.nextElementSibling;
        if (nextNote) {
            notesContainer.insertBefore(nextNote, note);
            saveAllNotes();
        }
    });

    return note;
}

function renderNotes(notes = JSON.parse(localStorage.getItem('notes')) || []) {
    notesContainer.innerHTML = '';
    notes.forEach(noteData => {
        const note = createNote(noteData.id, noteData.title, noteData.content, noteData.color, noteData.priority, noteData.tags);
        notesContainer.prepend(note); // Ahora se agregan del más reciente al más viejo
    });
}

// Guardar todas las notas
function saveAllNotes() {
    const allNotes = [...notesContainer.children].map(note => {
        const title = note.querySelector('input[type="text"]').value;
        const content = note.querySelector('textarea').value;
        const color = note.style.backgroundColor;
        const priority = note.querySelector('select').value;
        const tags = note.querySelector('input[type="text"]:last-of-type').value;
        return { id: generateId(), title, content, color, priority, tags };
    });
    localStorage.setItem('notes', JSON.stringify(allNotes));
}

// (Aquí seguiría tu código de `updateNote`, `deleteNote`, etc.)

