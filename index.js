const createNoteArea = document.querySelector(".createNoteArea");
const modal = document.querySelector(".editable-note-modal");
const modalBackground = document.querySelector(".note-modal-background");
const mainContainer = document.querySelector(".main-container");
const createNodeFile = document.querySelector(".create-note-image-file");

let isModalOpen = false;
let modelOpenContentId;
let isCreatingPinnedNote = false;

displayNotes();

const creatingPin = document.querySelector("#creating-pin");
creatingPin.addEventListener("click", () => {
  togglePinCreatingNote();
});

createNoteArea.addEventListener("click", () => {
  const createNodeTitle = document.querySelector(".create-title");
  createNodeTitle.style.display = "block";
  const createNodeOptionsContainer = document.querySelector(
    ".create-options-container"
  );
  createNodeOptionsContainer.style.display = "block";
});

createNodeFile.addEventListener("change", (event) => {
  const image_file = event.target.files[0];
  let fileReader = new FileReader();
  fileReader.readAsDataURL(image_file);

  const targetArea = document.querySelector(".create-note-image");

  fileReader.addEventListener("load", function (e) {
    targetArea.innerHTML = `<img src="${e.target.result}" alt="" />
                  `;
  });
});

function createNote(
  createNodeTitle,
  createNodeDescription,
  createNodeImage,
  iscreateNodePinned = false
) {
  if (createNodeTitle || createNodeDescription || createNodeImage) {
    let notesCount = JSON.parse(window.localStorage.getItem("notesCount")) ?? 0;
    let notesIDGiver =
      JSON.parse(window.localStorage.getItem("notesIDGiver")) ?? 1;

    const note = {
      id: notesIDGiver,
      title: createNodeTitle,
      description: createNodeDescription,
      imageURL: createNodeImage,
      isPinned: iscreateNodePinned,
    };

    let notes = JSON.parse(window.localStorage.getItem("notes"));

    if (notes) {
      notes.push(note);
    } else {
      notes = [note];
    }

    window.localStorage.setItem("notes", JSON.stringify(notes));
    window.localStorage.setItem("notesCount", notesCount + 1);
    window.localStorage.setItem("notesIDGiver", notesIDGiver + 1);
    displayNotes();
  }
}

function updateNote(noteId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));
  let node = document.querySelector(".editable-note-modal");

  const [titlePlaceholder, descriptionPlaceholder] = [
    node.querySelector(".note-title").getAttribute("data-placeholder"),
    node.querySelector(".note-description").getAttribute("data-placeholder"),
  ];

  const [title, description] = [
    node.querySelector(".note-title").innerText == titlePlaceholder
      ? ""
      : node.querySelector(".note-title").innerText,
    node.querySelector(".note-description").innerText == descriptionPlaceholder
      ? ""
      : node.querySelector(".note-description").innerText,
  ];

  for (let note of notes) {
    if (
      note.id == noteId &&
      (note.title != title || note.description != description)
    ) {
      note.title = title;
      note.description = description;
      break;
    }
  }

  window.localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function deleteNote(noteId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));
  let notesCount = JSON.parse(window.localStorage.getItem("notesCount"));

  notes = notes.filter((note) => note.id != noteId);

  window.localStorage.setItem("notes", JSON.stringify(notes));
  window.localStorage.setItem("notesCount", Math.max(notesCount - 1, 0));
  closeModal();
  displayNotes();
}

function closeModal() {
  modal.classList.remove("transition");
  modalBackground.style.display = "none";
  isModalOpen = false;
  modelOpenContentId = null;
}

function openModal() {
  modal.classList.add("transition");
  modalBackground.style.display = "inherit";
  isModalOpen = true;
}

function saveNote(noteId) {
  updateNote(noteId);
  closeModal();
}

function duplicateNote(noteId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));
  currentNote = notes.find((note) => note.id == noteId);
  createNote(
    currentNote.title,
    currentNote.description,
    currentNote.imageURL,
    currentNote.isPinned
  );
}

function togglePinCreatingNote() {
  isCreatingPinnedNote = !isCreatingPinnedNote;
  creatingPin.style.color = isCreatingPinnedNote ? "black" : "grey";
}

function togglePinNote(noteId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));
  //   currentNote = notes.find((note) => note.id == noteId);

  for (let note of notes) {
    if (note.id == noteId) {
      note.isPinned = !note.isPinned;
      break;
    }
  }

  window.localStorage.setItem("notes", JSON.stringify(notes));

  displayNotes();
}

function discardCreatingNote() {
  let createNodeTitle = document.querySelector(".create-title");
  let createNodeDescription = document.querySelector(".create-description");
  let createNodeImage = document.querySelector(".create-note-image");

  createNodeTitle.innerHTML = "";
  createNodeDescription.innerHTML = "";
  createNodeImage.innerHTML = "";
}

function test() {
  console.log("test");
}

function addImage(nodeId) {
  let notes = JSON.parse(window.localStorage.getItem("notes"));
  let node = Array.from(document.querySelectorAll(".note")).find(
    (n) => n.id == nodeId
  );
  const imageInNotes = node.querySelector(".note-image").querySelector("img");
  for (let note of notes) {
    if (note.id == nodeId) {
      note.imageURL = imageInNotes.src;
      break;
    }
  }

  if (modal.querySelector(".note-image")) {
    modal.querySelector(
      ".note-image"
    ).innerHTML = `<img src="${imageInNotes.src}" alt=" "></img>`;
  }

  window.localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function displayNotes() {
  const notes = JSON.parse(window.localStorage.getItem("notes"));
  let displayNoteArea = document.querySelector(".displayNoteArea");
  let displayPinnedNoteArea = document.querySelector(".displayPinnedNoteArea");
  displayNoteArea.innerHTML = "";
  displayPinnedNoteArea.innerHTML = ``;
  let pinnedNoteCount = 0;
  notes?.forEach((note) => {
    let isNoteContentNotHidden = note.title || note.description;
    let pinColor = note.isPinned ? "black" : "grey";

    let newNoteNode = `<div class="note" id=${note.id} >
     <button class="icon-btn pin" style='color:${pinColor}' onClick="togglePinNote(${
      note.id
    })"><i class="fa fa-thumb-tack"></i></button>  
        <div class="note-content-container">
            <div class="note-image"> 
                ${
                  note.imageURL
                    ? `<img src="${note.imageURL}" alt=" "></img>`
                    : ""
                }      
            </div>
            <div class="note-content" style='display:${
              !isNoteContentNotHidden ? "none" : "inherit"
            }'>
            <div class="editable note-title line-clamp-properties-2" tabindex="0" data-placeholder="Title"><pre>${
              note.title
            }</pre></div>
    <div class="editable note-description line-clamp-properties-7" tabindex="0" data-placeholder="Note description.."><pre>${
      note.description
    }</pre></div>
            </div>
        </div>
        <div class="notes-options-container">
                <div class="note-options">
                    <div class="note-actions">
                        <button class="icon-btn" onClick="deleteNote(${
                          note.id
                        })"><i class="fa fa-trash"></i></button>
                        <input type='file' accept="image/*" class="note-image-file" id="note-image-file-${
                          note.id
                        }" hidden></input>
                        <label for="note-image-file-${
                          note.id
                        }" class='icon-btn'><i class="fa fa-image"></i></label>
                        <button class="icon-btn" onClick="duplicateNote(${
                          note.id
                        })"><i class="fa fa-copy"></i></button>          
                    </div>
                    <button class="saveButton" onClick='saveNote(${
                      note.id
                    })'>Save</button>    
                </div>
        </div>
        </div>
        `;

    if (note.isPinned) {
      displayPinnedNoteArea.innerHTML += newNoteNode;
      pinnedNoteCount += 1;
    } else {
      displayNoteArea.innerHTML += newNoteNode;
    }
  });
  document.querySelectorAll(".headings").forEach((n) => {
    n.style.display = pinnedNoteCount < 1 ? "none" : "block";
  });
  noteClickHandler();
  imageUploadHandler();
}

function imageUploadHandler() {
  let noteNodesOptions = document.querySelectorAll(".note");

  for (let node of noteNodesOptions) {
    node
      .querySelector(".note-image-file")
      .addEventListener("change", (event) => {
        const image_file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsDataURL(image_file);

        const targetArea = node.querySelector(".note-image");

        fileReader.addEventListener("load", function (e) {
          targetArea.innerHTML = `<img src="${e.target.result}" alt="" />
                `;
          let nodeId = node.getAttribute("id");
          addImage(nodeId);
        });
      });
  }
}

function placeholderHelper(element) {
  const placeholder = element.getAttribute("data-placeholder");

  if (!element.children[0].innerHTML)
    element.children[0].innerHTML = placeholder;

  element.addEventListener("focus", function (e) {
    const value = e.target.innerText;
    value === placeholder && (e.target.innerText = "");
  });

  element.addEventListener("blur", function (e) {
    const value = e.target.innerText;
    value === "" && (e.target.innerText = placeholder);
  });
}

function noteClickHandler() {
  let noteNodes = document.querySelectorAll(".note-content-container");
  const notes = JSON.parse(window.localStorage.getItem("notes"));

  noteNodes.forEach((node) => {
    node.addEventListener("click", () => {
      let nodeId = node.parentElement.getAttribute("id");
      openModal();
      modelOpenContentId = nodeId;

      modal.innerHTML = node.parentElement.innerHTML;
      modal.querySelector(".saveButton").style.display = "inherit";
      modal.querySelector(".note-content").style.display = "inherit";

      const title = modal.querySelector(".note-title");
      title.setAttribute("contenteditable", true);
      placeholderHelper(title);

      const description = modal.querySelector(".note-description");
      description.setAttribute("contenteditable", true);
      placeholderHelper(description);
    });
  });
}

window.addEventListener("click", (event) => {
  if (
    document.contains(event.target) &&
    !createNoteArea.contains(event.target) &&
    !isModalOpen
  ) {
    let createNodeTitle = document.querySelector(".create-title");
    let createNodeDescription = document.querySelector(".create-description");
    let createNodeImage = document.querySelector(".create-note-image");
    let createNodeOptionsContainer = document.querySelector(
      ".create-options-container"
    );
    createNodeOptionsContainer.style.display = "none";
    createNote(
      createNodeTitle.innerText,
      createNodeDescription.innerText,
      createNodeImage.children[0]?.src,
      isCreatingPinnedNote
    );
    createNodeTitle.style.display = "none";
    createNodeTitle.innerHTML = "";
    createNodeDescription.innerHTML = "";
    createNodeImage.innerHTML = "";
    if (isCreatingPinnedNote) togglePinCreatingNote();
  }
});

modalBackground.addEventListener("click", (event) => {
  saveNote(modelOpenContentId);
});
