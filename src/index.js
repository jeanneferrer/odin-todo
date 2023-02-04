// All DOM-related code goes here
import "./styles.css";
import AddIcon from "./assets/add-icon.svg";
import DeleteIcon from "./assets/trash-icon.svg";
import EditIcon from "./assets/edit-icon.svg";
import CloseIcon from "./assets/close-icon.svg";
import CheckIcon from "./assets/check-icon.svg";
import UncheckedIcon from "./assets/circle-icon.svg";
import ToDoItem from "./ToDoItem";
import Project from "./Project";
import { format } from 'date-fns';
import { getLocalProjectList, saveLocalProjectList } from "./Storage";

// convert name to id 
function convertToId(name) {
    return name.replace(/\s+/g, '-').toLowerCase();
}

// expand a single todo to see/edit its details
// delete a todo
function displayToDo(projectList, project, toDoItem) {
    const toDoDiv = document.createElement("div");
    toDoDiv.setAttribute('class', 'todo-div');
    toDoDiv.dataset.project = convertToId(project.projectTitle);

    // simplified view
    const toDoHeader = document.createElement("div");
    toDoHeader.setAttribute('class', 'todo-header');
    const textHeader = document.createElement("div");
    const toDoHeaderTitle = document.createElement("h3");
    toDoHeaderTitle.textContent = toDoItem.title;
    toDoHeaderTitle.addEventListener('click', () => {
        document.querySelectorAll('.todo-div').forEach(tdDiv => {
            if (tdDiv.querySelector('.todo-header').style.display === 'none' && tdDiv.querySelector('.new-todo-form') === null) {
                tdDiv.querySelector('.todo-header').style.display = 'flex';
                tdDiv.querySelector('.todo-collapsed').style.display = 'none';
            }
        });
        toDoHeader.style.display = 'none';
        toDoCollapsed.style.display = 'flex';
    });
    const toDoHeaderDate = document.createElement("p");
    toDoHeaderDate.textContent = toDoItem.dueDate === "" ? "" : `Due on ${format(new Date(toDoItem.dueDate+"T00:00"), 'MMM d, yyyy')}`;
    textHeader.appendChild(toDoHeaderTitle);
    textHeader.appendChild(toDoHeaderDate);
    const toDoHeaderCheckboxDiv = document.createElement("div");
    toDoHeaderCheckboxDiv.setAttribute('class', 'todo-header-checkbox-div');
    const checkedHeaderIcon = new Image();
    const uncheckedHeaderIcon = new Image();
    checkedHeaderIcon.src = CheckIcon;
    checkedHeaderIcon.setAttribute('id', 'checked-header-icon')
    uncheckedHeaderIcon.src = UncheckedIcon;
    uncheckedHeaderIcon.setAttribute('id', 'unchecked-header-icon')
    toDoHeaderCheckboxDiv.appendChild(checkedHeaderIcon);
    toDoHeaderCheckboxDiv.appendChild(uncheckedHeaderIcon);
    if (toDoItem.isComplete) {
        checkedHeaderIcon.style.display = 'block';
        uncheckedHeaderIcon.style.display = 'none';
    } else {
        checkedHeaderIcon.style.display = 'none';
        uncheckedHeaderIcon.style.display = 'block';
    }
    toDoHeader.appendChild(toDoHeaderCheckboxDiv);
    toDoHeader.appendChild(textHeader);

    // collapsed view
    const toDoCollapsed = document.createElement("div");
    toDoCollapsed.setAttribute('class', 'todo-collapsed');
    const toDoCollapsedCheckbox = document.createElement("div");
    toDoCollapsedCheckbox.setAttribute('class', 'todo-collapsed-checkbox');
    const checkedIcon = new Image();
    checkedIcon.src = CheckIcon;
    checkedIcon.setAttribute('id', 'checked-icon');
    const uncheckedIcon = new Image();
    uncheckedIcon.src = UncheckedIcon;
    uncheckedIcon.setAttribute('id', 'unchecked-icon');
    toDoCollapsedCheckbox.appendChild(checkedIcon);
    toDoCollapsedCheckbox.appendChild(uncheckedIcon);
    if (toDoItem.isComplete) {
        checkedIcon.style.display = 'block';
        uncheckedIcon.style.display = 'none';
        toDoCollapsedCheckbox.classList.add('.checked');
    } else {
        checkedIcon.style.display = 'none';
        uncheckedIcon.style.display = 'block';
    }
    checkedIcon.addEventListener('click', function uncheck() {
        checkedIcon.style.display = "none";
        checkedHeaderIcon.style.display = "none";
        uncheckedIcon.style.display = "block";
        uncheckedHeaderIcon.style.display = "block";
        toDoItem.isComplete = false;
        saveLocalProjectList(projectList);
    });
    uncheckedIcon.addEventListener('click', function check() {
        uncheckedIcon.style.display = "none";
        uncheckedHeaderIcon.style.display = "none";
        checkedIcon.style.display = "block";
        checkedHeaderIcon.style.display = "block";
        toDoItem.isComplete = true;
        saveLocalProjectList(projectList);
    });
    // details
    const toDoDetailsDiv = document.createElement("div");
    toDoDetailsDiv.setAttribute('class', 'todo-details-div');
    const toDoTitleDiv = document.createElement("div"); // title
    const toDoTitle = document.createElement("input");
    toDoTitle.setAttribute('type', 'text');
    toDoTitle.setAttribute('value', toDoItem.title);
    toDoTitle.setAttribute('name', 'todo-title-input');
    toDoTitle.setAttribute('placeholder', toDoItem.title);
    const toDoTitleSpan = document.createElement("span");
    toDoTitleSpan.textContent = "Error Span";
    toDoTitleSpan.setAttribute('class', 'error-span');
    toDoTitleSpan.setAttribute('class', 'todo-title-span');
    toDoTitle.addEventListener('change', () => {
        if (toDoTitle.value.length > 0 && toDoTitle.value.length < 3) {
            toDoTitleSpan.textContent = "Title must be at least 3 characters long";
            toDoTitleSpan.style.display = 'block';
        } else if (project.checkIfToDoItemExists(toDoTitle.value) && toDoTitle.value !== toDoItem.title) {
            toDoTitleSpan.textContent = "To-do already exists";
            toDoTitleSpan.style.display = 'block';
        } else {
            toDoTitleSpan.style.display = 'none';
        }
    });
    toDoTitleDiv.appendChild(toDoTitle);
    const toDoDescriptionDiv = document.createElement("div"); // description
    const toDoDescriptionLabel = document.createElement("label");
    toDoDescriptionLabel.setAttribute('for', 'todo-description-input');
    toDoDescriptionLabel.textContent = "Description:";
    const descriptionAsterisk = document.createElement("sup");
    descriptionAsterisk.textContent = "*";
    toDoDescriptionLabel.appendChild(descriptionAsterisk);
    const toDoDescription = document.createElement("input");
    toDoDescription.setAttribute('type', 'text');
    toDoDescription.setAttribute('value', toDoItem.description);
    toDoDescription.setAttribute('name', 'todo-description-input');
    toDoDescription.setAttribute('placeholder', toDoItem.description);
    const toDoDescriptionSpan = document.createElement("span");
    toDoDescriptionSpan.textContent = "Error Span";
    toDoDescriptionSpan.setAttribute('class', 'error-span');
    toDoDescription.addEventListener('change', () => {
        if (toDoDescription.value.length > 0 && toDoDescription.value.length < 2) {
            toDoDescriptionSpan.textContent = "Description must be at least 2 characters long";
            toDoDescriptionSpan.style.display = 'block';
        } else {
            toDoDescriptionSpan.style.display = 'none';
        }
    });
    toDoDescriptionDiv.appendChild(toDoDescriptionLabel);
    toDoDescriptionDiv.appendChild(toDoDescription);
    const toDoPriorityDiv = document.createElement("div"); // priority
    const toDoPriorityLabel = document.createElement("label");
    toDoPriorityLabel.setAttribute('for', 'todo-priority-input');
    toDoPriorityLabel.textContent = "Priority:";
    const priorityAsterisk = document.createElement("sup");
    priorityAsterisk.textContent = "*";
    toDoPriorityLabel.appendChild(priorityAsterisk);
    const toDoPriority = document.createElement("select");
    toDoPriority.setAttribute('name', 'todo-priority-input');
    const priorityOptions = ["Low", "Medium", "High"];
    priorityOptions.forEach(option => {
        const toDoPriorityOption = document.createElement("option");
        toDoPriorityOption.setAttribute('value', option);
        toDoPriorityOption.textContent = option;
        toDoPriority.appendChild(toDoPriorityOption);
    });
    toDoPriority.value = toDoItem.priority;
    toDoPriorityDiv.appendChild(toDoPriorityLabel);
    toDoPriorityDiv.appendChild(toDoPriority);
    const toDoDueDateDiv = document.createElement("div"); // due date
    const toDoDueDateLabel = document.createElement("label");
    toDoDueDateLabel.setAttribute('for', 'todo-due-date-input');
    toDoDueDateLabel.textContent = "Due Date:";
    const dueDateAsterisk = document.createElement("sup");
    dueDateAsterisk.textContent = "*";
    toDoDueDateLabel.appendChild(dueDateAsterisk);
    const toDoDueDate = document.createElement("input");
    toDoDueDate.setAttribute('type', 'date');
    toDoDueDate.setAttribute('name', 'todo-due-date-input');
    toDoDueDate.value = toDoItem.dueDate;
    const toDoDueDateSpan = document.createElement("span");
    toDoDueDateSpan.textContent = "Error Span";
    toDoDueDateSpan.setAttribute('class', 'error-span');
    toDoDueDate.addEventListener('change', () => {
        if (toDoDueDate.value !== "") {
            toDoDueDateSpan.style.display = 'none';
        }
    });
    toDoDueDateDiv.appendChild(toDoDueDateLabel);
    toDoDueDateDiv.appendChild(toDoDueDate);
    const toDoTimeDiv = document.createElement("div"); // time
    const toDoTimeLabel = document.createElement("label");
    toDoTimeLabel.setAttribute('for', 'todo-time-input');
    toDoTimeLabel.textContent = "Time:";
    const toDoTime = document.createElement("input");
    toDoTime.setAttribute('type', 'time');
    toDoTime.setAttribute('name', 'todo-time-input');
    toDoTime.value = toDoItem.dueTime;
    toDoTimeDiv.appendChild(toDoTimeLabel);
    toDoTimeDiv.appendChild(toDoTime);
    const toDoNotesDiv = document.createElement("div"); // notes
    toDoNotesDiv.setAttribute('class', 'todo-notes-div');
    const toDoNotesLabel = document.createElement("label");
    toDoNotesLabel.setAttribute('for', 'todo-notes-input');
    toDoNotesLabel.textContent = "Notes:";
    const toDoNotes = document.createElement("textarea");
    toDoNotes.setAttribute('name', 'todo-notes-input');
    toDoNotes.textContent = toDoItem.notes;
    toDoNotesDiv.appendChild(toDoNotesLabel);
    toDoNotesDiv.appendChild(toDoNotes);

    const toDoButtonsDiv = document.createElement("div"); // buttons
    const todoButtons = document.createElement("div"); // when todo is expanded
    todoButtons.setAttribute('class', 'todo-buttons');
    const toDoDeleteButton = document.createElement("button");
    const toDoIcon = new Image();
    toDoIcon.src = DeleteIcon;
    toDoDeleteButton.appendChild(toDoIcon);
    toDoDeleteButton.addEventListener('click', () => {
        project.deleteToDoItem(toDoItem.title);
        toDoDiv.remove();
        saveLocalProjectList(projectList);
    });
    const toDoEditButton = document.createElement("button");
    const toDoEditIcon = new Image();
    toDoEditIcon.src = EditIcon;
    toDoEditButton.appendChild(toDoEditIcon);
    toDoEditButton.addEventListener('click', () => {
        toDoCollapsed.querySelectorAll('input, select, textarea').forEach(field => {
            field.removeAttribute('disabled');
        });
        toDoTitle.focus();
        todoButtons.style.display = "none";
        toDoCollapsed.querySelector('.todo-edit-buttons').style.display = "flex";
        if (toDoTimeDiv.style.display === "none") {
            toDoTimeDiv.style.display = "flex";
        }
        if (toDoNotesDiv.style.display === "none") {
            toDoNotesDiv.style.display = "flex";
        }
    });
    const toDoCloseButton = document.createElement("button");
    const toDoCloseIcon = new Image();
    toDoCloseIcon.src = CloseIcon;
    toDoCloseButton.addEventListener('click', () => {
        toDoCollapsed.style.display = "none";
        toDoHeader.style.display = "flex";
    });
    toDoCloseButton.appendChild(toDoCloseIcon);
    todoButtons.appendChild(toDoDeleteButton);
    todoButtons.appendChild(toDoEditButton);
    todoButtons.appendChild(toDoCloseButton);
    const todoEditButtons = document.createElement("div"); // when todo is being edited
    todoEditButtons.setAttribute('class', 'todo-edit-buttons');
    const toDoCancelButton = document.createElement("button");
    toDoCancelButton.textContent = "Cancel";
    toDoCancelButton.addEventListener('click', () => {
        toDoTitle.value = toDoItem.title;
        toDoDescription.value = toDoItem.description;
        toDoPriority.value = toDoItem.priority;
        toDoDueDate.value = toDoItem.dueDate;
        toDoTime.value = toDoItem.dueTime;
        toDoNotes.value = toDoItem.notes;
        toDoTitleSpan.style.display = "none";
        toDoDescriptionSpan.style.display = "none";
        toDoDueDateSpan.style.display = "none";
        toDoCollapsed.querySelectorAll('input, select, textarea').forEach(input => {
            input.setAttribute('disabled', '');
        });
        todoButtons.style.display = "flex";
        todoEditButtons.style.display = "none";
        if (toDoItem.dueTime === "") {
            toDoTimeDiv.style.display = "none";
        }
        if (toDoItem.notes === "") {
            toDoNotesDiv.style.display = "none";
        }
    });
    const toDoSaveButton = document.createElement("button");
    toDoSaveButton.textContent = "Save";
    toDoSaveButton.addEventListener('click', () => {
        if (toDoTitle.value.trim() === "" && toDoDescription.value.trim() === "" && toDoDueDate.value === "") {
            toDoTitleSpan.textContent = "Title is required";
            toDoTitleSpan.style.display = "block";
            toDoDescriptionSpan.textContent = "Description is required";
            toDoDescriptionSpan.style.display = "block";
            toDoDueDateSpan.textContent = "Due date is required";
            toDoDueDateSpan.style.display = "block";
        } else if (toDoTitle.value.trim() === "" && toDoDescription.value.trim() === "") {
            toDoTitleSpan.textContent = "Title is required";
            toDoTitleSpan.style.display = "block";
            toDoDescriptionSpan.textContent = "Description is required";
            toDoDescriptionSpan.style.display = "block";
        } else if (toDoTitle.value.trim() === "" && toDoDueDate.value === "") {
            toDoTitleSpan.textContent = "Title is required";
            toDoTitleSpan.style.display = "block";
            toDoDueDateSpan.textContent = "Due date is required";
            toDoDueDateSpan.style.display = "block";
        } else if (toDoDescription.value.trim() === "" && toDoDueDate.value === "") {
            toDoDescriptionSpan.textContent = "Description is required";
            toDoDescriptionSpan.style.display = "block";
            toDoDueDateSpan.textContent = "Due date is required";
            toDoDueDateSpan.style.display = "block";
        } else if (toDoTitle.value.trim() === "") {
            toDoTitleSpan.textContent = "Title is required";
            toDoTitleSpan.style.display = "block";
        } else if (toDoDescription.value.trim() === "") {
            toDoDescriptionSpan.textContent = "Description is required";
            toDoDescriptionSpan.style.display = "block";
        } else if (toDoDueDate.value === "") {
            toDoDueDateSpan.textContent = "Due date is required";
            toDoDueDateSpan.style.display = "block";
        } else if (toDoTitle.value.trim() !== "" && toDoDescription.value.trim() !== "" && toDoDueDate.value !== "") {
            toDoItem.title = toDoTitle.value;
            toDoItem.description = toDoDescription.value;
            toDoItem.priority = toDoPriority.value;
            toDoItem.dueDate = toDoDueDate.value;
            toDoItem.dueTime = toDoTime.value;
            toDoItem.notes = toDoNotes.value;
            saveLocalProjectList(projectList);
            toDoTitleSpan.style.display = "none";
            toDoDescriptionSpan.style.display = "none";
            toDoDueDateSpan.style.display = "none";
            toDoCollapsed.querySelectorAll('input, select, textarea').forEach(input => {
                input.setAttribute('disabled', '');
            });
            todoButtons.style.display = "flex";
            todoEditButtons.style.display = "none";
            if (toDoItem.dueTime === "") {
                toDoTimeDiv.style.display = "none";
            }
            if (toDoItem.notes === "") {
                toDoNotesDiv.style.display = "none";
            }
        }
    });
    todoEditButtons.appendChild(toDoCancelButton);
    todoEditButtons.appendChild(toDoSaveButton);
    toDoButtonsDiv.appendChild(todoButtons);
    toDoButtonsDiv.appendChild(todoEditButtons);
    toDoDetailsDiv.appendChild(toDoTitleDiv);
    toDoDetailsDiv.appendChild(toDoTitleSpan);
    toDoDetailsDiv.appendChild(toDoDescriptionDiv);
    toDoDetailsDiv.appendChild(toDoDescriptionSpan);
    toDoDetailsDiv.appendChild(toDoPriorityDiv);
    toDoDetailsDiv.appendChild(toDoDueDateDiv);
    toDoDetailsDiv.appendChild(toDoDueDateSpan);
    toDoDetailsDiv.appendChild(toDoTimeDiv);
    toDoDetailsDiv.appendChild(toDoNotesDiv);
    toDoDetailsDiv.appendChild(toDoButtonsDiv);

    toDoCollapsed.appendChild(toDoCollapsedCheckbox);
    toDoCollapsed.appendChild(toDoDetailsDiv);
    toDoCollapsed.querySelectorAll('input, select, textarea').forEach(input => {
        input.setAttribute('disabled', '');
    });
    toDoDiv.appendChild(toDoHeader);
    toDoDiv.appendChild(toDoCollapsed);
    return toDoDiv;
}

