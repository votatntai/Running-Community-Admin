importScripts('https://www.gstatic.com/firebasejs/9.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCWLPlNMYG0YBwUhF0p5FL6Xn9KC9NKjQg",
    authDomain: "running-community-82f91.firebaseapp.com",
    projectId: "running-community-82f91",
    storageBucket: "running-community-82f91.appspot.com",
    messagingSenderId: "541250117932",
    appId: "1:541250117932:web:7e4f7b9aad5a19cc684c89",
    measurementId: "G-D8ERDMYWJG"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.getNotifications().then((notifications) => {
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/assets/images/logo/logo.png',
            renotify: false,
            timestamp: Date.now()
        };
        // Kiểm tra xem có thông báo nào đang được hiển thị hay không
        if (notifications.some(notification => notification.title === notificationTitle && notification.body === notificationOptions.body)) {
            return;
        }
        // Hiển thị thông báo nếu không có thông báo nào đang được hiển thị
        self.registration.showNotification(notificationTitle, notificationOptions);
    });
});