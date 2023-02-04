export default (projectTitle) => {
    let _projectTitle = projectTitle;
    let _toDoList = [];

    return {
        get projectTitle() {
            return _projectTitle;
        },
        set projectTitle(newProjectTitle) {
            _projectTitle = newProjectTitle;
            return this;
        },
        get toDoList() {
            return _toDoList;
        },
        set toDoList(newToDoList) {
            _toDoList = newToDoList;
            return this;
        },
        addToDoItem(newToDoItem) {
            _toDoList.push(newToDoItem);
            return this;
        },
        getToDoItem(toDoItemName) {
            for(let i = 0; i < _toDoList.length; i++) {
                if(_toDoList[i].title === toDoItemName) {
                    return _toDoList[i];
                }
            }
        },
        checkIfToDoItemExists(toDoItemName) {
            for(let i = 0; i < _toDoList.length; i++) {
                if(_toDoList[i].title === toDoItemName) {
                    return true;
                }
            }
    
            return false;
        },
        deleteToDoItem(toDoItemName) {
            for(let i = 0; i < _toDoList.length; i++) {
                if(_toDoList[i].title.toLowerCase() === toDoItemName.toLowerCase()) {
                    _toDoList.splice(i, 1);
                    break;
                }
            }
            return this;
        }
    }
}