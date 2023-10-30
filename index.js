import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Arrays to track task and completion status
var dailyTasks = [];
var workTasks = [];

var dailyTasksCompletedStatus = [];
var workTasksCompletedStatus = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // add client data to body of req
app.use(express.static("public"));

// Handlers
app.get("/", (req, res) => {
  res.render("index.ejs", {renderType: "daily", toDoItems: dailyTasks, completionStatus: dailyTasksCompletedStatus});
});

app.get("/work", (req, res) => {
    res.render("index.ejs", {renderType: "work", toDoItems: workTasks, completionStatus: workTasksCompletedStatus}); // Nothing is passed yet
  });

function handleTaskAddition(task, tasks, tasksCompletedStatus) {

      // CHECK FORM SUBMISSION for user adding a task by 'typing and pressing Enter'
    if (task) {
        tasks.push(task);
        tasksCompletedStatus.push(0);

        // console.log("Added Item");
        // console.log(tasks);
        // console.log(tasksCompletedStatus); 
    }
}

function handleTaskStatusChange(checkTask, tasksCompletedStatus) {

    /* NOTE: There will be 2 LARGER SCENARIOS for FORM SUBMISSION based on a task being checked or unchecked in the Form.
       Based on these scenarios tasksCompletedStatus will need to be set.

      1) checkTask IS empty or undefined: This will happen if ONLY one item was checked and then it was unchecked. Setting
         tasksCompletedStatus.fill(0,0) takes care of this.
      2) checkTask is NOT empty or undefined: Again, we will set tasksCompletedStatus.fill(0,0) to changed all status to 0 (unchecked) 
         and update it based on what we have in checkTask. There are 2 SUB-SCENARIOS -
         (a) Only 1 item is checked: checkTask is just a string showing the index of the checked item, hence the corresponding index of dailyTasksCompletedStatus array
             needs to be updated with a 1 (1 for checked).
         (b) More than 1 item is checked: checkTask is an array of strings showing the indeces of the checked items, hence the corresponding indeces of dailyTasksCompletedStatus array
             need to be updated with a 1 (1 for checked).
    */

    // Let's first RESET dailyTasksCompletedStatus array with 0s starting from position 0
    tasksCompletedStatus.fill(0,0);
     
    if (checkTask) {

      // If an array of checkTask strings was sent    
      if (Array.isArray((checkTask))) {
        var checkedIndexesArray = checkTask;

        for (var i = 0; i < checkedIndexesArray.length; i++) {
          tasksCompletedStatus[parseInt(checkedIndexesArray[i])] = 1; // get index of checkbox and set completion status to 1
        }

      } 
      // If ONLY 1 checkTask string was sent, not array
      else 
      {
        tasksCompletedStatus[parseInt(checkTask)] = 1; 
      }

      // console.log("Checked Item");
      // console.log(tasksCompletedStatus); 

   } //if checkTask is not empty or undefined
}

app.post("/updateDailyItems", (req, res) => {

    // Handle Form Submission for added task
    handleTaskAddition(req.body["todoItem"], dailyTasks, dailyTasksCompletedStatus);

    // Handle Form Submission for changed checkbox status (checked or unchecked)
    handleTaskStatusChange(req.body["checkTask"], dailyTasksCompletedStatus);

    res.render("index.ejs", {renderType: "daily", toDoItems: dailyTasks, completionStatus: dailyTasksCompletedStatus}); 
});


app.post("/updateWorkItems", (req, res) => {
    
    // Handle Form Submission for added task
    handleTaskAddition(req.body["todoItem"], workTasks, workTasksCompletedStatus);

    // Handle Form Submission for changed checkbox status (checked or unchecked)
    handleTaskStatusChange(req.body["checkTask"], workTasksCompletedStatus);
    
    res.render("index.ejs", {renderType: "work", toDoItems: workTasks, completionStatus: workTasksCompletedStatus});
  });


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
