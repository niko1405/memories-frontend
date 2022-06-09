const publicVapidKey = 'BJpCaZoP17AbXgvVBuux4AiKSg43F65Vx9GdCo3a6-KIg0_zYdo29Jvw8ZfjFugBXZP_KjnJQSolWejaKC125LM';

//Register service worker, Register Push, Send Push
export async function registerServiceWorker() {
    //register service worker
    const register = await navigator.serviceWorker.register('/worker.js');

    //register push
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    
    return subscription;
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }