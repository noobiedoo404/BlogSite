//as a good practice its better to have a seperate route for api requests
//creating an api to register a new user in database
//userdata is sent to api end point that internally saves the data in db.
const express = require('express');
const md5 = require('md5');
const router = express.Router()
const jwt = require('jsonwebtoken');
const mysql = require("mysql2");
const auth = require('../auth')
const multer = require('multer')



// const hbs = require('hbs')
// const path = require('path');
// const { ok } = require('assert');



// app.set('views', path.join(__dirname, '../views/'))

//set view engine
// app.set('view engine', 'hbs')


router.get('/getWriteblogPage', verifyToken, (req, res) => {
    console.log("from write blog backend")
    res.send({ status: 200, data: true });
})

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "blogsite_userdatabase"
});


var storage1 = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads/blogImages');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});
var storage2 = multer.diskStorage({
    destination: function(req, file, callback) {
        //current location is backend folder
        callback(null, 'uploads/profileImages');
    },
    filename: function(req, file, callback) {
        // filename = req.body.username + "." + file.mimetype.split("/")[-1];
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let filename = req.body.username + "." + extension
        callback(null, filename)
    }
});
// const upload = multer({ dest: '../frontend/src/assets/img' })

var upload1 = multer({ storage: storage1 });
var upload2 = multer({ storage: storage2 });



//when you enter the url localhost:8080/api, get request below gets executed
router.get('/', (req, res) => {
    res.send('Response from API route')
})



/* GET users listing. */
router.post('/register', async function(req, res, next) {
    try {
        //req.body is json type, key-value pair
        let { username, email, password } = req.body;

        const hashed_password = md5(password.toString())

        const checkUserId = `Select user_id FROM users WHERE user_name = '${username}'`;
        con.query(checkUserId, (err, result, fields) => {
            if (!result.length) {
                const sql1 = `Insert Into users (user_name, email, password) VALUES ('${username}','${email}','${hashed_password}')`
                con.query(sql1, (err, result) => {
                    if (err) {
                        res.send({ status: 0, data: err });
                    } else {
                        //second argument secret key in the sign method can be anything
                        //here we are assigning it to be a string called 'secret'
                        let token = jwt.sign({ data: result }, 'secretkey')
                            //getting the user
                            //sending this token as an object 
                        const sql2 = `select user_id from users where user_name='${username}'`
                        con.query(sql2, (err, result) => {
                                if (err) {
                                    console.log("err in sql2");
                                } else {
                                    console.log("user id is:-" + result)
                                    res.send({ status: 1, user_id: result[0].user_id, token: token });
                                }
                            })
                            // res.send({ status: 1, user_id: this.user_id, token: token });
                            //so now register api responds with a token
                    }

                })
            }
        });




    } catch (error) {
        res.send({ status: 0, error: error });
    }
});


// router.post('/register', (req, res) => {
//     res.send(console.log("post excepted!"))
//     let { username, email, password } = req.body;
//     // let username = req.body.username;
//     // let email = req.body.email;
//     // let password = req.body.password;

//     let qr = `insert into users (username,email,password) values('${username}','${email}','${password}')`
//     con.query(qr, (err, result) => {
//         if (err) console.log(err);
//         else { res.send({ message: "Data inserted!" }) }
//     })
// })

router.post('/login', async function(req, res, next) {
    try {
        let { email, password } = req.body;

        const hashed_password = md5(password.toString())
        const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${hashed_password}'`
        con.query(sql, function(err, result) {
            if (err || Object.keys(result).length === 0) {
                //err message and ask if he wants to try logging in again
                //if he wants it the navigate to log in page else navigate to register.
                res.send({ status: 0, data: 'log in with valid credantials' });
            } else {
                let token = jwt.sign({ data: result }, 'secretkey')
                res.send({ status: 1, data: result, token: token });
            }

        })
    } catch (error) {
        res.send({ status: 0, error: error });
    }
});




// router.post('/writeblog', upload.single('file'), (req, res, next) => {
//     const file = req.file;
//     console.log(file.filename);
//     if (!file) {
//         const error = new Error('please upload file');
//         error.httpstatuscode = 400;
//         return next(error)
//     }
//     res.send(file)
// });
// const upload = multer({ dest: 'uploads/' })
// router.post('/writeblog', upload.single('uploaded_file'), function(req, res) {

