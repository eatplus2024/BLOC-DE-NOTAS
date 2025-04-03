const addNoteButton = document.getElementById('addNote');
const notesContainer = document.getElementById('notes');
const searchNotesInput = document.getElementById('searchNotes');

function createNote(id, title = '', content = '', color = 'white', priority = 'normal', tags = '') {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.backgroundColor = color;
    note.innerHTML = `
        <input type="text" value="${title}" placeholder="Título">
        <textarea>${content}</textarea>
        <div class="options">
            <input type="color" value="${color}" title="Cambiar color">
            <select title="Prioridad">
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
    const colorInput = note.querySelector('input[type="color"]');
    const prioritySelect = note.querySelector('select');
    const tagsInput = note.querySelector('input[type="text"]:last-of-type');
    const saveButton = note.querySelector('.save');
    const deleteButton = note.querySelector('.delete');

    titleInput.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, colorInput.value, prioritySelect.value, tagsInput.value));
    textarea.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, colorInput.value, prioritySelect.value, tagsInput.value));
    colorInput.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, colorInput.value, prioritySelect.value, tagsInput.value));
    prioritySelect.addEventListener('change', () => updateNote(id, titleInput.value, textarea.value, colorInput.value, prioritySelect.value, tagsInput.value));
    tagsInput.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, colorInput.value, prioritySelect.value, tagsInput.value));
    saveButton.addEventListener('click', () => updateNote(id, titleInput.value, textarea.value, colorInput.value, prioritySelect.value, tagsInput.value));
    deleteButton.addEventListener('click', () => deleteNote(id));

    return note;
}

function renderNotes(notes = JSON.parse(localStorage.getItem('notes')) || []) {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = createNote(note.id, note.title, note.content, note.color, note.priority, note.tags);
        notesContainer.appendChild(noteElement);
    });
}

function addNote() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const newNote = {
        id: Date.now(),
        title: '',
        content: '',
        color: 'white',
        priority: 'normal',
        tags: ''
    };
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function updateNote(id, title, content, color, priority, tags) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find(note => note.id === id);
    if (note) {
        note.title = title;
        note.content = content;
        note.color = color;
        note.priority = priority;
        note.tags = tags;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function searchNotes(searchTerm) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const filteredNotes = notes.filter(note => {
        return note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.tags.toLowerCase().includes(searchTerm.toLowerCase());
    });
    renderNotes(filteredNotes);
}

addNoteButton.addEventListener('click', addNote);
searchNotesInput.addEventListener('input', () => searchNotes(searchNotesInput.value));
renderNotes();
