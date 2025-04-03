const addNoteButton = document.getElementById('addNote');
const notesContainer = document.getElementById('notes');

function createNote(id, title = '', content = '', color = 'white') {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.backgroundColor = color;
    note.innerHTML = `
        <input type="text" value="${title}" placeholder="Título">
        <textarea>${content}</textarea>
        <div class="options">
            <input type="color" value="${color}">
            <button class="delete">Eliminar</button>
        </div>
    `;

    const titleInput = note.querySelector('input');
    const textarea = note.querySelector('textarea');
    const colorInput = note.querySelector('input[type="color"]');
    const deleteButton = note.querySelector('.delete');

    titleInput.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, colorInput.value));
    textarea.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, colorInput.value));
    colorInput.addEventListener('input', () => updateNote(id, titleInput.value, textarea.value, colorInput.value));
    deleteButton.addEventListener('click', () => deleteNote(id));

    return note;
}

function renderNotes() {
    notesContainer.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        const noteElement = createNote(note.id, note.title, note.content, note.color);
        notesContainer.appendChild(noteElement);
    });
}

function addNote() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const newNote = {
        id: Date.now(),
        title: '',
        content: '',
        color: 'white'
    };
    notes.push(newNote);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function updateNote(id, title, content, color) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find(note => note.id === id);
    if (note) {
        note.title = title;
        note.content = content;
        note.color = color;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

function deleteNote(id) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

addNoteButton.addEventListener('click', addNote);
renderNotes();