//     // req.file is the name of your file in the form above, here 'uploaded_file'
//     // req.body will hold the text fields, if there were any 
//     console.log('request body', req.file)
//     res.send(req.file)
// });



//getUsername
router.post('/getUserInfo', (req, res) => {
    user_id = req.body.data;
    // console.log("the input userid is: ")
    // console.log(user_id)
    sql = `SELECT user_name,user_id,profile_photo,followers,followings,about FROM users WHERE user_id = ${user_id}`;

    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            //if there is no such result
            // console.log(res)
            res.send({ status: 0, data: 'No such result found' });
        } else {
            console.log(result)
            res.send({ status: 1, data: result });
        }
    })
})
router.post('/getUserInfoByUsername', (req, res) => {
    user_name = req.body.data;
    // console.log("the input userid is: ")
    // console.log(user_id)
    sql = `SELECT user_name,user_id,profile_photo,followers,followings,about FROM users WHERE user_name = '${user_name}'`;

    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            //if there is no such result
            // console.log(res)
            res.send({ status: 0, data: 'No such result found' });
        } else {
            console.log(result)
            res.send({ status: 1, data: result });
        }
    })
})

//your posts that you liked
router.post('/youLikeYourPost', (req, res) => {
        const user_id = req.body.user_id;
        const sql = `select * from blogs where user_id=${user_id} and blog_id in ( SELECT blog_id from likedblogs where user_id=${user_id})`;
        con.query(sql, function(err, result) {
            if (err) {
                res.send({ status: 'error occured' });
            } else {
                res.send({ 'status': 1, 'data': result });
            }
        })
    })
    //variable users posts that you liked
router.post('/varPostYouLiked', (req, res) => {
    const user_id = req.body.user_id;
    const vars_id = req.body.vars_id;
    const sql = `select * from blogs where user_id=${vars_id} and blog_id in ( SELECT blog_id from likedblogs where user_id=${user_id})`;
    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            res.send({ status: 0, data: 'No blog found' });
        } else {
            res.send({ status: 'ok', data: result });
        }
    })
})
router.post('/getLikedPosts', (req, res) => {
    const user_id = req.body.user_id;
    const sql = `select blog_id from likedblogs where user_id=${user_id}`;
    con.query(sql, function(err, result) {
        if (err) {
            res.send({ status: 'error occured' });
        } else {
            res.send({ 'status': 1, 'data': result });
        }
    })
})


router.post('/getblogs', (req, res) => {
    const user_id = req.body.user_id;
    if (user_id == null) {
        const sql = 'select b.*, u.profile_photo,u.user_name from blogs b ,users u where u.user_id=b.user_id order by b.likes DESC';
        con.query(sql, function(err, result) {
            if (err || Object.keys(result).length === 0) {
                res.send({ status: 0, data: 'No blog found' });
            } else {
                res.send({ status: 'ok', data: result });
            }
        })
    } else {
        const sql = `select b.*, u.profile_photo,u.user_name from blogs b ,users u where u.user_id=b.user_id and b.user_id!=${user_id} order by b.likes DESC`;
        con.query(sql, function(err, result) {
            if (err || Object.keys(result).length === 0) {
                res.send({ status: 0, data: 'No blog found' });
            } else {
                res.send({ status: 'ok', data: result });
            }
        })
    }

})
router.post('/getBlogsByHashtages', (req, res) => {
    hashtag = req.body.hashtag;
    console.log("hashtag is: " + hashtag);
    const sql = `select b.*, u.profile_photo,u.user_name from blogs b ,users u where u.user_id=b.user_id and locate('${hashtag}',b.hashtags)!=0;`;
    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            console.log(err);
            console.log('could not get blogs');
            res.send({ status: 0, data: 'No blog found' });
        } else {
            console.log('the sql is: ' + sql);
            console.log('response from be getBlogsByHashtages')
            console.log(result);

            res.send({ status: 'ok', data: result });
        }
    })
})
router.post('/getUserBlogs', (req, res) => {
    user_id = req.body.user_id;
    console.log("user id is: " + user_id);
    const sql = `select * from blogs where user_id=${user_id}`;
    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            console.log(err);
            console.log('could not get blogs');
            res.send({ status: 0, data: 'No blog found' });
        } else {
            console.log('the sql is: ' + sql);
            console.log('response from be getuerBlogs')
            console.log(result);

            res.send({ status: 'ok', data: result });
        }
    })
})
router.post('/getUserBlogsByUserName', (req, res) => {
    user_name = req.body.user_name;
    console.log("user name is: " + user_name);
    const sql = `select * from blogs where user_id=(select user_id from users where user_name='${user_name}')`;
    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            console.log(err);
            console.log('could not get blogs');
            res.send({ status: 0, data: 'No blog found' });
        } else {
            console.log(result);
            res.send(result);
        }
    })
})

