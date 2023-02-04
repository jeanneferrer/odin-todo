// import _ from 'lodash';
import ProjectList from './ProjectList';
import Project from './Project';
import ToDoItem from './ToDoItem';

function getLocalProjectList() {
    let projects = JSON.parse(localStorage.getItem("projects"));
    if (projects === null) {
        projects = ProjectList();
        projects.addProject(Project("Default Project"));
        projects.getProject("Default Project").addToDoItem(ToDoItem("Default Task", "This is a default task", "High", "2020-01-01", "13:00", "This is a default note"));
    } else {
        projects = Object.assign(ProjectList(), projects);
        for (let i = 0; i < projects.projectList.length; i++) {
            projects.projectList[i] = Object.assign(Project(), projects.projectList[i]);
            for (let j = 0; j < projects.projectList[i].toDoList.length; j++) {
                projects.projectList[i].toDoList[j] = Object.assign(ToDoItem(), projects.projectList[i].toDoList[j]);
            }
        }
    }
    return projects;
}

function saveLocalProjectList(updatedProjects) {
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
}

export { getLocalProjectList, saveLocalProjectList };