import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from 'app/types/notification.type';
import { map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    _notifications: ReplaySubject<Notification[]> = new ReplaySubject<Notification[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for notifications
     */
    get notifications$(): Observable<Notification[]> {
        return this._notifications.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all notifications
     */
    getAll(): Observable<{ data: Notification[], pagination: any }> {
        return this._httpClient.get<{ data: Notification[], pagination: any }>('/api/notifications/admins').pipe(
            tap((result) => {
                this._notifications.next(result.data);
            }),
        );
    }

    /**
     * Create a notification
     *
     * @param notification
     */
    create(notification: Notification): Observable<Notification> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.post<Notification>('/api/notifications/send', { notification }).pipe(
                map((newNotification) => {
                    // Update the notifications with the new notification
                    this._notifications.next([...notifications, newNotification]);

                    // Return the new notification from observable
                    return newNotification;
                }),
            )),
        );
    }

    /**
     * Update the notification
     *
     * @param id
     * @param notification
     */
    update(id: string, notification: Notification): Observable<Notification> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.put<Notification>('/api/notifications/' + id, notification).pipe(
                map((updatedNotification: Notification) => {
                    // Find the index of the updated notification
                    const index = notifications.findIndex(item => item.id === id);

                    // Update the notification
                    notifications[index] = updatedNotification;

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated notification
                    return updatedNotification;
                }),
            )),
        );
    }

    /**
     * Delete the notification
     *
     * @param id
     */
    delete(id: string): Observable<boolean> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.delete<boolean>('/api/notifications/' + id).pipe(
                map((isDeleted: boolean) => {
                    // Find the index of the deleted notification
                    const index = notifications.findIndex(item => item.id === id);

                    // Delete the notification
                    notifications.splice(index, 1);

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead(): Observable<boolean> {
        return this.notifications$.pipe(
            take(1),
            switchMap(notifications => this._httpClient.get<boolean>('/api/notifications/mark-as-read/admins').pipe(
                map((isUpdated: boolean) => {
                    // Go through all notifications and set them as read
                    notifications.forEach((notification, index) => {
                        notifications[index].isRead = true;
                    });

                    // Update the notifications
                    this._notifications.next(notifications);

                    // Return the updated status
                    return isUpdated;
                }),
            )),
        );
    }
}
