import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { mergeMapTo } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { NotificationsService } from './layout/common/notifications/notifications.service';
import { Notification } from './types/notification.type';

@Injectable({ providedIn: 'root' })
export class AppService {
    notifications: Notification[] = [];

    constructor(
        private _messaging: AngularFireMessaging,
        private _authService: AuthService,
        private _notificationService: NotificationsService,
    ) {
        this._notificationService.notifications$.subscribe(notifications => {
            this.notifications = notifications;
        })
    }

    public requestPermission() {
        this._messaging.requestPermission
            .pipe(mergeMapTo(this._messaging.tokenChanges))
            .subscribe(
                (token) => {
                    var accessToken = localStorage.getItem('accessToken');
                    if (accessToken && token) {
                        this._authService.registerDeviceToken(token).subscribe();
                    }
                },
                (error) => { console.error(error); },
            );
    }

    public listenServiceWorker() {
        this._messaging.messages.subscribe((event: any) => {

            var newNotification = {
                id: event.messageId,
                title: event.notification.title,
                body: event.notification.body,
                isRead: event.data.isRead,
                createAt: event.createAt,
                type: event.data.type,
                link: event.data.link
            };

            var currentNotifications = this.notifications;
            var notifications = currentNotifications ? [newNotification, ...currentNotifications] : [newNotification];
            console.warn(notifications);

            this._notificationService._notifications.next(notifications);
        });
    }
}