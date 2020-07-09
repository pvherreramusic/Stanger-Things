const app = $('#appontheDOM');
const messageDOM = $("#messagesontheDOM");
const TOKEN_KEY = 'USER_TOKEN';
const USERNAME = '';
const PASSWORD = '';
let token;




const state = {
user: {},
posts: [],
mepost: [],
usermessages: [],
message:[],
title: "",
token: "",
description: "",
price: "",
content: "",
postid: " "
}
const signup = async (username, password) => {
    try {
      // This is a POST request, because we are creating a user.
      const res = await fetch('https://strangers-things.herokuapp.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username,
            password,
          },
        }),
      });
  
      const json = await res.json();
  
      console.log('Sign up response: ', json);
  
      return json;
    } catch (e) {
      console.warn('Failed to sign up!');
      throw e;
    }
  }
  
  const login = async (username, password) => {
    try {
      const res = await fetch('https://strangers-things.herokuapp.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username,
            password,

          },
        }),
      });
  
      const json = await res.json();
      if(json.data.token) {
        state.user.username = username



      }
  
      console.log('Login response: ', json);
  
      return json;
    } catch (e) {
      console.warn('Failed to Login!');
      throw e;
    }
  }
  
  const storeToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  };
  


  
  // const bootstrapAPI = async () => {
  //   const lsToken = localStorage.getItem(TOKEN_KEY);
  //   if (lsToken) {
  //     console.log('Found previous login!', lsToken);
  //     token = lsToken;
  //   } else {
  //     const userRes = await signup(USERNAME, PASSWORD);
  
  //     if (userRes.success) {
  //       const resToken = userRes.data.token;
  //       console.log('Successful login!', resToken);
  //       storeToken(token);
  //       token = resToken;
  //     } else {
  //       console.warn('Failed to sign up!');
  //       const res = await login(USERNAME, PASSWORD);
  //       const resToken = res.data.token;
  //       storeToken(resToken);
  //       token = resToken;
  //     }
  //   }
  
  //   return token;
  // }
  const getMe = async() => {

    const token = localStorage.getItem(TOKEN_KEY);
  
    try {
      const req = await fetch('https://strangers-things.herokuapp.com/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
     
      });
      const res = await req.json();
      
      
      return res
      console.log ('POST', res)               
  }catch(err) {
      console.error('error', err);
  }
  }



  const runApp = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  state.token = token
   const json =await getMe();
   state.mepost = json.posts && json.posts.filter(post=> post.active)||[];
   console.log(json.messages)
   state.usermessages= json.messages
   
   render();
  
    console.log('App Started: ', json);
  };
  
  runApp();







  const getPost = async() => {
  
    try {
        const req = await fetch('https://strangers-things.herokuapp.com/api/posts', {
       
        });
        const res = await req.json();
        state.posts = res.data.posts

        render();
        
       

        

        console.log('ALL POSTS:' ,res);                
    }catch(err) {
        console.error('ERROR:', err);
    }
}
getPost();

const post = async(price, description, title) => {

const token = localStorage.getItem(TOKEN_KEY);


try {
  const req = await fetch('http://strangers-things.herokuapp.com/api/posts', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          post: {
            price,
            description,
            title
          }
          })
        });
    const res = await req.json();
    return res;

    console.log("POSTS:" ,res);   
              
}catch(err) {
    console.error(err);
  }
}





