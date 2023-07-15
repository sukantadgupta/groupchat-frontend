localStorage.clear()

function logInfunc(e){
    e.preventDefault()
    const logInData = {
        email :e.target.email.value,
        password : e.target.password.value,
    }

    dataFetch(logInData)
}

async function dataFetch(logInData){
    try{
        alert('Logged in successfully');
        const userLoginRes = await axios.post('http://localhost:3000/user/login',logInData)
        if(userLoginRes.status === 200){
            //alert('login successful')
            localStorage.setItem('username',userLoginRes.data.data.name)
            localStorage.setItem('token',userLoginRes.data.token)
            window.location = '../chat/chat.html'
        }
    }
    catch(err){
        console.log(err)
    }
}