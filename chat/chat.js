axios.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";

let getAllClicked = false;

const textarea = document.getElementById("textArea");
textarea.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    chatButton(event);
  }
});

console.log(getAllClicked);
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userName = localStorage.getItem("username");
    userJoined(userName);
    // if(!getAllClicked){
    //     setInterval(()=>{
    //         getLocalMsgs()

    //     },1000)
    // }
    getLocalMsgs()
    allGroups();
  } catch (err) {
    console.log(err);
  }
});

function userJoined(userName) {
  let newMessage = document.createElement("div");
  newMessage.classList.add("message-container");
  let messageText = document.createElement("p");
  messageText.classList.add("message-text");
  messageText.innerText = `${userName} joined`;
  newMessage.appendChild(messageText);
  document.querySelector(".chat-messages").appendChild(newMessage);
}


async function chatButton() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location = "login.html";
    }

    let textArea = document.querySelector("textarea");
    let msg = textArea.value;

    textArea.value = "";

    const groupId = localStorage.getItem("groupId")
    ? localStorage.getItem("groupId")
    :1

    let newMessage = document.createElement("div");
    newMessage.classList.add("message-container-right");
    let messageText = document.createElement("p");
    messageText.classList.add("message-text");

    if(msg.includes('http')){
      let link = msg;
      await axios.post(
        `http://localhost:3000/msg/tostore/${groupId}`,
        { msg: link},
        { headers: { Authorization: token } }
      );
      messageText.innerHTML = `You : <a href="#" onclick="linkClicked(${groupId})">Join link</a>`
    }else{
      await axios.post(
        `http://localhost:3000/msg/tostore/${groupId}`,
        { msg },
        { headers: { Authorization: token } }
      );
      messageText.innerHTML = `You :  ${msg}`;
    }
    newMessage.appendChild(messageText);
    document.querySelector(".chat-messages").appendChild(newMessage);

  } catch (err) {
    console.log(err);
  }
}

async function getAll() {
  try {
    getAllClicked = true;
    const groupId = localStorage.getItem('groupId')
    const allMsgsRes = await axios.get(`http://localhost:3000/msg/toget/${groupId?groupId:1}`);
    // console.log(allMsgsRes.data.message)
    const allMsgs = allMsgsRes.data.message;
    // setInterval(showMsgs(allMsgs), 1000);
    showMsgs(allMsgs);
  } catch (err) {
    console.log(err);
  }
}

let latestMessageId = localStorage.getItem("latestMessageId") || 0;

async function getLocalMsgs() {
  if (!getAllClicked) {
    let groupId = localStorage.getItem("groupId");
    const LocalMsgsRes = await axios.get(
      `http://localhost:3000/msg/localmsg?groupId=${groupId}&latestId=${latestMessageId}`
    );
    console.log(LocalMsgsRes.data.message, "local");
    let messages = LocalMsgsRes.data.message;
    let currentMessages = JSON.parse(localStorage.getItem("messages")) || [];

    // Only add new messages to the currentMessages array
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].id > latestMessageId) {
        currentMessages.push(messages[i]);
        latestMessageId = messages[i].id;
      }
    }

    currentMessages = currentMessages.slice(-10);
    localStorage.setItem("messages", JSON.stringify(currentMessages));
    let info = JSON.parse(localStorage.getItem("messages"));
    console.log(info, "info");
    showMsgs(info);
  }
}


// async function getLocalMsgs() {
//   if (!getAllClicked) {
//     try {
//       let preData = JSON.parse(localStorage.getItem("data")) || [];
//       let groupId = localStorage.getItem("groupId")


//       let lastMsgId;

//       if (preData.length !== 0) {
//         lastMsgId = preData[preData.length - 1].id;
//         console.log(lastMsgId,'lastmsg ID')
//       } else {
//         lastMsgId = -1;
//       }

//       const LocalMsgsRes = await axios.get(
//         `http://localhost:3000/msg/localmsg?id=${lastMsgId}&groupId=${groupId}`
//       );
//       console.log(LocalMsgsRes.data.message,'local')

//       let sameData = LocalMsgsRes.data.message;

//       if (
//         (preData.length !== 0 ) &&  (sameData.length !== 0) &&
//         (preData[preData.length - 1].id === sameData[sameData.length - 1].id) 
//       ) {
//         console.log(

//           preData[preData.length - 1].id - 1,
//           sameData[sameData.length - 1].id,
//           preData.length,
//           sameData.length
//         )
//         let datalocal = JSON.parse(localStorage.getItem("data"));
//         return showMsgs(datalocal);
//       }
//       let allLocalMsgs;

