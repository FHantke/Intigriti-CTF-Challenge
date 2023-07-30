export const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const lng = document.getElementById('lng').innerText;
        console.log("Try to load " + lng)
        const registration = await navigator.serviceWorker.register("/sw.js?lng="+lng, {
          scope: "/",
        });
        if (registration.installing) {
          console.log("Service worker installing");
        } else if (registration.waiting) {
          console.log("Service worker installed");
        } else if (registration.active) {
          console.log("Service worker active");
          registration.update();
        }
      } catch (error) {
        console.error(`Registration failed with ${error}`);
      }
    }
  };
  