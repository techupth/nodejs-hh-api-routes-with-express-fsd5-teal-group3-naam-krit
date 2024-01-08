import Express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

const app = Express();
const port = 4001;

let assignmentsMockData = assignments;
let commentsMockData = comments;

// ดูข้อมูลทั้งหมด โดยต้องส่ง Query limitมาเป็น Numberไม่เกิน 10 : ใช้ .query
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

// ดูข้อมูลแต่ละอันด้วย :assignmentsId
app.get("/assignments/:assignmentsId", (req, res) => {
  // สร้างตัวแปรให้รับค่าเป็นตัวเลข
  let assignmentsIdClient = Number(req.params.assignmentsId);
  // จากนั้นสร้างตัวแปรมารับค่ากรองข้อมูลที่ client จะขอดูเป็น id
  let assignmentsData = assignmentsMockData.filter(
    (item) => item.id === assignmentsIdClient
  );
  // จะส่งข้อมูล res กลับไปตาม index
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsData[0],
  });
});

// สร้างข้อมูลใหม่ .body คือatrribute/propertyที่มีในก้อน array.object เช่น id , title ,description
app.post("/assignments", (req, res) => {
  /*ให้ assignmentsMockData.push(เพิ่มobjectก้อนใหม่เข้าไปใน id โดยlengthจะต้อง -1 เพื่อเอาobjectก้อนใหม่ไปต่อหลังobjectก่อนหน้า) 
  เพราะเราต้องการสร้างข้อมูลต่อจาก id ล่าสุด แต่id ที่คอยกำกับจะเพิ่มขึ้น เพราะ id:value ที่นับจาก1*/
  assignmentsMockData.push({
    id: assignmentsMockData[assignmentsMockData.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentsMockData,
  });
});

// ลบข้อมูลแต่ละอันด้วย :assignmentsId
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
  // .findIndex ถ้าไม่ตรงตามเงื่อนไขจะ returnกลับเป็นค่า -1
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

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  // แปลง inputเป็น number เพื่อเอาไปเช็คกับ id ที่เป็น numberเหมือนกัน
  let assignmentsIdClient = Number(req.params.assignmentsId);

  /* commentsData มีค่าเท่ากับ commentsMockdata ที่มีvalue assignmentId เท่ากับ assignmentsIdClient
  เช่น ใส่value=1 resจะแสดง key.assignmentId=1 ทั้งหมด*/
  let commentsData = commentsMockData.filter(
    (comment) => comment.assignmentId === assignmentsIdClient
  );
  // ต้องสร้าง if มาดักจับ ไม่งั้นมันจะแสดงผล ไม่หมด
  if (!commentsData.length) {
    return res.json({
      message: `No comments available on Assignment Id : ${assignmentsIdClient}`,
    });
  }

  return res.json({
    message: "Complete fetching comments",
    data: commentsData,
  });
});

/* กรณีที่ ทาง frontend ใส่ body มาไม่ครบ ก็สามารถสร้างเงื่อนไขมาเช็คได้ เช่น 
const {id,title,description} = req.body
if(!reg.body){
    return res.json({
        message: "please complete the input field."
    })
}*/

// เพิ่ม comment เข้าไปในassignmentId นั้นๆ ใช้ ...req.bodyไม่ได้ น่าจะaccessผิด งงๆอยู่
app.post("/assignments/:assignmentsId/comments", (req, res) => {
  //   const { assignmentId, content } = req.body;

  //   commentsMockData.push({
  //     id: commentsMockData[commentsMockData.length - 1].id + 1,
  //     ...req.body,
  //   });

  commentsMockData.push({
    id: commentsMockData[commentsMockData.length - 1].id + 1,
    assignmentId:
      commentsMockData[commentsMockData.length - 1].assignmentId + 1,
    content: commentsMockData[commentsMockData.length - 1].content,
  });

  return res.json({
    message: "New comment has been created successfully",
    data: commentsMockData,
  });

  /* เฉลยของ hh ก็ยังไม่แสดงข้อมูลอยู่ดี
  
  let assignmentsIdClient = Number(req.params.assignmentsId);

  // สร้าง id ใหม่ให้กับ comment
  const newComments = {
    id: commentsMockData[commentsMockData.length - 1].id + 1,
    ...req.body,
  };

  // Validate ก่อนว่ามี Assignment ให้เพิ่ม Comment หรือไม่
  const hasAssignment = commentsMockData.find((item) => {
    return item.id === assignmentsIdClient;
  });

  // ถ้าไม่ก็ให้ Return error response กลับไปหา Client
  if (!hasAssignment) {
    return res.json({
      message: "No assignment to add comments",
    });
  }

  // เพิ่ม commentData ลงใน Mock database
  commentsMockData.push(newComments);

  return res.json({
    message: `New comment of assignment id ${assignmentsIdClient} has been created successfully`,
    data: commentsMockData,
  });*/
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
