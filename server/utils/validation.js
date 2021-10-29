const validate = (input,data) => {
    switch (input) {
        case "userName":
            var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return re.test(String(data).toLowerCase());
        case "firstName":
            var re = /^[A-Za-z]+$/
            return re.test(data)
        case "lastName":
            var re = /^[A-Za-z]+$/
            return re.test(data)
        case "password":
            var re = /^[A-Za-z]+$/
            return re.test(data)
    }
}

//field validator
const compare = (key) => {
    const compare = ["firstName","lastName","password"]
    let count = 0
    for (k in key){
        if (compare.includes(k)){
            count += 1
        }
    }   
    return count == Object.keys(key).length
}

const compare2 = (key) => {
    const compare = ["firstName","lastName","password","userName"]
    let count = 0
    for (k in key){
        if (compare.includes(k)){
            count += 1
        }
    }   
    return count == Object.keys(key).length
}

const compare3 = (key) =>{
    const compare = ['png','jpg','jpeg','gif'];
    if (compare.includes(key)){
        return true;
    }else{
        return false;
    }

}
module.exports = {
    validate,compare, compare2, compare3
}