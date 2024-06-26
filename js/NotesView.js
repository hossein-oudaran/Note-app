export default class NotesView {
  constructor(root, handlers) {
    this.root = root;
    const { onNoteAdd, onNotesEdit, onNotesSelect, onNoteDelete } = handlers;
    this.onNotesEdit = onNotesEdit;
    this.onNoteAdd = onNoteAdd;
    this.onNotesSelect = onNotesSelect;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `<div class="notes__sidebar">
    <div class="notes__logo">NOTE APP</div>
    <div class="notes__list"></div>
    <button class="notes__add">ADD NOTE</button>
  </div>
  <div class="notes__preview">
    <input type="text" class="notes__title" placeholder="note title ..." />
    <textarea name="" class="notes__body">Take some note ...</textarea>
  </div>`;

    const addNoteBtn = document.querySelector(".notes__add");
    const inputTitle = document.querySelector(".notes__title");
    const inputBody = document.querySelector(".notes__body");

    addNoteBtn.addEventListener("click", () => {
      this.onNoteAdd();
    });
    [inputTitle, inputBody].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        const newTitle = inputTitle.value.trim();
        const newBody = inputBody.value.trim();
        this.onNotesEdit(newTitle, newBody);
      });
    });

    // hide or visible preview in first loading
    //     this.updateNotePreviewVisibility(false);
  }

  _crateListItemHtml(id, title, body, updated) {
    const maxBodyLength = 50;
    return `
      <div class="notes__list-item" data-note-id=${id}>
        <div class="notes__item-header">
        <div class="notes__small-title">${title}</div>
        <span class="notes__list-trash"data-note-id=${id}><i class="fas fa-trash-alt"></i></span>
        </div>
        <div class="notes__samall-body">
        ${body.substring(0, maxBodyLength)}
        ${body > maxBodyLength ? "..." : ""}
        </div>
        <div class="notes__samll-updated">${new Date(updated).toLocaleString(
          "en",
          { dateStyle: "full", timeStyle: "short" }
        )}</div>
      </div>`;
  }
  updateNoteList(notes) {
    const noteContainer = document.querySelector(".notes__list");
    //remove noteList
    noteContainer.innerHTML = "";
    let notesList = "";
    for (const note of notes) {
      const html = this._crateListItemHtml(
        note.id,
        note.title,
        note.body,
        note.updated
      );
      notesList += html;
    }
    noteContainer.innerHTML = notesList;
    const selectedNotes = document.querySelectorAll(".notes__list-item");
    const deletedNotes = document.querySelectorAll(".notes__list-trash");
    selectedNotes.forEach((noteItem) => {
      noteItem.addEventListener("click", () => {
        this.onNotesSelect(noteItem.dataset.noteId);
      });
    });
    deletedNotes.forEach((noteItem) => {
      noteItem.addEventListener("click", (e) => {
        e.stopPropagation();
        this.onNoteDelete(noteItem.dataset.noteId);
      });
    });
  }
  updateActiveNote(note) {
    document.querySelector(".notes__title").value = note.title;
    document.querySelector(".notes__body").value = note.body;

    document.querySelectorAll(".notes__list-item").forEach((item) => {
      item.classList.remove("notes__list-item--selected");
    });

    document
      .querySelector(`.notes__list-item[data-note-id = "${note.id}"]`)
      .classList.add("notes__list-item--selected");
  }
  updateNotePreviewVisibility(visible) {
    document.querySelector(".notes__preview").style.visibility = visible
      ? "visible"
      : "hidden";
  }
}
