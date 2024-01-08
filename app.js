import Express from "express";
import { assignments } from "./data/assignments.js";

const app = Express();
const port = 4001;

let assignmentsMockData = assignments;

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request, limit must not exeeds 10 assignments",
    });
  }
  // กำหนดให้แสดงข้อมูลถึงแค่ limit
  const assignmentsLimit = assignmentsMockData.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsLimit,
  });
});

app.get("/assignments/:assignmentsId", (req, res) => {
  // สร้างตัวแปรให้รับค่าเป็นตัวเลข
  let assignmentsIdClient = Number(req.params.assignmentsId);
  // จากนั้นสร้างตัวแปรมารับค่ากรองข้อมูลที่ client จะขอดูเป็น id
  let assignmentsData = assignmentsMockData.filter(
    (item) => item.id === assignmentsIdClient
  );
  // จะส่งข้อมูลกลับไปตาม index
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsData[0],
  });
});

app.post("/assignments", (req, res) => {
  assignmentsMockData.push({
    id: assignmentsMockData[assignmentsMockData.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentsMockData,
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdClient = Number(req.params.assignmentsId);
  // มีค่า = จำนวน id ที่ถูกลบออกไป
  const newAssignment = assignmentsMockData.filter((item) => {
    return item.id !== assignmentsIdClient;
  });

  //   return res.json({
  //     message: `Assignment Id : ${
  //       assignmentsMockData.length + 1
  //     } has been deleted successfully`,
  //   });

  assignmentsMockData.length === newAssignment.length
    ? res.json({
        message: "Cannot delete, No data available!",
      })
    : res.json({
        message: `Assignment Id : ${assignmentsIdClient} has been deleted successfully`,
      });
  assignmentsMockData = newAssignment;
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdClient = Number(req.params.assignmentsId);
  const assignmentIndex = assignmentsMockData.findIndex((item) => {
    return item.id === assignmentsIdClient;
  });

  if (assignmentIndex === -1) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }

  assignmentsMockData[assignmentIndex] = {
    id: assignmentsIdClient,
    ...req.body,
  };

  return res.json({
    message: `Assignment Id : ${assignmentsIdClient}  has been updated successfully`,
    data: assignmentsMockData[assignmentIndex],
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
