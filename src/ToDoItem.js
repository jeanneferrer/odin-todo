export default (title, description, priority, dueDate, dueTime, notes, isComplete) => {
    let _title = title;
    let _description = description;
    let _priority = priority;
    let _dueDate = dueDate;
    let _dueTime = dueTime;
    let _notes = notes;
    let _isComplete = isComplete;
    
    return {
        get title() {
            return _title;
        },
        set title(newTitle) {
            _title = newTitle;
            return this;
        },
        get description() {
            return _description;
        },
        set description(newDescription) {
            _description = newDescription;
            return this;
        },
        get priority() {
            return _priority;
        },
        set priority(newPriority) {
            if (typeof newPriority !== 'string') {
                throw new Error('Invalid priority');
            }
            _priority = newPriority;
            return this;
        },
        get dueDate() {
            return _dueDate;
        },
        set dueDate(newDueDate) {
            _dueDate = newDueDate;
            return this;
        },
        get dueTime() {
            return _dueTime;
        },
        set dueTime(newDueTime) {
            _dueTime = newDueTime;
            return this;
        },
        get notes() {
            return _notes;
        },
        set notes(newNotes) {
            _notes = newNotes;
            return this;
        },
        get isComplete() {
            return _isComplete;
        },
        set isComplete(newIsComplete) {
            _isComplete = newIsComplete;
            return this;
        }
    }
};