router.post('/getFilePathByUsername', (req, res) => {
    user_name = req.body.user_name;
    // console.log("user name is: " + user_name);
    const sql = `select profile_photo from users where user_name='${user_name}'`;
    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            console.log(err);
            console.log('could not get file');
            res.send(err);
        } else {
            console.log("name of the image is: " + result);
            res.send(result);
        }
    })
})
router.post('/get12MostFollowedUsers', (req, res) => {
    let user = req.body.user;
    console.log(user);
    if (user == null) {
        console.log("user==null");
        sql = 'select user_id, user_name, profile_photo, followers,about from users order by followers LIMIT 12';
    } else {
        // console.log("user= not null");
        sql = `select user_id, user_name, profile_photo, followers,about from users where user_id != ${user} order by followers LIMIT 12;`;
        console.log(sql);
    }
    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            console.log("no user found");
            res.send({ status: 0, data: 'No user found' });
        } else {
            // console.log("success!");
            res.send({ status: 200, data: result });
        }
    })
})

router.get('/gotoProfile', verifyToken, (req, res) => {
    res.send({ status: 200 });
})

router.post('/getUsers', (req, res) => {
    let user = req.body.user;
    console.log(user);
    if (user == null) {
        console.log("user==null");
        sql = 'select user_id, user_name, profile_photo,followers from users LIMIT 12';
    } else {
        // console.log("user= not null");
        sql = `select user_id, user_name, profile_photo,followers from users where user_id not in (select follows from followers where user_id=${user}) and user_id!='${user}' LIMIT 12;`;

        console.log(sql);
    }
    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            console.log("no user found");
            res.send({ status: 0, data: 'No user found' });
        } else {
            // console.log("success!");
            res.send({ status: 200, data: result });
        }
    })
})


router.get('/get12PopularHashtags', (req, res) => {
    sql = 'SELECT * from hashtags ORDER by used_by DESC LIMIT 12';
    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            console.log("no user found");
            res.send({ status: 0, data: 'No user found' });
        } else {
            // console.log("success!");

            console.log('12 popular hashtags');
            console.log(result);
            res.send({ status: 200, data: result });
        }
    })
})
router.get('/getAllUsers', (req, res) => {
    sql = 'select user_id, user_name, profile_photo from users';
    con.query(sql, function(err, result) {
        if (err || Object.keys(result).length === 0) {
            console.log("no user found");
            res.send({ status: 0, data: 'No user found' });
        } else {
            // console.log("success!");
            res.send({ status: 200, data: result });
        }
    })
})



