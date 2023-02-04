export default () => {
    let _projectList = [];

    return {
        get projectList() {
            return _projectList;
        },
        set projectList(list) {
            _projectList = list;
        },
        addProject(list) {
            _projectList.push(list);
        },
        deleteProject(name) {
            for(let i = 0; i < _projectList.length; i++) {
                if(_projectList[i].projectTitle === name) {
                    _projectList.splice(i, 1);
                    break;
                }
            }
        },
        checkIfProjectExists(listName) {
            for(let i = 0; i < _projectList.length; i++) {
                if(_projectList[i].projectTitle.toLowerCase() === listName.toLowerCase()) {
                    return true;
                }
            }
    
            return false;
        },
        getProject (listName) {
            for(let i = 0; i < _projectList.length; i++) {
                if(_projectList[i].projectTitle === listName) {
                    return _projectList[i];
                }
            }
        }
    };
}