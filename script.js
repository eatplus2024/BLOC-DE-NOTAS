const notesContainer = document.getElementById('notes');
const addNoteButton = document.getElementById('addNote');

// Función para guardar todas las notas en localStorage
function saveNotes() {
    const notes = [];
    const noteElements = document.querySelectorAll('.note');
    noteElements.forEach(noteEl => {
        const id = parseInt(noteEl.dataset.id);
        const title = noteEl.querySelector('.note-title').value;
        const content = noteEl.querySelector('.note-textarea').value;
        const color = noteEl.style.backgroundColor;
        const priority = noteEl.querySelector('select').value;
        const tags = noteEl.querySelector('input[placeholder*="Etiquetas"]').value;
        const height = noteEl.querySelector('.note-textarea').style.height;
        notes.push({ id, title, content, color, priority, tags, height });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Función para crear una nota
function createNote(id, title = '', content = '', color = '#f0f0f0', priority = '', tags = '', height = '150px') {
    const note = document.createElement('div');
    note.classList.add('note');
    note.dataset.id = id;
    note.style.backgroundColor = color;

    note.innerHTML = `
        <div class="note-content">
            <input type="text" value="${title}" placeholder="Título" class="note-title">
            <textarea placeholder="Escribe aquí:" class="note-textarea">${content}</textarea>
        </div>
        <div class="options">
            <button class="color-btn" title="Color">Color</button>
            <select title="Prioridad">
                <option value="" ${priority === '' ? 'selected' : ''}>Prioridad</option>
                <option value="alta" ${priority === 'alta' ? 'selected' : ''}>Alta</option>
                <option value="normal" ${priority === 'normal' ? 'selected' : ''}>Normal</option>
                <option value="baja" ${priority === 'baja' ? 'selected' : ''}>Baja</option>
            </select>
            <input type="text" value="${tags}" placeholder="Etiquetas (separadas por comas)" title="Etiquetas">
            <button class="save" title="Guardar">Guardar</button>
            <button class="delete" title="Eliminar">Eliminar</button>
        </div>
    `;

    const textarea = note.querySelector('.note-textarea');
    textarea.style.height = height;

    // Eventos
    note.querySelector('.save').addEventListener('click', saveNotes);
    note.querySelector('.delete').addEventListener('click', () => {
        note.remove();
        saveNotes();
    });
    note.querySelector('.color-btn').addEventListener('click', () => {
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = rgbToHex(note.style.backgroundColor);
        colorPicker.style.display = 'none';
        colorPicker.addEventListener('input', (e) => {
            note.style.backgroundColor = e.target.value;
            saveNotes();
        });
        document.body.appendChild(colorPicker);
        colorPicker.click();
        document.body.removeChild(colorPicker);
    });
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    return note;
}

// Función para convertir color RGB a HEX
function rgbToHex(rgb) {
    if (!rgb) return '#f0f0f0';
    const result = rgb.match(/\d+/g);
    if (!result) return '#f0f0f0';
    return "#" + result.map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join('');
}

// Función para cargar notas guardadas
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesContainer.innerHTML = '';
    notes.forEach(({ id, title, content, color, priority, tags, height }) => {
        const note = createNote(id, title, content, color, priority, tags, height);
        notesContainer.appendChild(note);
    });
}

// Evento para agregar nueva nota
addNoteButton.addEventListener('click', () => {
    const id = Date.now();
    const note = createNote(id);
    notesContainer.appendChild(note);
    saveNotes();
});

// Al iniciar, cargamos las notas
loadNotes();