router.post('/uploadBlog', upload1.single('photo'), function(req, res) {

    try {
        var user_id = req.body.user_id;
        var time = req.body.time;
        var hashtags = req.body.hashtags;
        var title = req.body.title;
        var body = req.body.body;
        var photo = req.file.originalname;

        // console.log(req.body);
        // console.log(req.file.size);
        // console.log(req);
        var array = hashtags.split("#");
        for (let index = 1; index < array.length; index++) {
            // const element = array[index];
            var sql = `insert into hashtags(hashtag,banner) values ('${array[index]}','${photo}')`;
            con.query(sql, (err, result) => {
                if (err) {
                    console.log('err running query');
                    // res.send({ status: 400, data: err })
                } else {
                    console.log({ status: 200, data: 'data inserted sucessfully' });
                    // res.send({ status: 'ok' })

                }
                sql = `update hashtags set used_by=used_by+1 where hashtag='${array[index]}'`;
                con.query(sql, (err, result) => {
                    if (err) {
                        console.log('err running query');
                        // res.send({ status: 400, data: err })
                    } else {
                        console.log({ status: 200, data: 'data updated sucessfully' });
                        // res.send({ status: 'ok' })
                    }

                })

            })




        }


        sql = `insert into blogs(user_id,hashtags,title,body,photo,time) values (${user_id},'${hashtags}', '${title}', '${body}', '${photo}','${time}')`;
        // var sql = "insert into blogs(user_id,category,title,description,body) values ('" + user_id + "','" + category + "','" + title + "','" + des + "','" + body + "')";
        // var sql = "insert into blogs(title,description,body) values ('" + title + "','" + des + "','" + body + "')";
        con.query(sql, (err, result) => {
            if (err) {
                console.log('err running query');
                res.send({ status: 400, data: err })
            } else {
                console.log({ status: 200, data: 'data inserted sucessfully' });
                res.send({ status: 'ok' })
            }

        })


        // console.log(req.file)

        // res.send({ status: 'file uploaded successfully' })

    } catch (error) {
        console.log('Error occurred in save API', error);
        throw error;
    }



});

//to get the followers of a usre

router.get('/getHashtags', (req, res) => {

    sql = `select hashtag from hashtags`
    con.query(sql, (err, result) => {
        if (err) {
            console.log('no hashtags');
            res.send({ status: 400, data: err })
        } else {
            console.log({ status: 200, data: 'got hashtags' });
            console.log(result);
            res.send({ status: 'ok', data: result })
        }

    })
})
router.post('/getFollowers', (req, res) => {
    user_id = req.body.user_id;
    console.log('userid is')
    console.log(user_id)
    sql = `select u.user_id,u.user_name,u.profile_photo from users u, followers f where f.follows=${user_id} and u.user_id=f.user_id`
    con.query(sql, (err, result) => {
        if (err) {
            console.log('no followers');
            res.send({ status: 400, data: err })
        } else {
            console.log({ status: 200, data: 'got followers' });
            console.log(result);
            res.send({ status: 'ok', data: result })
        }

    })
})
router.post('/uploadProfileInfo', upload2.single('photo'), function(req, res) {

    try {
        // var about = req.body.about;
        var username = req.body.username;
        console.log('username is: ' + username)
            // var title = req.body.title;
            // var des = req.body.description;
            // var body = req.body.body;
        let extArray = req.file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        let filename = req.body.username + "." + extension
        var photo = filename;

        // console.log(req.body);
        // console.log(req.file.size);
        // console.log(req);

        // var sql =`insert into users (photo) values ('${photo}') where user_name='${username}'`;
        var sql = `UPDATE users SET profile_photo = '${photo}' where user_name='${username}'`;

        // var sql = "insert into blogs(user_id,category,title,description,body) values ('" + user_id + "','" + category + "','" + title + "','" + des + "','" + body + "')";
        // var sql = "insert into blogs(title,description,body) values ('" + title + "','" + des + "','" + body + "')";
        con.query(sql, (err, result) => {
            if (err) {
                console.log('err running query');
                res.send({ status: 400, data: err })
            } else {
                console.log({ status: 200, data: 'photo uploaded sucessfully' });
                // res.send({ status: 'ok', data: result })
            }

        })


        console.log(req.file)

        res.send({ status: 'file uploaded successfully' })

    } catch (error) {
        console.log('Error occurred in save API', error);
        throw error;
    }

    // upload(req, res, function(err) {
    //     console.log(req.body);
    //     console.log('hi!')

    //     if (err) {
    //         console.log('error in the backend');
    //         return res.end("Error uploading file." + err);
    //     }
    //     console.log("test");
    //     var user_id = req.body.user_id;
    //     var category = req.body.category;
    //     var title = req.body.title;
    //     var des = req.body.description;
    //     var body = req.body.body;
    //     var photo = req.file.originalname;

    //     console.log(req.body);
    //     // console.log(req.file);
    //     // console.log(req);

    //     var sql = "insert into blogs(user_id,category,title,description,body,photo) values ('" + user_id + "','" + category + "','" + title + "','" + des + "','" + body + "','" + photo + "')";
    //     // var sql = "insert into blogs(user_id,category,title,description,body) values ('" + user_id + "','" + category + "','" + title + "','" + des + "','" + body + "')";
    //     // var sql = "insert into blogs(title,description,body) values ('" + title + "','" + des + "','" + body + "')";
    //     con.query(sql);
    //     console.log("Connected!");
    //     res.end('{"res":"Saved"}');

    // });

});

