export class UserService {
    constructor() {
        // this would be where you create the User data to utilize later   
      
        this.isLoggedIn = false
        this.apiKey = ""
        this.lng = "en"

        const tokenString = sessionStorage.getItem('apiKey');       
        const apiKey = JSON.parse(tokenString); 
        if (apiKey && apiKey !== "") {
            this.isLoggedIn = true
        }
        
    }
  
    setIsLoggedIn(loggedIn) { this.isLoggedIn = loggedIn }
    setApiKey(apiKey) { this.apiKey = apiKey }
    setLng(lng) { 
        this.lng = lng;
        document.getElementById("lng").innerText = lng;
     }

    loginUser(apiKey) {
        this.setIsLoggedIn(true)
        this.setApiKey(apiKey)
        sessionStorage.setItem('apiKey', JSON.stringify(apiKey));
    
    }
    
    logoutUser() {
        console.log("Logout")
        console.log(this)
        this.setIsLoggedIn(false)
        sessionStorage.clear()
    }
  }