# Odin To-Do App
## Instructions
Application will load the projectList saved in your local computer.
1. To add a project, click the '+' icon button on the top right of the screen.
    - A new project window will be added but will require your input of a new project title.
    - If you press 'Cancel', the window will be removed and doesn't affect the current projectList
    - If you press 'Add' and the entered title 1) **is not already taken**, 2) **has 3 or more charactersn** and 3) **is not empty**, the project will be added to the local projectList and will stay on the page until you decide to delete it
2. To edit the project title, click the pencil icon.
    - Click 'Cancel' if you decide to not edit the project title anymore.
    - Click 'Save' if you want to save the new name.
        - There will be an error message if the title 1) **is already taken**, 2) **has less than 3 characters**, and 3) **is the same as the previous name**.
3. To add a to-do item in a project, click the '+' icon on the top right of the project.
    - If another todo item is expanded, it will automatically close and focus on the "form" for the new to do item
    - If you press 'Cancel', the todo item will be removed and doesn't affect the current projectList
    - If you press 'Add ToDo', the todo item will be added to the projectList and the simplified version will show
        - Note: You need to enter something in the Title, Description, Priority and Date inputs to add the new todo successfully    
4. To view a to-do item in a project, click the title of the todo item you want to view.
    - If another todo item is expanded, it will automatically close and focus on the todo item you have clicked
    - You can edit and delete a to do when it is expanded

## Bugs to Fix
- Projects collapse automatically on mobile
- Galaxy Fold CSS
## Features to Add
- Todo projects for Due Today, Due This Week
## Credits
- All icons from <a href="https://feathericons.com/?query=plus" target="_blank">feathericons.com</a>