//to get the followers of a usre
router.post('/getFollowers', (req, res) => {
    user_id = req.body.user_id;
    console.log('userid is')
    console.log(user_id)
    sql = `select u.user_id,u.user_name,u.profile_photo from users u, followers f where f.follows=${user_id} and u.user_id=f.user_id`
    con.query(sql, (err, result) => {
        if (err) {
            console.log('no followers');
            res.send({ status: 400, data: err })
        } else {
            console.log({ status: 200, data: 'got followers' });
            res.send({ status: 'ok', data: result })
        }

    })
})

//to get the followings of a usre
router.post('/getFollowings', (req, res) => {
        user_id = req.body.user_id;
        console.log('userid is')
        console.log(user_id)
        sql = `select u.user_id,u.user_name,u.profile_photo from users u, followers f where f.user_id=${user_id} and u.user_id=f.follows`
        con.query(sql, (err, result) => {
            if (err) {
                console.log('no following');
                res.send({ status: 400, data: err })
            } else {
                console.log({ status: 200, data: 'got followings' });
                res.send({ status: 'ok', data: result })
            }

        })
    })
    //to follow an user
router.post('/follow', verifyToken, (req, res) => {
    user_id = req.body.user_id;
    others_id = req.body.others_id;
    sql = `insert into followers values(${user_id},${others_id})`
    con.query(sql, (err, result) => {
        if (err) {
            console.log('couldn not follow');
            res.send({ status: 400, data: err })
        } else {
            console.log({ status: 200, data: 'now following' });
            sql = `update users set followers=followers+1 where user_id='${others_id}'`;
            con.query(sql, (err, result) => {
                if (err) {
                    console.log('err running query');
                    // res.send({ status: 400, data: err })
                } else {
                    console.log({ status: 200, data: 'data updated sucessfully' });
                    res.send({ status: 'ok' })
                }

            })

        }

    })
})

router.post('/isFollowing', (req, res) => {
    const me = req.body.me;
    const you = req.body.you;
    sql = `select follows from followers where user_id=${me} and follows=${you}`
    con.query(sql, (err, result) => {
        if (err || Object.keys(result).length === 0) {
            res.send({ result: 'false' });
        } else {

            res.send({ result: 'true' });
        }
    })
})


router.post('/unfollow', (req, res) => {
    user_id = req.body.user_id;
    others_id = req.body.others_id;
    console.log(user_id);
    console.log(others_id);
    sql = `delete from followers where user_id=${user_id} and follows=${others_id}`
    con.query(sql, (err, result) => {
        if (err) {
            console.log('could not unfollow');
            res.send({ status: 400, data: err })
        } else {
            console.log({ status: 200, data: 'unfollowed' });
            sql = `update users set followers=followers-1 where user_id='${others_id}'`;
            con.query(sql, (err, result) => {
                if (err) {
                    console.log('err running query');
                    // res.send({ status: 400, data: err })
                } else {
                    console.log({ status: 200, data: 'data updated sucessfully' });
                    res.send({ status: 'ok' })
                }

            })
        }

    })
})

router.post('/getFollowingsId', (req, res) => {
    const userId = req.body.user_id;
    sql = `select user_id from users where user_id in (select follows from followers where user_id=${userId})`
    con.query(sql, (err, result) => {
        if (err || Object.keys(result).length === 0) {
            console.log('no followings');
            res.send({ status: 400, data: 0 })
        } else {
            console.log(result);
            console.log(result.length);
            res.send({ status: 'ok', data: result })
        }

    })
})

