/**
 * /app.js
 */ 

const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.static('public'));

// フォームから送信された値を受け取れるようにする。
app.use(express.urlencoded({extended: false}));

// データベースと接続
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ceryonela5',
  database: 'makeround'
});

//セッション管理
app.use(
  session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.userName = 'ゲスト';
    res.locals.isLoggedIn = false;
  } else {
    res.locals.userName = req.session.userName;
    res.locals.isLoggedIn = true;
  }
  next();
});

app.get('/', (req, res) => {
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM members WHERE user_id = ?',
    [req.session.userId],
    (error, results) => {
      res.render('index.ejs', {members: results})
    }
  );
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO members (user_id, name, gender, grade) VALUES (?, ?, ?, ?)',
    [req.session.userId,
      req.body.memberName, 
      parseInt(req.body.memberGender),
      parseInt(req.body.memberGrade)
    ],//配列なので[]の中に","区切りで入れた。神プレイ。
    (error, results) => {
        res.redirect('/index');//'/index'にリダイレクトしたので、URLが'/index'のルーティングが実行されるんだと思う。
      }
  );
});

app.post('/delete/:member_id', (req, res) => {
  connection.query(
    'DELETE FROM members WHERE member_id=?',
    [req.params.member_id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/edit/:member_id', (req, res) => {
  connection.query(
    'SELECT * FROM members WHERE member_id = ?',
    [req.params.member_id],
    (error, results) => {
      res.render('edit.ejs', {member: results[0]});
    }
  );
});

app.post('/update/:member_id', (req, res) => {
  connection.query(
    'UPDATE members SET name = ?, gender = ?, grade = ? WHERE member_id = ?',  //複数の値を更新する時はSETする値を','で区切る。
    [
      req.body.memberName,
      req.body.memberGender,
      req.body.memberGrade,
      req.params.member_id
    ],
    (error, results) => {
      res.redirect('/index');
    }
  );
});



app.get('/select', (req, res) => {
  connection.query(
    'SELECT * FROM members WHERE user_id = ?',
    [req.session.userId],
    (error, results) => {
      res.render('select.ejs', {members: results});
    }
  );
});

app.get('/result', (req, res) => {
  res.render('result.ejs');
});

// 新規登録、ログイン・ログアウト関係
app.get('/signup', (req, res) => {
  res.render('signup.ejs', {errors: []});
});

//このままだと同じ名前・パスワードで複数回新規登録できる。
app.post('/signup', 
  (req, res, next) => {
    console.log('入力値の空チェック');
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    const errors = [];
    if (userName === '') {
      errors.push('ユーザー名が空です');
    }
    if (email === '') {
      errors.push('メールアドレスが空です')
    }
    if (password === '') {
      errors.push('パスワードが空です');
    }
    console.log(errors);

    if (errors.length > 0) {
      res.render('signup.ejs', {errors: errors});
    } else {
      next();
    }
  },

  (req, res, next) => {
    console.log('メールアドレスの重複チェック');
    const email = req.body.email;
    const errors = [];
    connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (error, results) => {
        if (results.length > 0) {
          errors.push('ユーザー登録に失敗しました');
          res.render('signup.ejs', {errors: errors});
        } else {
          next();
        }
      }
    );
  },

  (req, res) => {   
    const userName = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;

    console.log('ここまで実行されてるよ');

    //パスワードをハッシュ化してデータベースに追加する
    const saltRounds = 10;
    
    
    const hashPassword = async () => {
      const temp = await bcrypt.hash(password, saltRounds) 
      .then(hash => {
        console.log('ここも実行されてる');
        connection.query(
          'INSERT INTO users (userName, email, password) VALUES (?, ?, ?)',
          [userName, email, hash],
          // ダメ元。おそらくこの「ついでにログインパート」はさらに非同期処理としてつなげるとかしないといけない気がする。
          // ……と思っていたが普通にうまく行った。async/await、非同期処理の理解を深めねば。
          (error, results) => {
            console.log('error:' + error);
            if (results === undefined) {
              console.log('results is undefined.');
              res.redirect('/');
            } else {
              req.session.userId = results.insertId;
              req.session.userName = userName;
              res.redirect('/');
            }
          }
          );
        }).catch(() => {
          return '失敗！'
        });
        
      }
      
    hashPassword();  
  }
  
);


app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', (req, res) => {
  const email = req.body.email;

  connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (error, results) => {
      console.log('results:' + results);
      if (results.length > 0) {
        const plain = req.body.password;
        const hash = results[0].password;

        const comparePassword = async () => {
          const temp = await bcrypt.compare(plain, hash)
          .then(isEquel => {
            if (isEquel) {
              req.session.userId = results[0].user_id;
              req.session.userName = results[0].userName;
              res.redirect('/');
            } else {
              res.redirect('/login');
            }
          }) 
        }

        comparePassword();

      } 
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/');
  });
});

app.listen(8080);
