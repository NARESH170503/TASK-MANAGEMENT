let globalTaskData = [];
taskContents=document.getElementById("taskContents");

const addCard = () => {
    const newTaskDetails = {
        id :  `${Date.now()}`,
        url: document.getElementById("imageURL").value,//.VALUE IS USED TO GET THE VALUE OF IMAGEURL INSTEAD OF URL
        title: document.getElementById("taskTitle").value,
        type: document.getElementById("taskType").value,
        description: document.getElementById("taskDescription").value,
    };

    taskContents.insertAdjacentHTML('beforeend',generateTaskCard(newTaskDetails));// insertadjacenthtml is used to add the elements into the dom, beforeend is used to add new elements after the parent class eg:sorts accor to time which is first added 
    globalTaskData.push(newTaskDetails);
    saveToLocalStorage();
}


const generateTaskCard = ({id,url,title,type,description}) => { //object destructure
    return(
        `<div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-outline-info"name=${id} onclick="updateTask(this)">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger" name=${id} onclick="deleteTask(this)"> 
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
                    <img src=${url} class="card-img-top" alt="card-image"/>
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">${description}</p>
                        <span class="badge btn-primary">${type}</span>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-outline-primary float-end"  name=${id}>OPEN TASK</button>
                    </div>
                </div>
            </div>   
        </div>`
    ); //deleteTask(this)  'this' is used as window obj 
}

const saveToLocalStorage = () => {
                        //key    ,value
    localStorage.setItem("tasky",JSON.stringify({tasks:  globalTaskData }));//json.stringify is the string format of js(tasks: state.taskList is an object in js)
}

const reloadTaskCard = () => {
    const localStorageCopy = JSON.parse(localStorage.getItem("tasky"));//used to retrive from local storage
    if(localStorageCopy){
        globalTaskData=localStorageCopy["tasks"];
    }
    globalTaskData.map((cardData) => {
        taskContents.insertAdjacentHTML('beforeend',generateTaskCard(cardData)); // insertadjacenthtml is used to add the elements into the dom, beforeend is used to add new elements after the parent class eg:sorts accor to time which is first added 

    })
}

const deleteTask = (e) => { //e is the window event
    console.log(e);//used to return the part of code where the event is occured
    const targetId = e.getAttribute("name");
    console.log(targetId);
    const removeTask = globalTaskData.filter((card) => card.id!=targetId);//compare with line 57
    //the id which is not matched will be saved in removeTask and will update in globalTaskCard and ignores the id which is matched
    globalTaskData = removeTask;
    saveToLocalStorage();
    console.log(globalTaskData);
    window.location.reload();
    
}

const updateTask = (e) => {
    const targetId = e.getAttribute("name");
    saveToLocalStorage();
    console.log(e.parentNode.parentNode.parentNode.childNodes[5].childNodes[1].setAttribute("contenteditable","true"));
    console.log(e.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].setAttribute("contenteditable","true"));
    console.log(e.parentNode.parentNode.parentNode.childNodes[5].childNodes[5].setAttribute("contenteditable","true"));
    // window.location.reload();
    e.parentNode.parentNode.parentNode.childNodes[7].childNodes[1].innerHTML="SAVE CHANGES";
    e.parentNode.parentNode.parentNode.childNodes[5].childNodes[5].setAttribute("onclick","saveEditTask()");
    
}

const saveEditTask = (e) => {
    if(!e) e = window.event;
    const targetId=e.target.id;
    const parentNode=e.target.parentNode.parentNode;
    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const submitbutton = parentNode.childNodes[5].childNodes[1];
    const taskType= parentNode.childNodes[3].childNodes[7].childNodes[1];
    // const updateTask={
    //     taskTitle:taskTitle.innerHTML,
    //     taskDescription:taskDescription.innerHTML,
    //     taskType:taskType.innerHTML,
    // };
    let statecopy = state.taskList;
    statecopy = statecopy.map((task) =>
        task.id ===targetId
        ? {
            id:task.id,
            title:taskTitle.innerHTML,
            description: taskDescription.innerHTML,
            type:taskType.innerHTML,
            url:task.url,
         }
        : task
    );
    state.taskList = statecopy;
    updateLocalStorage();
    taskTitle.setAttribute("contenteditable","false");
    taskDescription.setAttribute("contenteditable","false");
    taskType.setAttribute("contenteditable","false");
    submitbutton.setAttribute("onclick","openTask.apply(this,arguments)");
    submitbutton.setAttribute("data-bs-toggle","modal");
    submitbutton.setAttribute("data-bs-toggle","#showTask");
    submitbutton.innerHTML = "open Task";
}