router.post('/comment', verifyToken, (req, res) => {
    const blog_id = req.body.blog_id;
    const user_id = req.body.user_id;
    const comment = req.body.comment;
    const time = req.body.time;
    sql1 = `update blogs set comments=comments+1 where blog_id=${blog_id}`;
    sql2 = `Insert into comments values(${blog_id},${user_id},'${comment}','${time}')`;
    con.query(sql1, (err, result) => {
        if (err) {
            console.log('error posting comment');
            // res.send({ status: 400})
        } else {
            con.query(sql2, (err, result) => {
                if (err) {
                    console.log('failed to comment :(');
                    res.send({ status: 400 })
                } else {
                    console.log(result);
                    console.log(result.length);
                    res.send({ status: 'comment added! :)' })
                }

            })
        }

    })

})

router.post('/getComments', (req, res) => {
    const blog_id = req.body.blog_id;
    sql = `select c.*,u.user_name, u.profile_photo from comments c, users u where c.blog_id=${blog_id} and u.user_id=c.user_id`;
    con.query(sql, (err, result) => {
        if (err) {
            console.log('error posting comment');
            res.send({ status: 400 })
        } else {
            console.log(result);
            console.log(result.length);
            res.send({ status: 'ok', data: result })
        }

    })

})

router.post('/like', verifyToken, (req, res) => {
    const user_id = req.body.user_id;
    const blog_id = req.body.blog_id;
    sql1 = `update blogs set likes=likes+1 where blog_id=${blog_id}`;
    sql2 = `insert into likedblogs values(${user_id},${blog_id})`;
    con.query(sql1, (err, result) => {
        if (err) {
            console.log('error posting comment');
            // res.send({ status: 400})
        } else {
            con.query(sql2, (err, result) => {
                if (err) {
                    console.log('failed to like :(');
                    res.send({ status: 400 })
                } else {
                    console.log(result);
                    console.log(result.length);
                    res.send({ status: 'you liked it :)' })
                }

            })
        }

    })


})
router.post('/unlike', (req, res) => {
    const user_id = req.body.user_id;
    const blog_id = req.body.blog_id;
    sql1 = `update blogs set likes=likes-1 where blog_id=${blog_id}`;
    sql2 = `delete from likedblogs where user_id=${user_id} and blog_id=${blog_id}`;
    con.query(sql1, (err, result) => {
        if (err) {
            console.log(sql1);
            console.log('error while unliking by query 1');
            // res.send({ status: 400})
        } else {
            con.query(sql2, (err, result) => {
                if (err) {
                    console.log('error while unliking by query 2');
                    res.send({ status: 400 })
                } else {
                    console.log(result);
                    console.log(result.length);
                    res.send({ status: 'unlike successful :)' })
                }

            })
        }

    })


})


// router.post('/getLikes', (req, res) => {
//     const blog_id = req.body.blog_id;
//     sql = `select likes from blogs where blog_id=${blog_id}`;
//     con.query(sql, (err, result) => {
//         if (err) {
//             console.log('error getting likes');
//             res.send({ status: 400 })
//         } else {
//             console.log(result);
//             console.log(result.length);
//             res.send({ status: 'ok', data: result })
//         }

//     })

// })



function verifyToken(req, res, next) {
    console.log('authorization header is');
    console.log(req.headers.authorization);
    if (!req.headers.authorization) {
        console.log('no authorization header');
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    console.log(req.headers.authorization.split(' ')[1])

    if (token === 'null') {
        console.log('token is null');
        return res.status(401).send('Unauthorized request')
    }
    try {
        const payload = jwt.verify(token, 'secretkey')
    } catch (err) {
        // err
        console.log('error found');
        return res.status(401).send('Unauthorized request')
    }
    // let payload = jwt.verify(token, 'secretkey')
    console.log('payload is');
    console.log(this.payload);
    // if (!this.payload) {
    //     console.log('token is null');
    //     return res.status(401).send('Unauthorized request')
    // }
    console.log('token verified');
    // req.user = this.payload.data
    next()
}




module.exports = router