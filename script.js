// Código que ya tienes para crear una nota
function createNote(id, title = '', content = '', color = '#f0f0f0', priority = '', tags = '', height = null) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.backgroundColor = color;
    note.innerHTML = `
        <div class="note-content">
            <input type="text" value="${title}" placeholder="Título" class="note-title">
            <textarea placeholder="Escribe aquí:" class="note-textarea">${content}</textarea>
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

    if (height) {
        textarea.style.height = height;
    } else {
        textarea.style.height = '150px';
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

    return note;
}

// --- NUEVO CÓDIGO que faltaba:

const notesContainer = document.getElementById('notes');
const addNoteButton = document.getElementById('addNote');
const searchInput = document.getElementById('searchNotes');
const toggleThemeButton = document.getElementById('toggleTheme');

// Guardar notas en localStorage
function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Obtener notas de localStorage
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const newNote = createNote(note.id, note.title, note.content, note.color, note.priority, note.tags, note.height);
        notesContainer.appendChild(newNote);
    });
}

// Crear nueva nota
function addNewNote() {
    const id = Date.now(); // Un ID único basado en el tiempo
    const newNoteData = { id, title: '', content: '', color: '#f0f0f0', priority: '', tags: '', height: '150px' };
    const newNote = createNote(id);
    notesContainer.appendChild(newNote);

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(newNoteData);
    saveNotes(notes);
}

// Actualizar nota en localStorage
function updateNote(id, title, content, color, priority, tags, height) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notes[index] = { id, title, content, color, priority, tags, height };
        saveNotes(notes);
    }
}

// Eliminar nota
function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    saveNotes(notes);
    loadNotes();
}

// Buscar notas
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const noteElements = notesContainer.querySelectorAll('.note');
    noteElements.forEach(note => {
        const title = note.querySelector('.note-title').value.toLowerCase();
        const content = note.querySelector('.note-textarea').value.toLowerCase();
        const tags = note.querySelector('input[placeholder^="Etiquetas"]').value.toLowerCase();
        if (title.includes(searchTerm) || content.includes(searchTerm) || tags.includes(searchTerm)) {
            note.style.display = 'block';
        } else {
            note.style.display = 'none';
        }
    });
});

// Cambiar tema claro/oscuro
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        toggleThemeButton.textContent = 'Cambiar Color del Tema: Oscuro';
    } else {
        toggleThemeButton.textContent = 'Cambiar Color del Tema: Claro';
    }
});

// Evento para crear una nueva nota
addNoteButton.addEventListener('click', addNewNote);

// Cargar las notas existentes al abrir la página
loadNotes();