//       if (preData.length === 0) {
//         allLocalMsgs = LocalMsgsRes.data.message;
//       } else {
//         allLocalMsgs = [...preData, ...LocalMsgsRes.data.message];
//         let uniqueIds = new Set();
//         allLocalMsgs = allLocalMsgs.filter((item) => {
//           if (!uniqueIds.has(item.id)) {
//             uniqueIds.add(item.id);
//             return true;
//           }
//           return false;
//         });

//         // console.log(allLocalMsgs);
//       }

//       if (allLocalMsgs.length > 10) {
//         console.log(allLocalMsgs);
//         const msgAfterSlice = allLocalMsgs.slice(
//           allLocalMsgs.length - 10,
//           allLocalMsgs.length
//         );
//         console.log(allLocalMsgs.length, "after slice");
//         localStorage.setItem("data", JSON.stringify(msgAfterSlice));
//       } else {
//         localStorage.setItem("data", JSON.stringify(allLocalMsgs));
//         // console.log("entered 2");
//       }

//       let datalocal = JSON.parse(localStorage.getItem("data"));
//       //   console.log(datalocal)
//       showMsgs(datalocal);
//     } catch (err) {
//       console.log(err, "happend in frontend");
//     }
//   }
// }

async function showMsgs(allMsgs) {
  try {
    document.getElementById("chatblock").innerHTML = "";
    const user = localStorage.getItem("username");
    allMsgs.forEach((data) => {
      let msgText = data.message;
      let userName = data.user.name;

      let newMessage = document.createElement("div");
      
      if (user !== userName) {
        newMessage.classList.add("message-container-left");
        let messageText = document.createElement("p");
        messageText.classList.add("message-text");
        
        if (msgText.startsWith("http://localhost:3000/group/groupid/")) {
          const url = msgText;
          const lastSlashIndex = url.lastIndexOf('/');
          console.log(lastSlashIndex)
          const groupId = url.substring(lastSlashIndex + 1);
          messageText.innerHTML = `${userName}:  <a href="#" onclick="linkClicked(${groupId})">Join link</a>`;
        } else {
          messageText.innerText = `${userName}:  ${msgText}`;
        }

        newMessage.appendChild(messageText);
        document.querySelector(".chat-messages").appendChild(newMessage);
      } else {
        newMessage.classList.add("message-container-right");
        let messageText = document.createElement("p");
        messageText.classList.add("message-text");
        
        if (msgText.startsWith("http://localhost:3000/group/groupid/")) {
          const url = msgText;
          const lastSlashIndex = url.lastIndexOf('/');
          const groupId = url.substring(lastSlashIndex + 1);
          messageText.innerHTML = `You:  <a href="#" onclick="linkClicked(${groupId})">Join link</a>`;
        } else {
          messageText.innerText = `You:  ${msgText}`;
        }

        newMessage.appendChild(messageText);
        document.querySelector(".chat-messages").appendChild(newMessage);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function createGroup() {
  try {
    const groupName = prompt("Please enter your group name");
    console.log(groupName);
    const groupCreationAPIres = await axios.post(
      "http://localhost:3000/group/toCreate",
      { groupName }
    );
    console.log(groupCreationAPIres);
    if (groupCreationAPIres.status === 201) {
      groupUI(groupCreationAPIres.data)
    }
  } catch (err) {
    console.log(err);
  }
}

function groupUI(data) {
  data = data.message;
  const parentElement = document.getElementById("group-list");
  data.forEach((item) => {
    let li = document.createElement("li");
    let groupText = document.createElement("div");
    groupText.classList.add("group-text");
    groupText.id = `${item.id}`
    groupText.textContent = `${item.GroupName}`;
    groupText.addEventListener("click", () => switchGroup(item.id,item.GroupName));
    li.appendChild(groupText);
    
    let inviteLink = document.createElement("p");
    inviteLink.className = "invite";
    inviteLink.innerHTML = `<a href="http://localhost:3000/group/groupid/${item.id}">Invite</a>`
    inviteLink.addEventListener("click", () => linkClicked(item.id));
    li.appendChild(inviteLink);
    
    parentElement.appendChild(li);
  });
  
  return;
}

async function addUserClicked(e){
  e.preventDefault()
  console.log('clicked on addUser function')
  const groupId = localStorage.getItem('groupId')
  const userName = document.getElementById('search').value
  console.log(userName)
  try {
    alert('Are you sure to add this user to group ?')
    const userCheckInGroupRes = await axios.get(`http://localhost:3000/group/toadduser?userEmail=${userName}&groupId=${groupId}&admin=false`)
    console.log(userCheckInGroupRes.status)
    if(userCheckInGroupRes.status === 200){
      alert('User is already a member in this group')
    }else{
      alert('User successfully added to this group')
    }
  } catch (err) {
    console.log(err);
  }

}

async function linkClicked(id) {
  try {
    console.log("clicked on the group link", id)
    alert('Are you sure to join in this group')
    const userCheckInGroupRes = await axios.get(`http://localhost:3000/group/toadduser?groupId=${id}&admin=false`)
    console.log(userCheckInGroupRes.status)
    if(userCheckInGroupRes.status === 200){
      alert('You are already a member in this group')
    }
    else{
      alert('Successfully joined in this gorup')
    }
  } catch (err) {
    console.log(err);
  }
}
async function switchGroup(id, GroupName) {
  try {
    console.log("Switching to group", id, GroupName)
    let list = document.getElementById('userlist')
    list.innerHTML = ''
    const groupName = document.getElementById("gorupNameHeader");
    if (groupName) {
      groupName.innerHTML = GroupName
    } else {
      console.error("Element with id 'gorupNameHeader' not found in the DOM");
    }
    localStorage.removeItem("messages")
    localStorage.setItem("groupId", id)
    latestMessageId = 0
    let groupId = localStorage.getItem("groupId")
    await getLocalMsgs()
    await allGroupMembers(groupId)
  } catch (err) {
    console.log(err);
  }
}

async function allGroups() {
  try {
    const newGroupRes = await axios.get(
      "http://localhost:3000/group/allgroups"
    )
    groupUI(newGroupRes.data);
  } catch (err) {
    console.log(err);
  }
}

async function allGroupMembers(id){
  try{
    const allMembersRes = await axios.get(`http://localhost:3000/group/togetAllusers?groupId=${id}`)
    let info = allMembersRes.data.members
    // const admin = info.find(user => user.isAdmin === true)
    console.log(info)
    userUI(info)
  }
  catch(err){
    console.log(err,'happend at allGroupMembers function')
  }
}

async function userUI(data){
  try{
    
    const loggedInUserName = localStorage.getItem('username')

    // const userContainer = document.getElementById("user-container");
    
    data.forEach(user => {
      const listItem = document.createElement("ul");
      listItem.classList.add("user-list", "li");
    
      const span = document.createElement("span");
      span.textContent = `${user.name}`;
    
      if (user.isAdmin === true && user.name === loggedInUserName) {
        const p = document.createElement("span");
        p.textContent = " - You are admin";
    
        listItem.appendChild(span);
        listItem.appendChild(p);
      }
      else if(user.isAdmin === true && user.name !== loggedInUserName){
        const p = document.createElement("span");
        p.textContent = " - admin";
    
        listItem.appendChild(span);
        listItem.appendChild(p);
      }
       else if (user.isAdmin === false) {
        const makeAdminButton = document.createElement("button");
        makeAdminButton.textContent = "Make Admin"
        makeAdminButton.addEventListener('click', function() {
          adminButton(user.userId);
        });
    
        const removeButton = document.createElement("button");
        removeButton.textContent = "X";
        removeButton.addEventListener('click', function() {
          deleteButton(user.userId);
        });
        listItem.appendChild(span);
        listItem.appendChild(makeAdminButton);
        listItem.appendChild(removeButton);
      } else {
        listItem.appendChild(span);
      }
    
      const userList = document.querySelector(".user-list");
      userList.appendChild(listItem);
    });
    

  } catch (err) {
    console.log(err, 'happend at userUI function')
  }
}

async function adminButton(id){
  try{
    const groupId = localStorage.getItem('groupId')
    console.log('clicked on admin button',id)
    const makeAdminRes = await axios.put(`http://localhost:3000/group/makeAdmin?userId=${id}&groupId=${groupId}`)
    console.log(makeAdminRes.status)
    if(makeAdminRes.status === 202){
      alert('Admin added successfully')
    }
  }
  catch(err){
    console.log(err.response.status,'hello')
    if(err.response.status === 401){
      alert('You are not this group Admin to make this operation')
    }
  }

}

async function deleteButton(id){
  try{
    console.log('clicked on delete button',id)
    const groupId = localStorage.getItem('groupId')
    const deleteRes = await axios.delete(`http://localhost:3000/group/deleteUser?userId=${id}&groupId=${groupId}`)
    console.log(deleteRes.status)
    if(deleteRes.status === 202){
      alert('user deleted successfully')
    }
  }
  catch(err){
    console.log(err.response.status,'hello')
    if(err.response.status === 401){
      alert('You are not allowed to delete user')
    }}
    
}



// Call the getAllChats function when the page loads or when needed
getAll();

// Set interval to fetch chats every 5 seconds (5000 milliseconds)
setInterval(getAll, 1000);