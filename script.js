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

function createNote(id, title = '', content = '', color = '#f0f0f0', priority = '', tags = '', height = null) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.backgroundColor = color;
    note.dataset.id = id; // guardar id en data

    note.innerHTML = `
        <input type="text" value="${title}" placeholder="Título">
        <textarea placeholder="Escribe aquí:">${content}</textarea>
        <div class="options">
            <button class="color-btn" title="Color">Color</button>
            <select title="Elegir prioridad">
                <option value="" disabled ${priority === '' ? 'selected' : ''}>Elegir prioridad</option>
                <option value="alta" ${priority === 'alta' ? 'selected' : ''}>Alta</option>
                <option value="normal" ${priority === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="baja" ${priority === 'baja' ? 'selected' : ''}>Baja</option>
            </select>
            <input type="text" value="${tags}" placeholder="Etiquetas (separadas por comas)" title="Etiquetas">
            <button class="save" title="Guardar">Guardar</button>
            <button class="move-up" title="Subir">⬆️</button>
            <button class="move-down" title="Bajar">⬇️</button>
            <button class="delete" title="Eliminar">Eliminar</button>
        </div>
    `;

    const titleInput = note.querySelector('input[type="text"]');
    const textarea = note.querySelector('textarea');
    const colorButton = note.querySelector('.color-btn');
    const prioritySelect = note.querySelector('select');
    const tagsInput = note.querySelector('input[placeholder^="Etiquetas"]');
    const saveButton = note.querySelector('.save');
    const moveUpButton = note.querySelector('.move-up');
    const moveDownButton = note.querySelector('.move-down');
    const deleteButton = note.querySelector('.delete');

    // Si hay altura guardada, asignarla
    if (height) {
        textarea.style.height = height;
    } else {
        textarea.style.height = textarea.scrollHeight + 'px';
    }

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
        colorInput.addEventListener('change', (event) => {
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

    // Subir nota
    moveUpButton.addEventListener('click', () => {
        if (note.previousElementSibling) {
            notesContainer.insertBefore(note, note.previousElementSibling);
            saveNotesOrder();
        }
    });

    // Bajar nota
    moveDownButton.addEventListener('click', () => {
        if (note.nextElementSibling) {
            notesContainer.insertBefore(note.nextElementSibling, note);
            saveNotesOrder();
        }
    });

    return note;
}

function updateNote(id, title, content, color, priority, tags, height) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notes[index] = { id, title, content, color, priority, tags, height };
    } else {
        notes.push({ id, title, content, color, priority, tags, height });
    }
    localStorage.setItem('notes', JSON.stringify(notes));
}

function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function saveNotesOrder() {
    const notesElements = Array.from(notesContainer.children);
    const notes = notesElements.map(noteElement => {
        const id = parseInt(noteElement.dataset.id);
        const title = noteElement.querySelector('input[type="text"]').value;
        const content = noteElement.querySelector('textarea').value;
        const color = noteElement.style.backgroundColor;
        const priority = noteElement.querySelector('select').value;
        const tags = noteElement.querySelector('input[placeholder^="Etiquetas"]').value;
        const height = noteElement.querySelector('textarea').style.height;
        return { id, title, content, color, priority, tags, height };
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes(notes = JSON.parse(localStorage.getItem('notes')) || []) {
    notesContainer.innerHTML = '';
    notes.forEach(noteData => {
        const noteElement = createNote(
            noteData.id,
            noteData.title,
            noteData.content,
            noteData.color,
            noteData.priority,
            noteData.tags,
            noteData.height
        );
        notesContainer.appendChild(noteElement);
    });
}

// Crear nueva nota
addNoteButton.addEventListener('click', () => {
    const id = Date.now();
    const newNote = createNote(id);
    notesContainer.appendChild(newNote);
    updateNote(id, '', '', '#f0f0f0', '', '', 'auto');
});