// display single project
function displayProject(projectList, project) {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add('project');
    projectDiv.setAttribute('id', convertToId(project.projectTitle));
    const projectHeader = document.createElement("div");
    projectHeader.setAttribute('class', 'project-header');
    const titleDiv = document.createElement("div");
    const projectTitle = document.createElement("h2");
    projectTitle.textContent = project.projectTitle;
    const titleInput = document.createElement("input");
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('placeholder', project.projectTitle);
    titleInput.setAttribute('class', 'project-title-input');
    const errorSpan = document.createElement("span");
    errorSpan.setAttribute('class', 'error-span');
    errorSpan.textContent = "Error Span";
    titleDiv.appendChild(projectTitle);
    titleDiv.appendChild(titleInput);
    titleDiv.appendChild(errorSpan);
    projectHeader.appendChild(titleDiv);

    const buttonsDiv = document.createElement("div");
    const projectBtns = document.createElement("div");
    projectBtns.setAttribute('class', 'project-buttons');
    // add todo button
    const addTodoButton = document.createElement("button");
    addTodoButton.setAttribute('class', 'add-button');
    addTodoButton.setAttribute('type', 'button');
    addTodoButton.setAttribute('title', 'Add Todo');
    const addTodoIcon = new Image();
    addTodoIcon.src = AddIcon;
    addTodoIcon.setAttribute('class', 'add-icon');
    addTodoButton.appendChild(addTodoIcon);
    addTodoButton.addEventListener('click', () => {
        document.querySelectorAll('.todo-div').forEach(toDoDiv => {
            if (toDoDiv.querySelector('.todo-header').style.display === 'none') {
                toDoDiv.querySelector('.todo-header').style.display = 'flex';
                toDoDiv.querySelector('.todo-collapsed').style.display = 'none';
            }
        });
        projectDiv.querySelector('.project-buttons').style.visibility = 'hidden';
        const newToDo = ToDoItem("", " ", " ", "", " ", " ", false);
        const newToDoDiv = displayToDo(projectList, project, newToDo);
        toDoListDiv.appendChild(newToDoDiv);
        newToDoDiv.querySelector('.todo-header').style.display = 'none';

        // form that only appears once add todo button is clicked
        const newToDoForm = document.createElement("form");
        newToDoForm.setAttribute('class', 'new-todo-form');
        const leftDiv = document.createElement("div");
        const formCheckedIcon = new Image();
        formCheckedIcon.src = CheckIcon;
        formCheckedIcon.style.display = "none";
        const formUncheckedIcon = new Image();
        formUncheckedIcon.src = UncheckedIcon;
        formCheckedIcon.addEventListener('click', () => {
            formCheckedIcon.style.display = "none";
            formUncheckedIcon.style.display = "block";
            newToDo.isComplete = false;
        });
        formUncheckedIcon.addEventListener('click', () => {
            formCheckedIcon.style.display = "block";
            formUncheckedIcon.style.display = "none";
            newToDo.isComplete = true;
        });
        leftDiv.appendChild(formCheckedIcon);
        leftDiv.appendChild(formUncheckedIcon);

        const rightDiv = document.createElement("div");
        const formTitleDiv = document.createElement("div");
        formTitleDiv.setAttribute('class', 'form-title-div');
        const toDoTitleInput = document.createElement("input");
        toDoTitleInput.setAttribute('type', 'text');
        toDoTitleInput.setAttribute('placeholder', 'Title');
        toDoTitleInput.setAttribute('name', 'title');
        toDoTitleInput.setAttribute('required', '');
        const toDoTitleInputError = document.createElement("span");
        toDoTitleInputError.setAttribute('class', 'error-span');
        toDoTitleInputError.setAttribute('class', 'todo-form-title-input-error');
        toDoTitleInputError.textContent = "Error Span";
        toDoTitleInput.addEventListener('change', () => {
            if(project.checkIfToDoItemExists(toDoTitleInput.value.trim())) {
                toDoTitleInputError.textContent = "To-do already exists";
                toDoTitleInputError.style.display = 'block';
                toDoTitleInputError.style.visibility = 'visible';
            } else if (toDoTitleInput.value.trim().length > 0 && toDoTitleInput.value.trim().length < 3) {
                toDoTitleInputError.textContent = "Title must be at least 3 characters";
                toDoTitleInputError.style.display = 'block';
                toDoTitleInputError.style.visibility = 'visible';
            } else {
                toDoTitleInputError.style.display = 'none';
            }
        });
        formTitleDiv.appendChild(toDoTitleInput);
        formTitleDiv.appendChild(toDoTitleInputError);
        const formDescriptionDiv = document.createElement("div");
        const formDescriptionLabel = document.createElement("label");
        formDescriptionLabel.setAttribute('for', 'description');
        formDescriptionLabel.textContent = "Description";
        const toDoDescriptionInput = document.createElement("input");
        toDoDescriptionInput.setAttribute('type', 'text');
        toDoDescriptionInput.setAttribute('name', 'description');
        toDoDescriptionInput.setAttribute('placeholder', 'Description');
        toDoDescriptionInput.setAttribute('required', '');
        formDescriptionDiv.appendChild(formDescriptionLabel);
        formDescriptionDiv.appendChild(toDoDescriptionInput);
        const descriptionErrorSpan = document.createElement("span");
        descriptionErrorSpan.setAttribute('class', 'error-span');
        descriptionErrorSpan.textContent = "Error Span";
        toDoDescriptionInput.addEventListener('change', () => {
            if (toDoDescriptionInput.value.trim().length > 0 && toDoDescriptionInput.value.trim().length < 2) {
                descriptionErrorSpan.textContent = "Description must be at least 2 characters";
                descriptionErrorSpan.style.display = 'block';
                descriptionErrorSpan.style.visibility = 'visible';
            } else {
                descriptionErrorSpan.style.display = 'none';
            }
        });
        const formPriorityDiv = document.createElement("div");
        const formPriorityLabel = document.createElement("label");
        formPriorityLabel.setAttribute('for', 'priority');
        formPriorityLabel.textContent = "Priority";
        const toDoPriorityInput = document.createElement("select");
        toDoPriorityInput.setAttribute('name', 'priority');
        toDoPriorityInput.setAttribute('required', '');
        const priorityOptions = ["Low", "Medium", "High"];
        priorityOptions.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.setAttribute('value', option);
            optionElement.textContent = option;
            toDoPriorityInput.appendChild(optionElement);
        });
        formPriorityDiv.appendChild(formPriorityLabel);
        formPriorityDiv.appendChild(toDoPriorityInput);
        const formDueDateDiv = document.createElement("div");
        const formDueDateLabel = document.createElement("label");
        formDueDateLabel.setAttribute('for', 'due-date');
        formDueDateLabel.textContent = "Due Date";
        const toDoDueDateInput = document.createElement("input");
        toDoDueDateInput.setAttribute('type', 'date');
        toDoDueDateInput.setAttribute('name', 'due-date');
        toDoDueDateInput.setAttribute('required', '');
        formDueDateDiv.appendChild(formDueDateLabel);
        formDueDateDiv.appendChild(toDoDueDateInput);
        const dueDateErrorSpan = document.createElement("span");
        dueDateErrorSpan.setAttribute('class', 'error-span');
        dueDateErrorSpan.textContent = "Error Span";
        toDoDueDateInput.addEventListener('change', () => {
            if (toDoDueDateInput.value.trim().length !== 0) {
                dueDateErrorSpan.style.display = 'none';
            }
        });
        const formDueTimeDiv = document.createElement("div");
        const formDueTimeLabel = document.createElement("label");
        formDueTimeLabel.setAttribute('for', 'due-time');
        formDueTimeLabel.textContent = "Due Time";
        const toDoTimeInput = document.createElement("input");
        toDoTimeInput.setAttribute('type', 'time');
        toDoTimeInput.setAttribute('name', 'due-time');
        formDueTimeDiv.appendChild(formDueTimeLabel);
        formDueTimeDiv.appendChild(toDoTimeInput);
        const formNotesDiv = document.createElement("div");
        formNotesDiv.classList.add('form-notes-div');
        const formNotesLabel = document.createElement("label");
        formNotesLabel.setAttribute('for', 'notes');
        formNotesLabel.textContent = "Notes";
        const toDoNotesInput = document.createElement("textarea");
        toDoNotesInput.setAttribute('placeholder', 'Notes');
        toDoNotesInput.setAttribute('name', 'notes');
        formNotesDiv.appendChild(formNotesLabel);
        formNotesDiv.appendChild(toDoNotesInput);
        const formButtonsDiv = document.createElement("div");
        const formCancelButton = document.createElement("button");
        formCancelButton.setAttribute('type', 'button');
        formCancelButton.textContent = "Cancel";
        formCancelButton.addEventListener('click', () => {
            newToDoDiv.remove();
            projectDiv.querySelector('.project-buttons').style.visibility = 'visible';
        });
        const formSubmitButton = document.createElement("button");
        formSubmitButton.setAttribute('type', 'submit');
        formSubmitButton.textContent = "Add To Do";
        formSubmitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (toDoTitleInput.value.trim() === "" && toDoDescriptionInput.value.trim() === "" && toDoDueDateInput.value.trim() === "") {
                toDoTitleInputError.textContent = "Title is required";
                toDoTitleInputError.style.display = 'block';
                descriptionErrorSpan.textContent = "Description is required";
                descriptionErrorSpan.style.display = 'block';
                dueDateErrorSpan.textContent = "Due Date is required";
                dueDateErrorSpan.style.display = 'block';
            } else if (toDoTitleInput.value.trim() === "" && toDoDescriptionInput.value.trim() === "") {
                toDoTitleInputError.textContent = "Title is required";
                toDoTitleInputError.style.display = 'block';
                descriptionErrorSpan.textContent = "Description is required";
                descriptionErrorSpan.style.display = 'block';
            } else if (toDoTitleInput.value.trim() === "" && toDoDueDateInput.value.trim() === "") {
                toDoTitleInputError.textContent = "Title is required";
                toDoTitleInputError.style.display = 'block';
                dueDateErrorSpan.textContent = "Due Date is required";
                dueDateErrorSpan.style.display = 'block';
            } else if (toDoDescriptionInput.value.trim() === "" && toDoDueDateInput.value.trim() === "") {
                descriptionErrorSpan.textContent = "Description is required";
                descriptionErrorSpan.style.display = 'block';
                dueDateErrorSpan.textContent = "Due Date is required";
                dueDateErrorSpan.style.display = 'block';
            } else if (toDoTitleInput.value.trim() === "") {
                toDoTitleInputError.textContent = "Title is required";
                toDoTitleInputError.style.display = 'block';
            } else if (toDoDescriptionInput.value.trim() === "") {
                descriptionErrorSpan.textContent = "Description is required";
                descriptionErrorSpan.style.display = 'block';
            } else if (toDoDueDateInput.value.trim() === "") {
                dueDateErrorSpan.textContent = "Due Date is required";
                dueDateErrorSpan.style.display = 'block';
            } else if (toDoTitleInput.value.trim() !== "" && toDoDescriptionInput.value.trim() !== "" && toDoPriorityInput.value.trim() !== "" && toDoDueDateInput.value.trim() !== "") {
                if (toDoTitleInput.value.trim().length > 0 && toDoTitleInput.value.trim().length > 2 && project.checkIfToDoItemExists(toDoTitleInput.value.trim()) === false
                    && toDoDescriptionInput.value.trim().length > 0 && toDoDescriptionInput.value.trim().length > 1
                    && toDoPriorityInput.value.trim() !== ""
                    && toDoDueDateInput.value.trim() !== "") {
                    newToDo.title = toDoTitleInput.value;
                    newToDo.description = toDoDescriptionInput.value;
                    newToDo.priority = toDoPriorityInput.value;
                    newToDo.dueDate = toDoDueDateInput.value;
                    newToDo.dueTime = toDoTimeInput.value;
                    newToDo.notes = toDoNotesInput.value.trim();
                    if (newToDo.isComplete) {
                        newToDoDiv.querySelector('#checked-header-icon').style.display = 'block';
                        newToDoDiv.querySelector('#checked-icon').style.display = 'block';
                        newToDoDiv.querySelector('#unchecked-header-icon').style.display = 'none';
                        newToDoDiv.querySelector('#unchecked-icon').style.display = 'none';
                    } else {
                        newToDoDiv.querySelector('#checked-header-icon').style.display = 'none';
                        newToDoDiv.querySelector('#checked-icon').style.display = 'none';
                        newToDoDiv.querySelector('#unchecked-header-icon').style.display = 'block';
                        newToDoDiv.querySelector('#unchecked-icon').style.display = 'block';
                    }
                    newToDoDiv.querySelector('.todo-header').style.display = 'flex';
                    newToDoDiv.querySelector('h3').textContent = newToDo.title;
                    newToDoDiv.querySelector('[name="todo-title-input"]').value = newToDo.title;
                    newToDoDiv.querySelector('[name="todo-description-input"]').value = newToDo.description;
                    newToDoDiv.querySelector('[name="todo-priority-input"]').value = newToDo.priority;
                    newToDoDiv.querySelector('[name="todo-due-date-input"]').value = newToDo.dueDate;
                    newToDoDiv.querySelector('p').textContent = `Due on ${format(new Date(newToDo.dueDate+"T00:00"), 'MMM dd, yyyy')}`;
                    newToDoDiv.querySelector('[name=todo-time-input]').value = newToDo.dueTime;
                    newToDoDiv.querySelector('[name="todo-notes-input"]').value = newToDo.notes;
                    if (newToDo.dueTime === "") newToDoDiv.querySelector('[name=todo-time-input]').parentNode.style.display = 'none';
                    if (newToDo.notes === "") newToDoDiv.querySelector('[name="todo-notes-input"]').parentNode.style.display = 'none';
                    newToDoForm.remove();
                    projectDiv.querySelector('.project-buttons').style.visibility = 'visible';
                    project.addToDoItem(newToDo);
                    saveLocalProjectList(projectList);
                }
            }
        });
        formButtonsDiv.appendChild(formCancelButton);
        formButtonsDiv.appendChild(formSubmitButton);
        rightDiv.appendChild(formTitleDiv);
        rightDiv.appendChild(formDescriptionDiv);
        rightDiv.appendChild(descriptionErrorSpan);
        rightDiv.appendChild(formPriorityDiv);
        rightDiv.appendChild(formDueDateDiv);
        rightDiv.appendChild(dueDateErrorSpan);
        rightDiv.appendChild(formDueTimeDiv);
        rightDiv.appendChild(formNotesDiv);
        rightDiv.appendChild(formButtonsDiv);
        newToDoForm.appendChild(leftDiv);
        newToDoForm.appendChild(rightDiv);
        newToDoDiv.appendChild(newToDoForm);
    });
    // delete project button
    const deleteProjectButton = document.createElement("button");
    deleteProjectButton.setAttribute('class', 'delete-button');
    deleteProjectButton.setAttribute('type', 'button');
    deleteProjectButton.setAttribute('title', 'Delete Project');
    const deleteProjectIcon = new Image();
    deleteProjectIcon.src = DeleteIcon;
    deleteProjectButton.appendChild(deleteProjectIcon);
    deleteProjectButton.addEventListener('click', () => {
        projectDiv.remove();
        projectList.deleteProject(project.projectTitle);
        saveLocalProjectList(projectList);
        if(document.querySelector('#project-list-div').childElementCount === 0) {
            document.querySelector('#blank-div').style.display = "block";
        }
    });
    const editProjectNameButton = document.createElement("button");
    editProjectNameButton.setAttribute('class', 'edit-button');
    editProjectNameButton.setAttribute('type', 'button');
    editProjectNameButton.setAttribute('title', 'Edit Project Name');
    const editProjectNameIcon = new Image();
    editProjectNameIcon.src = EditIcon;
    editProjectNameButton.appendChild(editProjectNameIcon);
    editProjectNameButton.addEventListener('click', () => {
        projectTitle.style.display = "none";
        projectBtns.style.visibility = "hidden";
        projectBtns.setAttribute('disabled', 'true');
        titleInput.style.display = "block";
        titleInput.focus();
        errorSpan.style.display = "block";
        projectDiv.querySelector('.project-edit-buttons').style.display = "flex";
        document.querySelectorAll('.todo-div').forEach(toDoDiv => {
            if(toDoDiv.querySelector('.todo-header').style.display === 'none' && toDoDiv.querySelector('.new-todo-form') === null) {
                toDoDiv.querySelector('.todo-header').style.display = 'flex';
                toDoDiv.querySelector('.todo-collapsed').style.display = 'none';
            }
        });
    });
    projectBtns.appendChild(addTodoButton);
    projectBtns.appendChild(deleteProjectButton);
    projectBtns.appendChild(editProjectNameButton);
    buttonsDiv.appendChild(projectBtns);

    // cancel and save buttons
    const projectEditBtns = document.createElement("div");
    projectEditBtns.setAttribute('class', 'project-edit-buttons');
    const cancelProjectEditButton = document.createElement("button");
    cancelProjectEditButton.setAttribute('class', 'cancel-button');
    cancelProjectEditButton.setAttribute('type', 'button');
    cancelProjectEditButton.textContent = "Cancel";
    cancelProjectEditButton.addEventListener('click', () => {
        projectTitle.style.display = "block";
        projectBtns.style.visibility = "visible";
        projectBtns.removeAttribute('disabled');
        titleInput.style.display = "none";
        errorSpan.style.display = "none";
        projectDiv.querySelector('.project-edit-buttons').style.display = "none";
    });
    const saveProjectButton = document.createElement("button");
    saveProjectButton.setAttribute('class', 'save-button');
    saveProjectButton.setAttribute('type', 'button');
    saveProjectButton.textContent = "Save";
    saveProjectButton.addEventListener('click', () => {
        if (titleInput.value.trim() === "") {
            errorSpan.style.visibility = "visible";
            errorSpan.textContent = "Project name cannot be empty";
        } else if (titleInput.value.trim() === project.projectTitle) {
            errorSpan.style.visibility = "visible";
            errorSpan.textContent = "Project name is the same as before";
        } 
        else if (projectList.checkIfProjectExists(titleInput.value.trim())) {
            errorSpan.style.visibility = "visible";
            errorSpan.textContent = "Project name already exists";
        } 
        else {
            project.projectTitle = titleInput.value.trim();
            projectTitle.textContent = project.projectTitle;
            saveLocalProjectList(projectList);
            projectTitle.style.display = "block";
            projectBtns.style.visibility = "visible";
            projectBtns.removeAttribute('disabled');
            titleInput.style.display = "none";
            errorSpan.style.display = "none";
            errorSpan.style.visibility = "hidden";
            projectDiv.querySelector('.project-edit-buttons').style.display = "none";
            projectDiv.setAttribute('id', convertToId(project.projectTitle));
            projectDiv.querySelectorAll('.todo-div').forEach(todo => {
                todo.dataset.project = convertToId(project.projectTitle);
            });
        }
    });
    projectEditBtns.appendChild(cancelProjectEditButton);
    projectEditBtns.appendChild(saveProjectButton);
    buttonsDiv.appendChild(projectEditBtns);
    projectHeader.appendChild(buttonsDiv);
    
     // display all todos in project
     const toDoListDiv = document.createElement("div");
     toDoListDiv.setAttribute('class', 'todo-list-div');
     const toDoList = project.toDoList;
     toDoList.forEach(toDoItem => {
         toDoListDiv.appendChild(displayToDo(projectList, project, toDoItem));
     });

    projectDiv.appendChild(projectHeader);
    projectDiv.appendChild(toDoListDiv);

    return projectDiv;
}

// main page module (contains all other modules)
function mainPage() {
    const localProjectList = getLocalProjectList();
    const body = document.querySelector("body");

    // header
    const header = document.createElement("header");
    // main header and credits
    const headerTextDiv = document.createElement("div");
    const headerText = document.createElement("h1");
    headerText.textContent = "ToDo Lists";
    const credits = document.createElement("p");
    credits.appendChild(document.createTextNode("Made by "));
    const creditsLink1 = document.createElement("a");
    creditsLink1.setAttribute('href', 'https://github.com/adiferrer');
    creditsLink1.setAttribute('target', '_blank');
    creditsLink1.textContent = "Jeanne Ferrer";
    credits.appendChild(creditsLink1);
    credits.appendChild(document.createTextNode(" for "));
    const creditsLink2 = document.createElement("a");
    creditsLink2.setAttribute('href', 'https://www.theodinproject.com/lessons/node-path-javascript-todo-list');
    creditsLink2.setAttribute('target', '_blank');
    creditsLink2.textContent = "The Odin Project";
    credits.appendChild(creditsLink2);
    headerTextDiv.appendChild(headerText);
    headerTextDiv.appendChild(credits);
    // add project button div
    const addProjectButtonDiv = document.createElement("div");
    const addProjectButton = document.createElement("button");
    addProjectButton.setAttribute('id', 'add-project-button');
    addProjectButton.setAttribute('class', 'add-button');
    addProjectButton.setAttribute('type', 'button');
    const addProjectIcon = new Image();
    addProjectIcon.src = AddIcon;
    addProjectIcon.setAttribute('class', 'add-icon');
    addProjectButton.appendChild(addProjectIcon);
    addProjectButton.addEventListener('click', () => {
        const newProject = Project(" ");
        const newProjectDiv = displayProject(localProjectList, newProject);
        document.querySelector("#project-list-div").appendChild(newProjectDiv);
        document.querySelector("#blank-div").style.display = "none";
        newProjectDiv.querySelector(".project-header").style.display = "none";
        
        const newProjectForm = document.createElement("form");
        newProjectForm.setAttribute('class', 'new-project-form');
        const newInput = document.createElement("input");
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('placeholder', 'New Project Name');
        const btnsAndErrorDiv = document.createElement("div");
        const newProjectErrorSpan = document.createElement("span");
        newProjectErrorSpan.setAttribute('class', 'error-span');
        newProjectErrorSpan.style.visibility = "hidden";
        newProjectErrorSpan.textContent = "Error span";
        const newProjectEditBtns = document.createElement("div");
        const newProjectSaveButton = document.createElement("button");
        newProjectSaveButton.setAttribute('type', 'submit');
        newProjectSaveButton.textContent = "Add";
        newProjectSaveButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (newInput.value.trim() === "") {
                newProjectErrorSpan.style.visibility = "visible";
                newProjectErrorSpan.textContent = "Project name cannot be empty";
            } else if (localProjectList.checkIfProjectExists(newInput.value.trim())) {
                newProjectErrorSpan.style.visibility = "visible";
                newProjectErrorSpan.textContent = "Project name already exists";
            } else {
                newProject.projectTitle = newInput.value.trim();
                newProjectDiv.querySelector("h2").textContent = newProject.projectTitle;
                newProjectDiv.querySelector(".project-header").style.display = "flex";
                newProjectDiv.setAttribute('id', convertToId(newProject.projectTitle));
                localProjectList.addProject(newProject);
                saveLocalProjectList(localProjectList);
                addProjectButtonDiv.style.visibility = "visible";
                addProjectButton.removeAttribute('disabled');
                newProjectForm.remove();
            }
        });
        const newProjectCancelButton = document.createElement("button");
        newProjectCancelButton.setAttribute('type', 'button');
        newProjectCancelButton.textContent = "Cancel";
        newProjectCancelButton.addEventListener('click', () => {
            addProjectButtonDiv.style.visibility = "visible";
            addProjectButton.removeAttribute('disabled');
            newProjectDiv.remove();
            if (localProjectList.projectList.length === 0) {
                document.querySelector("#blank-div").style.display = "block";
            }
        });
        newProjectEditBtns.appendChild(newProjectCancelButton);
        newProjectEditBtns.appendChild(newProjectSaveButton);
        btnsAndErrorDiv.appendChild(newProjectErrorSpan);
        btnsAndErrorDiv.appendChild(newProjectEditBtns);
        newProjectForm.appendChild(newInput);
        newProjectForm.appendChild(btnsAndErrorDiv);
        newProjectDiv.appendChild(newProjectForm);
        newInput.focus();
        addProjectButton.setAttribute('disabled', 'true');
        addProjectButtonDiv.style.visibility = "hidden";
    });
    const addProjectText = document.createElement("span");
    addProjectText.textContent = "Add Project";
    addProjectButtonDiv.appendChild(addProjectButton);
    addProjectButtonDiv.appendChild(addProjectText);
    header.appendChild(headerTextDiv);
    header.appendChild(addProjectButtonDiv);
    body.appendChild(header);

    // main content
    const main = document.createElement("main");
    // window.addEventListener('resize', () => {
    //     const projectDivs = document.querySelectorAll(".project");
    //     if (window.innerWidth < 801) {
    //         projectDivs.forEach(projectDiv => {
    //             const projectToDoDivs = projectDiv.querySelectorAll(".todo-list-div");
    //             projectDiv.querySelector('.todo-list-div').style.display = "none";
    //             projectDiv.querySelector(".project-buttons").style.display = "none";
    //         });
    //     } else {
    //         projectDivs.forEach(projectDiv => {
    //             projectDiv.querySelector(".project-buttons").style.display = "flex";
    //             projectDiv.querySelector(".todo-list-div").style.display = "flex";
    //         });
    //     }
    // });
    // view all projects
    const projectListDiv = document.createElement("div");
    projectListDiv.setAttribute('id', 'project-list-div');
    localProjectList.projectList.forEach(project => {
        projectListDiv.appendChild(displayProject(localProjectList, project));
    });
    main.appendChild(projectListDiv);

    const blankDiv = document.createElement("div");
    blankDiv.setAttribute('id', 'blank-div');
    const blankText = document.createElement("p");
    blankText.textContent = "Nothing to do yet. Add a project to get started!";
    blankDiv.appendChild(blankText);
    main.appendChild(blankDiv);
    if (localProjectList.projectList.length <= 0) {
        blankDiv.style.display = "block";
    }
    
    body.appendChild(main);
}

mainPage();