const deletepost = async(_id) => {

  const token = localStorage.getItem(TOKEN_KEY);
  try {
  const req = await fetch('https://strangers-things.herokuapp.com/api/posts'+ "/" + `${_id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      
        });
    const res = await req.json();
    state.mepost = state.mepost.filter(post=>post._id!==_id)
    console.log("DELETE:" ,res);   
              
}catch(err) {
    console.error(err);
  }
}



const sendMessages = async(_id, content ) => {
   const token = localStorage.getItem(TOKEN_KEY);
    
    
    try {
      const req = await fetch('https://strangers-things.herokuapp.com/api/posts/'+ `${_id}` + "/" + "messages", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: {
           
          content
          
          }
          
        })
      })
    
        const res = await req.json();
        state.message = res.messages
        render()
       

        console.log("MESSAGE CONTENT: " ,res);   
                  
    }catch(err) {
        console.error("ERROR: ", err);
    }
    
}







function allPost(posts){
  const mainCard = $('<div>');
  const mainPostfromUsers = $(`<h2> ALL POSTS FROM SITE USERS: <h2>`);
  const showPost= posts.map(post=>$(`<h2> ${post.title} </h2>
    <h3> ${post.author.username}</h3><h4>${post.price}</h4>
    <article> ${post.description}  </article>
    <div id= "post-card">
    <h3>Send a message to user</h3>
    <form id="message-form" >
    <textarea id='messagesfromuser' columns="40" rows="5"></textarea>
    <button id ="send"> send message </button>
    </div>
    </form>`).data("post", post))
    mainCard.append(mainPostfromUsers, showPost);
    return mainCard;
}
function userDash(){
  const userCard = $('<div>');
  const POSTStile = $(`<h2> YOUR POSTS: <h2>`);
  const allUserPost = state.mepost.map(post=>$(`<div id= "post-card"><h2> ${post.title} <button id="delete">Delete</button></h2> by 
    <h3> ME </h3> ----------- <h4>${post.price}</h4>
    <article> ${post.description} </article>  </div>`).data("post", post));
  const messtitle= $(`<h2> ALL MESSAGES: <h2>`)
  const messagesfromUsuers = state.usermessages.map(messages=>$(`<article> FROM:${messages.fromUser.username} </article>  <article> MESSAGE: ${messages.content} </article> `))
  userCard.append(POSTStile,allUserPost, messtitle, messagesfromUsuers);
  return userCard;
  
  }

function nothing(){

  return ""
}


$('#appontheDOM').on('click', "#send", async function (event) {
  event.preventDefault();
  
  try {
  const post = $(event.target).closest("#post-card").data("post");
  console.log(post._id)
  const content = $('#messagesfromuser').val()
  console.log(content)
  const res = await sendMessages(post._id, content)
  console.log(res);
  render();
}catch (err) {

  alert("YOU MUST BE LOGIN TO SEND A MESSAGE.",err);

  }

});



$('#appontheDOM').on('click', "#delete", async function (event) {
  event.preventDefault();
  const post = $(event.target).closest("#post-card").data("post")
  console.log(post._id)
  console.log("delete")
  const res = await  deletepost(post._id)
  console.log(res);
  render();
});


$('#login-form').on('submit', async function (event) {
  event.preventDefault();

  console.log('click login')
  const username = $('#loginusername').val()
  const password = $('#loginpassword').val()
  console.log(username)
  console.log(password)
  const res = await login(username, password) 
  const resToken = res.data.token;
  storeToken(resToken);
  console.log(res);
  render()
  

});



$('#post-form').on('submit', async function (event) {
  event.preventDefault();
  
  try {
  console.log('click post')
  const title = $('#post-title').val()
  const price = $('#post-price').val()
  const description = $('#post-description').val()
  console.log(title)

  const res = await post(price, description, title) 
  const resToken = res.data.token;
  storeToken(resToken);
  console.log(res)
  
  }catch (err) {

    alert("YOU MUST BE LOGIN TO POST.",err);

  }
});


$('#signup-form').on('submit', async function (event) {
  event.preventDefault();

  console.log('Signed Up ')
  const username = $('#signupusename').val()
  const password = $('#signuppassword').val()
  console.log(username)
  console.log(password)

  const res = await signup(username, password)
  const resToken = res.data.token;
  storeToken(resToken);
  console.log(res)

});

$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#appontheDOM *, h4, h3").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});


$("#signup").click(function() {
  $("#first").slideUp("slow", function() {
    $("#second").slideDown("slow");
  });
});
    // On Click SignIn It Will Hide Registration Form and Display Login Form
$("#signin").click(function() {
  $("#second").slideUp("slow", function() {
    $("#first").slideDown("slow");
  });
});



  function render() {
    app.empty();
    
    if(state.user.username){
    app.append(state.user.username?userDash():allPost(state.posts))
    app.append(state.user.username?allPost(state.posts):nothing())
    }
    else
    app.append(state.user.username?userDash():allPost(state.posts))
    
  }
  render();