
require("dotenv").config();
const express = require("express");
const con = require("./config");
const app = express();
var session = require("express-session");
const auth = require("./middleware/auth");
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  requireTLS: true,
  auth: {
    user: "Your email", // generated ethereal user
    pass: "Your email password", // generated ethereal password
  },
});
async function mail(email, link) {
  let mailinfo = await transporter.sendMail({
    from: "monudixit0007@gmail.com", // sender address
    to: email, // list of receivers
    subject: "PASSWORD RESET", // Subject line
    text: "click link to reset password", // plain text body
    html: ` <P>Click link to reset your password</P>
   <a href='${link}'>Click</a>`, // html body
  });

  transporter.sendMail(mailinfo, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
    }
  });
}

const path = require("path");
const bcrypt = require("bcryptjs");
const pathname = path.join(__dirname, "views");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const port = process.env.PORT || 7000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const mineextension = {
      "image/jpeg": ".jpeg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
    };
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const profileimagestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profile_images");
  },
  filename: function (req, file, cb) {
    const mineextension = {
      "image/jpeg": ".jpeg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
    };
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
const profileimageupload = multer({ storage: profileimagestorage });

app.use(
  session({
    secret: "secreatkey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3000000 },
  })
);
sessioncheck = (req, res, next) => {
  if (!req.session.user) {
    res.render("login");
  } else {
    next();
  }
};
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/sql", (req, res) => {
  con.query("select * from users", (err, result) => {
    if (!err) {
      res.send(result);
    }
  });
});
app.post("/home", (req, res) => {
  console.log(req.body.filteremail);
  if (req.session.user != null) {

    con.query(
      `select * from users `,
      (err, result, next) => {
        if (!err) {
          let alluser = result;
          con.query(
            `select * from users where email = '${req.body.filteremail}' `,
            (err, result, next) => {
              if (!err) {
                
                var allusers = result;
                con.query(
                  `select * from notification,users where notification.reciever  = '${req.session.userid}' and users.cust_id = notification.sender `,
                  (err, result, next) => {
                    if (!err) {
                      let notification = result;
                      // query for fetching connections
                      con.query(
                        `select * from connections,users where connections.user1  = '${req.session.userid}' and users.cust_id = connections.user2 `,
                        (err, result, next) => {
                          if (!err) {
                            let connection= result
                            con.query(
                              `select * from notification,users where notification.sender  = '${req.session.userid}' and users.cust_id = notification.reciever `,
                              (err, result, next) => {
                                if (!err) {
                                  let pending = result
                            
                                  const user = {
                                    email: req.session.user,
                                    name: req.session.username,
                                    login: true,
                                    alluser: alluser,
                                    allusers1: allusers,
                                    notification: notification,
                                    connection:connection,
                                    pending:pending,
                                    userid:req.session.userid
                                  };
                                
                                  res.render("index", { user });
                                  
                                }
                              else{
                                res.send(err)
                              }})


                            
                            
                          } else {
                            res.send(err);
                          }
                        }
                      );
                    } else {
                      res.send("error in fetching notification");
                    }
                  }
                );
              } else {
                console.log("failed");
              }
            }
          );
        } else {
          console.log("erroecdajsciaca.............");
        }
      }
    );
  } else {
    con.query(
      `select * from users where email  = '${req.body.filteremail}' `,
      (err, result, next) => {
        if (!err) {
          var alluser = result;

          const user = {
            email: "You are not logged in",
            login: false,
            alluser: alluser,
          };
          res.render("index", { user });
        } else {
          console.log("failed");
        }
      }
    );
  }
});
app.get("/addnotification", (req, res) => {
  console.log(req.query);
  con.query("select count(id) as a from notification ", (err, result, next) => {
    if (!err) {
      if (result[0].a > 0) {
        con.query(
          `select id as a from notification order by id desc limit 1 `,
          (err, result, next) => {
            if (!err) {
              let id = result[0].a + 1;
              let dob = new Date();
              let date = dob.getDate();
              let month = dob.getMonth();
              let year = dob.getFullYear();
              let date1 = `${year}-${month}-${date}`;
              let data = [id, req.query.sender, req.query.reciever, date1];
              con.query(
                `insert into notification set id = ? , sender = ? , reciever = ? , time = ? `,
                data,
                (err, result, next) => {
                  if (!err) {
                    res.redirect("/home");
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.send(err);
            }
          }
        );
      } else {
        let id = "1";
        let dob = new Date();
        let date = dob.getDate();
        let month = dob.getMonth();
        let year = dob.getFullYear();
        let date1 = `${year}-${month}-${date}`;
        let data = [id, req.query.sender, req.query.reciever, date1];
        con.query(
          `insert into notification set id = ? , sender = ? , reciever = ? , time = ? `,
          data,
          (err, result, next) => {
            if (!err) {
              res.redirect("/home");
            } else {
              res.send(err);
            }
          }
        );
      }
    }
  });
});
app.get("/home", (req, res) => {
  console.log(req.body.filteremail);
  if (req.session.user != null) {
    
    con.query(
      `select * from users `,
      (err, result, next) => {
        if (!err) {
          let alluser = result;
          con.query(`select DISTINCT email,fName,lName,cust_id,image from connections,users where email not in (select email from connections,users where connections.user1  = '${req.session.userid}' and users.cust_id = connections.user2) `, (err, result, next) => {
            if (!err) {
              console.log(result)
              var allusers = result;

              con.query(
                `select * from notification,users where notification.reciever  = '${req.session.userid}' and users.cust_id = notification.sender `,
                (err, result, next) => {
                  if (!err) {
                    let notification = result;
                    con.query(
                      `select * from connections,users where connections.user1  = '${req.session.userid}' and users.cust_id = connections.user2 `,
                      (err, result, next) => {
                        if (!err) {
                          
                             
                          let connection= result
                          con.query(
                            `select * from notification,users where notification.sender  = '${req.session.userid}' and users.cust_id = notification.reciever `,
                            (err, result, next) => {
                              if (!err) {
                                let pending = result
                                
                                const user = {
                                  email: req.session.user,
                                  name: req.session.username,
                                  login: true,
                                  alluser: alluser,
                                  allusers1: allusers,
                                  notification: notification,
                                  connection:connection,
                                  pending:pending,
                                  userid:req.session.userid
                                };
                               
                                res.render("index", { user });
                                
                              }
                            else{
                              res.send(err)
                            }})

                        }
                      else{
                        res.send(err)
                      }})

                   
                  } else {
                    res.send("error in fetching notification");
                  }
                }
              );
            } else {
              console.log("failed",err);
            }
          });
        } else {
          console.log("erroecdajsciaca.............");
        }
      }
    );
  } else {
    con.query(`select * from users `, (err, result, next) => {
      if (!err) {
        var alluser = result;

        const user = {
          email: "You are not logged in",
          login: false,
          alluser: alluser,
        };
        res.render("index", { user });
      } else {
        console.log("failed");
      }
    });
  }
});
app.get("/shared", auth, (req, res) => {
   
  if(req.session.user!=null){

  
  con.query(`select * from users u,shareddoc s,doc d where ( s.user_id = u.cust_id or s.owner_id = u.cust_id ) and d.doc_id = s.doc_id ;`, (err, result, next) => {
    if (!err) {
      var sharedlist = result;

      const data = {
        user:req.session.user,
        userid:req.session.userid,
        sharedlist: sharedlist,
      };
      res.render("shared", { data });
    } else {
      console.log("failed");
    }
  });

}
else{
  res.redirect('/')
}


  
});
app.get("/", (req, res) => {
  res.render(`login`);
});
app.get("/logout", async (req, res) => {
  req.session.login = false;
  req.session.destroy();
  res.clearCookie("jwt");

  res.redirect("/home");
});
app.get("/signin", (req, res) => {
  res.render(`signin`);
});
app.get("/notes", async (req, res) => {
  con.query(
    `select * from note,cust_note,users where note.note_id = cust_note.note_id and cust_note.cust_id = users.cust_id and users.email  = '${req.session.user}' `,
    (err, result, next) => {
      if (!err) {
        if (req.session.user != null) {
          const user = {
            email: req.session.user,
            name: req.session.username,
            notes: result,
            message: "Please add some notes",
            login: true,
          };
          res.render("notes", { user });
        } else {
          const user = {
            email: "You are not logged in",
            message: "Login again..",
            notes: [],
            login: false,
          };
          res.render("notes", { user });
        }
      } else {
        console.log(err);
      }
    }
  );
});
app.get("/documents", async (req, res) => {
  con.query(
    `select * from doc,cust_doc,users where doc.doc_id = cust_doc.doc_id and cust_doc.cust_id = users.cust_id and users.email  = '${req.session.user}' `,
    (err, result, next) => {
      if (!err) {
        const docs = result
        if (req.session.user != null) {
         


          con.query(
            `select * from connections,users where connections.user1  = '${req.session.userid}' and users.cust_id = connections.user2 `,
            (err, result, next) => {
              if (!err) {
                let connection= result
                const user = {
                  id:req.session.userid,
                  email: req.session.user,
                  name: req.session.username,
                  docs: docs,
                  message: "Please add some docs",
                  login: true,
                  connection:connection
                };
                   
                
                res.render("documments", { user });

              }
            else{
              res.send(err)
            }})



          // res.render("documments", { user });
        } 
        else {
          const user = {
            email: "You are not logged in",
            message: "Login again..",
            docs: [],
            login: false,
          };


          res.render("documments", { user });
        }
      } else {
        console.log(err);
      }
    }
  );
});
// app.use(express.static('public'));
app.use("/uploads", express.static("uploads"));
app.get("/fetchdoc", async (req, res) => {
  console.log(req.query);
  const file = { filename: req.query.name, filepath: req.query.pathname };

  res.render("showfile", { file });
});

app.post("/registration", async (req, res) => {
  con.query("select count(cust_id) as a from users ", (err, result, next) => {
    if (!err) {
      if (result[0].a > 0) {
        con.query(
          `select count(cust_id) as a from users where email = '${req.body.email}' `,
          (err, result, next) => {
            if (!err) {
              const same_user = result[0].a;
              if (same_user == 0) {
                const password = bcrypt.hashSync(req.body.password1, 10);
                const token = jwt.sign(
                  { _id: req.body.email },
                  process.env.SECREAT_KEY
                );
                res.cookie("jwt", token, {
                  expires: new Date(Date.now() + 30000000),
                  httpOnly: true,
                });
                con.query(
                  "select cust_id from users order by cust_id desc limit 1 ",
                  (err, result, next) => {
                    if (!err) {
                      const _id = result[0].cust_id + 1;

                      const data = [
                        _id,
                        req.body.fName,
                        req.body.lName,
                        req.body.phno,
                        req.body.email,
                        req.body.dob,
                        req.body.city,
                        req.body.state,
                        req.body.locality,
                        req.body.street,
                        password,
                        token,
                      ];

                      con.query(
                        "INSERT INTO users set cust_id =  ?, fName = ?, lName = ?, phno = ?, email = ?, dob = ?, city = ? , state = ? , locality = ? , street = ? , password = ? , token = ? , image='' ",
                        data,
                        (err, result, feilds) => {
                          if (!err) {
                            res.render("signin");
                          } else {
                            console.log(err);
                            res.render("signin");
                          }
                        }
                      );
                    } else {
                      console("error in findin next id..");
                    }
                  }
                );
              } else {
                res.send("email  already exist ! ");
              }
            } else {
              console.log(err);
              res.send(err);
            }
          }
        );
      } else {
        const password = bcrypt.hashSync(req.body.password1, 10);
        const token = jwt.sign(
          { _id: req.body.email },
          process.env.SECREAT_KEY
        );
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 30000000),
          httpOnly: true,
        });

        const data = [
          0,
          req.body.fName,
          req.body.lName,
          req.body.phno,
          req.body.email,
          req.body.dob,
          req.body.city,
          req.body.state,
          req.body.locality,
          req.body.street,
          password,
          token,
        ];

        con.query(
          "INSERT INTO users set cust_id =  ?, fName = ?, lName = ?, phno = ?, email = ?, dob = ?, city = ? , state = ? , locality = ? , street = ? , password = ? , token = ? , image = ''   ",
          data,
          (err, result, feilds) => {
            if (!err) {
              res.redirect("/");
            } else {
              console.log(err);
              res.render("signin");
            }
          }
        );
      }
    } else {
      console.log(err);
      res.redirect("/signin");
    }
  });
});
app.post("/adddoc", upload.single("document"), async (req, res) => {
  // console.log(req.file.path);

  let dob = new Date();
  let date = dob.getDate();
  let month = dob.getMonth();
  let year = dob.getFullYear();
  let date1 = `${year}-${month}-${date}`;
  con.query("select count(doc_id) as a from doc  ", (err, result, next) => {
    if (!err) {
      if (result[0].a != 0) {
        con.query(
          "select doc_id from doc order by doc_id desc limit 1 ",
          (err, result, next) => {
            if (!err) {
              var _id = result[0].doc_id + 1;
              const data = [
                _id,
                req.body.name,
                req.body.remark,
                req.file.path,
                date1,
              ];
              const data2 = [_id, req.session.userid];

              con.query(
                "INSERT INTO doc set doc_id = ? , name = ? , remark = ?, path = ? , date_time = ? ",
                data,
                (err, result, feilds) => {
                  if (!err) {
                    con.query(
                      "INSERT INTO cust_doc set doc_id = ? , cust_id = ? ",
                      data2,
                      (err, result, feilds) => {
                        if (!err) {
                          res.redirect("/documents");
                        } else {
                          res.send(err);
                        }
                      }
                    );
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.send(err);
            }
          }
        );
      } else {
        var _id = 0;
        const data = [
          _id,
          req.body.name,
          req.body.remark,
          req.file.path,
          date1,
        ];
        const data2 = [_id, req.session.userid];
        con.query(
          "INSERT INTO doc set doc_id = ? , name = ? , remark = ?, path = ? , date_time = ? ",
          data,
          (err, result, feilds) => {
            if (!err) {
              con.query(
                "INSERT INTO cust_doc set doc_id = ? , cust_id = ? ",
                data2,
                (err, result, feilds) => {
                  if (!err) {
                    res.redirect("/documents");
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.send(err);
            }
          }
        );
      }
    }
  });
});
app.post("/addnote", async (req, res) => {
  let dob = new Date();
  let date = dob.getDate();
  let month = dob.getMonth();
  let year = dob.getFullYear();
  let date1 = `${year}-${month}-${date}`;

  con.query("select count(note_id) as a from note ", (err, result, next) => {
    if (!err) {
      if (result[0].a != 0) {
        con.query(
          "select note_id from note order by note_id desc limit 1 ",
          (err, result, next) => {
            if (!err) {
              var _id = result[0].note_id + 1;
              const data = [
                _id,
                req.body.title,
                req.body.description,
                req.body.tag,
                req.body.name,
                date1,
              ];
              const data2 = [_id, req.session.userid];

              con.query(
                "INSERT INTO note set note_id = ? , title = ? , description = ?, tag = ? , name = ? , date_time = ? ",
                data,
                (err, result, feilds) => {
                  if (!err) {
                    con.query(
                      "INSERT INTO cust_note set note_id = ? , cust_id = ? ",
                      data2,
                      (err, result, feilds) => {
                        if (!err) {
                          res.redirect("/notes");
                        } else {
                          console.log(err);
                          res.send("can not add in cust_note ");
                        }
                      }
                    );
                  } else {
                    console.log(err);
                    res.send("can not add in note");
                  }
                }
              );
            } else {
              console.log(err);
              res.send("error in finding id");
            }
          }
        );
      } else {
        var _id = 0;
        const data = [
          _id,
          req.body.title,
          req.body.description,
          req.body.tag,
          req.body.name,
          date1,
        ];
        const data2 = [_id, req.session.userid];

        con.query(
          "INSERT INTO note set note_id = ? , title = ? , description = ?, tag = ? , name = ? , date_time = ? ",
          data,
          (err, result, feilds) => {
            if (!err) {
              con.query(
                "INSERT INTO cust_note set note_id = ? , cust_id = ? ",
                data2,
                (err, result, feilds) => {
                  if (!err) {
                    res.redirect("/notes");
                  } else {
                    console.log(err);
                    res.send("can not add in cust_note ");
                  }
                }
              );
            } else {
              console.log(err);
              res.send("can not add in note");
            }
          }
        );
      }
    }
  });
});
app.post("/login", async (req, res) => {
  const token = jwt.sign({ _id: req.body.email }, process.env.SECREAT_KEY);
  let temptoken = "";

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 30000000),
    httpOnly: true,
    // secure:true
  });

  con.query("select * from users", (err, result) => {
    if (!err) {
      let temppass = ""
      let email = req.body.email
      let pass = req.body.password
      result.forEach((item) => {
        console.log(item.email,email)
        if(item.email==email){
          console.log("email matched")
        }
        if (item.token==token){
          console.log("token matched")
        }
        if (item.email == email || item.token == token) {
          console.log("matched");
          temppass = item.password;
          temptoken = item.token;
          req.session.login = true;
          req.session.username = item.fName;
          req.session.userid = item.cust_id;
        }

      });
      const passwordmatch = bcrypt.compareSync(pass, temppass);
      console.log('pass match passed',passwordmatch)
      if (passwordmatch == true || temptoken == token) {
        req.session.user = req.body.email;

        const user = { email: req.session.user };
        console.log('home')
        res.redirect("/home");
      } else {
        res.render("login");
      }
    } else {
      console.log("error aa rha h >>.");
    }
  });
});
app.get("/test", (req, res) => {
  res.send("working");
});
// res.send(`${pathname}/index.html`)
app.get("/deletenote", (req, res) => {
  console.log(req.query.docid);
  con.query(
    `delete from note where note_id = '${req.query.noteid}' `,
    (err, result) => {
      if (!err) {
        res.redirect("/notes");
      } else {
        console.log(err);
        res.send("can not delete note");
      }
    }
  );
});
app.get("/deletedoc", (req, res) => {
  // console.log(req.query.docid);
  con.query(
    `delete from doc where doc_id = '${req.query.docid}' `,
    (err, result) => {
      if (!err) {
        res.redirect("/documents");
      } else {
        console.log(err);
        req.send("can not delete document");
      }
    }
  );
});
app.post("/updatenote", (req, res) => {
  const data = [
    req.body.title,
    req.body.description,
    req.body.tag,
    req.body.name,
  ];

  con.query(
    `update  note set  title = ? , description = ?, tag = ? , name = ? where note_id =  '${req.query.noteid}' `,
    data,
    (err, result, feilds) => {
      if (!err) {
        res.redirect("/notes");
      } else {
        console.log(err);
        res.send("can not update in note");
      }
    }
  );
});
app.post("/changepassword", auth, (req, res) => {
  const id = req.query.custid;

  const password = bcrypt.hashSync(req.body.password, 10);
  con.query(
    `update users set password =  '${password}' where cust_id = '${id}' `,

    (err, result, feilds) => {
      if (!err) {
        res.clearCookie("jwt");
        req.session.destroy();

        res.redirect("/");
      } else {
        res.send("can not change password");
      }
    }
  );
});
app.post(
  "/changeprofileimage",
  profileimageupload.single("profileimage"),
  (req, res) => {
    const id = req.query.custid;
    // console.log(req.file);

    con.query(
      `update users set image =  '${req.file.filename}' where cust_id = '${id}' `,

      (err, result, feilds) => {
        if (!err) {
          res.redirect("/home");
        } else {
          res.send("can not change profile picture");
        }
      }
    );
  }
);
app.get("/forgot-password", (req, res) => {
  let msg = {
    mailsent: false,
    message: "",
  };

  res.render("forgotpassword", { msg });
});
app.post("/forgot-password", (req, res) => {
  con.query(
    `select * from users where email = '${req.body.email}' `,

    (err, result, feilds) => {
      if (!err) {
        if (Object.keys(result).length == 0) {
          let msg = {
            mailsent: true,
            message: "Email id not registered",
          };
          res.render("forgotpassword", { msg });
        } else {
          const secreat = process.env.SECREAT_KEY + result[0].password;
          const payload = {
            email: result[0].email,
            id: result[0].cust_id,
          };
          const token = jwt.sign(payload, secreat, { expiresIn: "15m" });
          const link = `http://localhost:8000/reset-password/${result[0].cust_id}/${token}`;
          mail(result[0].email, link);
          let msg = {
            mailsent: true,
            message: "Please check your email, mail has been sent seccessfully",
          };

          res.render("forgotpassword", { msg });
        }
      } else {
        res.send(err);
      }
    }
  );
});
app.get("/reset-password/:id/:token", (req, res, next) => {
  const id = req.params.id;
  const token = req.params.token;
  con.query(
    `select * from users where cust_id = '${id}' `,

    (err, result, feilds) => {
      if (!err) {
        const secreat = process.env.SECREAT_KEY + result[0].password;
        try {
          const obj = {
            id: id,
            token: token,
          };
          const payload = jwt.verify(token, secreat);
          res.render("resetpassword", { obj });
        } catch (error) {}
      }
    }
  );
});
app.post("/reset-password/:id/:token", (req, res) => {
  const id = req.params.id;

  const password1 = req.body.password;
  const password = bcrypt.hashSync(req.body.password1, 10);
  con.query(
    `update users set password = '${password}' where cust_id = '${id}' `,

    (err, result, feilds) => {
      if (!err) {
        res.send("password reset successfully");
      } else {
        res.send(err);
      }
    }
  );
});
app.get("/requestaccept", (req, res) => {
  // console.log(req.query);
  con.query(
    `insert into connections set user1 = '${req.query.sender}' , user2 = '${req.query.reciever}' `,

    (err, result, feilds) => {
      if (!err) {
        con.query(
          `insert into connections set user1 = '${req.query.reciever}' , user2 = '${req.query.sender}' `,

          (err, result, feilds) => {
            if (!err) {
              con.query(
                `delete  from notification where sender = '${req.query.sender}' and  reciever = '${req.query.reciever}' `,

                (err, result, feilds) => {
                  if (!err) {
                    res.redirect("/home");
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.send(err);
            }
          }
        );
      } else {
        res.send(err);
      }
    }
  );
});

app.post('/sharedoc',  (req,res)=>{
  console.log(req.body)
  let time = Date.now()
  let iserr = false
  let er = null
  for (let i =0;i<req.body.list.length;i++){
  console.log('inside list')
  
  con.query(
    `insert into shareddoc set user_id = ${Number(req.body.list[i])},   doc_id =   ${Number(req.body.document_id)} , owner_id =   ${Number(req.body.owner)}  `,

    (err, result, feilds) => {
      console.log(err,result)
      if (err) {
        iserr = true
        er = err
        
      } 
    }
  )
  }
  if (iserr===true){
    console.log('there is an error',er)
    res.send({message:'error'})
  }
  else{
    console.log('no error')
    res.redirect('/documents')
  }
  
})

app.listen(port, () => {
  console.log(`app is running on port : ${port}`);
});

