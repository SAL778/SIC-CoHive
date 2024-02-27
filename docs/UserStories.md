# User Stories

## US 1.01 - Assign Roles
As an admin, I want to be able to assign roles to users, so that I can control their access to features.

Acceptance Tests

1. Admin can assign a role to a user successfully.
2. Admin can assign multiple roles to a user successfully.
3. Admin cannot assign a role to a user that does not exist.
4. Admin cannot assign an invalid role to a user.
5. Admin cannot assign a duplicate role to a user.
6. User's access is restricted based on the assigned role.

## US 1.02 - Manage Profile
As a user, I want to create and manage my profile, including my basic information and academic details.

Acceptance Tests

1. User can successfully have a profile with basic information loaded from their google account.
2. User can add academic details to their profile.
3. User can update their academic details in the profile.
4. User cannot create a profile with invalid information.
5. Users can successfully delete their profile.

## US 1.03 - Admin Center Role
As an admin, I want to include additional information in my profile like innovation center role, so it can be visible on my profile.

Acceptance Tests

1. Admin can add the innovation center role to their profile successfully.
2. Admin can update the innovation center role in their profile.
3. Admin cannot add an invalid role to their profile.
4. Admin's profile displays the innovation center role.

## US 1.04 - User Portfolio
As a user, I want to upload text and link to a portfolio in my profile, so that prospective employers will see my capabilities.

Acceptance Tests

1. User can successfully upload text to their portfolio.
2. User can successfully upload links to their portfolio.
3. User can organize and manage items in their portfolio.
4. User cannot upload files with invalid formats to their portfolio.
5. User cannot upload unvetted links to their portfolio.

## US 1.05 - User Profile Search
As a user, I want to look up other users by using the search bar, so that I can find information about fellow SIC members

Acceptance Tests
1. User can successfully search other user.
2. User can successfully search organization.
3. User can successfully search admins. 

## US 1.06 - Portfolio Visibility
As a user, I want to be able to change the visibility of my portfolio, so that I can control if everyone/organizations/only me can see it.

Acceptance Tests

1. User can successfully set portfolio visibility to everyone.
2. User can successfully set portfolio visibility to organizations only.
3. User can successfully set portfolio visibility to only themselves.
4. Portfolio is displayed according to the selected visibility settings.
5. User cannot set portfolio visibility of others.

## US 1.07 - Assign Access Labels
As an admin, I want to approve AccessType Labels for users like "podcast studio", so that they can access restricted resources/rooms.

Acceptance Tests

1. Admin can approve UserType Labels for users successfully.
2. Users with approved UserType Labels gain access to the associated resources/rooms.
3. Admin can reject UserType Labels and deny access to associated resources/rooms.

## US 1.08 - Admin Manage Users
As an admin, I want to be able to disable/delete users or change their roles, so that I can prevent abuse of the system.

Acceptance Tests

1. Admin can successfully disable/delete a user account.
2. Admin can change the role of a user account.
3. Users experience appropriate access changes based on role modifications.
4. Deletion or role changes are logged for auditing purposes.
5. Users will be notified of their role change.

## US 2.01 - View My Bookings
As a user, I want to view my current bookings, so that I can review my bookings and cancel them if needed.

Acceptance Tests

1. User can view a list of their current bookings.
2. User can review details such as resource name, room number, and booking details.
3. User can cancel a booking successfully.

## US 2.02 - Create Asset Fields
As an admin, I want to provide the "name" of the resource, "room number", "details", "image" and "room code" description, so that resources follow a format.

Acceptance Tests

1. Admin can add a resource with a specified name, room number, and details.
2. Admin can edit the name, room number, and details of an existing resource.
3. Resources must display the specified name, room number, and details consistently.

## US 2.03 - Manage Assets
As an admin, I want to have the ability to manage assets or meeting rooms, so that assets and rooms can be added, deleted or put on maintenance.

Acceptance Tests

1. Admin can add a new asset or meeting room successfully.
2. Admin can delete an existing asset or meeting room successfully.
3. Admin can mark an asset or meeting room as under maintenance.
4. Deleted assets or rooms no longer appear in the booking system.
5. Rooms under maintenance will appear in the booking system, but will be unaccessible for the duration of the maintenance.

## US 2.04 - Restrict Asset Access
As an admin, I want to restrict certain assets to users with special AccessType Labels, so that important assets are protected.

Acceptance Tests

1. Admin can assign UserType Labels to specific assets successfully.
2. Users with the required UserType Label can book and access restricted assets.
3. Users without the required UserType Label cannot book or access restricted assets.

## US 2.05 - Admin Delete Bookings 
As an admin, I want to be able to delete the bookings of users, so that I can prevent abuse of the system.

Acceptance Tests

1. Admin can view a list of all bookings.
2. Admin can delete a specific booking successfully.
3. Deleted bookings no longer appear in the user's booking history.
4. Users will be notified of the deleted booking.

## US 2.06 - Create a Booking
As a user, I want to book a room or a resource, so that I can reserve it for myself on the website.

Acceptance Tests

1. User can search and find available rooms or resources.
2. User can select a specific time slot for the booking.
3. User receives confirmation of the successful booking.
4. User cannot book an occupied room or resource.

## US 2.07 - Recurring Bookings
As a user, I want to book a room at reoccurring times (daily, weekly, monthly, yearly), so that I can ensure I always have a consistent schedule.

Acceptance Tests

1. User can set up a recurring booking for a specific room.
2. User can modify or cancel recurring bookings as needed.
3. The booking system accurately reflects the recurring schedule on the calendar.
4. User cannot book the reoccuring timeslots if atleast one timeslot is already occupied.

## US 3.01 - Approve Events
As an admin, I want to approve Events submitted by organizations, so that I can control which organizations may host their Event.

Acceptance Tests

1. Admin can view a list of Events submitted by organizations.
2. Admin can approve Events, allowing them to be displayed on the Events Calendar.
3. Admin can reject Events, preventing them from being shown on the Events Calendar.

## US 3.02 - Submit Events
As an organization, I want to submit my Events on the website, so that I can host my Event at the center.

Acceptance Tests

1. Organization can submit event details, including name, room number, date(s), organization, and details.
2. Organization receives confirmation of successful event submission.
3. Organization is notified of approval or rejection by the admin.
4. Validation ensures that all required details are provided before an event is added.

## US 3.03 - Admin Manage Events
As an admin, I want to add and manage events through the website, so that users can view events and their details.

Acceptance Tests

1. Admin can add a new event with specified details (name, room number, date(s), organization, details).
2. Admin can edit the details of an existing event.
3. Admin can delete an event successfully.
4. Deleted events no longer appear on the Events Calendar.
5. Respective Organizations will be notified of deleted events.

## US 3.04 - Integrate Google Calendar
As an admin, I want to integrate Google Calendar with Events Calendar, so that both calendars can be synced.

Acceptance Tests

1. Admin can initiate the integration process with Google Calendar.
2. Events added to the Events Calendar are automatically synchronized with Google Calendar.
3. Changes made in Google Calendar are reflected in the Events Calendar on the website.

## US 3.05 - Create Event Fields
As an admin, I want to provide the "name" of the event, "room number", "date(s)", "organization" and "details", so that events follow a consistent format.

Acceptance Tests

1. Admin is prompted to enter the name, room number, date(s), organization, and details when adding a new event.
2. Events displayed on the calendar adhere to the specified format consistently.
3. Validation ensures that all required details are provided before an event is added.

## US 4.01 - Analytics Tab
As an admin, I want to collect analytics, so that all users can view usage hours, peak times, and the popularity of different technologies and rooms.

Acceptance Tests

1. Users can navigate to the "Insights" tab on the website.
2. The "Insights" tab displays usage hours, peak times, and the popularity of various technologies and resources.
3. Insights are presented in a clear and understandable format.

## US 4.02 - Admin Download Analytics
As an admin, I want to download Analytics from the "Insights" tab as a CSV/XLS file so that I can optimize the center's operations more effectively.

Acceptance Tests

1. Admin can access the "Insights" tab on the website.
2. The "Insights" tab displays usage hours, peak times, and the popularity of various technologies and resources.
3. Insights are presented in a clear and understandable format.
4. Admin can select desired analytics data to download.
5. Admin can download analytics data in CSV or XLS format successfully.
6. Downloaded analytics file contains accurate and relevant data.

## US 4.03 - Admin Download Email List
As an admin, I want to download the Email list of all users, so that I can view and find all users with a specific Gmail domain.

Acceptance Tests
1. Admin can download the Email list of all users.
2. Downloaded Email list contains accurate and relevant data.
3. Downloaded Email list is in a CSV or XLS format.
4. Downloaded Email list contains all user Email addresses grouped by their Gmail domain.

## US 5.01 - Web Notifications
As an admin, I want to send notifications on the website to the mailbox of all users, so that they can be notified not only through Email.

Acceptance Tests

1. Admin can compose and send notifications from the admin dashboard.
2. Notifications are delivered to the mailbox of all users on the website.
3. Users receive notifications in their website mailbox.

## US 5.02 - Send Email Notifications
As an admin, I want to send Email notifications to users, so that they can be informed about the latest updates, events, and opportunities related to the center.

Acceptance Tests

1. Admin can compose and send Email notifications from the admin dashboard.
2. Email notifications are sent to users' registered Email addresses.
3. Email notifications contain relevant information about updates, events, and opportunities.

## US 5.03 - Optional Notification
As an admin, I want to have the option to check whether they want to notify users on an update, so that some updates do not send a notification.

Acceptance Tests

1. Admin has the option to enable or disable notifications for specific updates.
2. Admin can select which updates trigger notifications to users.
3. Notification settings are saved and applied accurately.

## US 5.04 - Toggle Notifications
As a user, I want to have the option to toggle which types of notifications I receive, so that I get the information important to me.

Acceptance Tests

1. Users can access notification settings from their profile settings.
2. Users can toggle different types of notifications on or off.
3. Changes to notification settings are saved and applied successfully.
4. Users receive only the notifications they have opted to receive.

## US 6.01 - Collect Feedback
As an admin, I want to collect feedback and manage the Feedback Form, so that I can review feedback from my users.

Acceptance Tests

1. Admin can access and view collected feedback from users.
2. Feedback data includes information about feedback, reported issues, and support requests.
3. Feedback entries are organized and presented in a clear format.

## US 7.01 - Sign Up Google Auth
As a user, I want to sign up/in using my Gmail account, so that accessing SIC does not require extra credentials.

Acceptance Tests

1. User can sign up using their @ualberta.ca email address.
2. User can sign in using their @ualberta.ca credentials.
3. Users without @ualberta.ca email addresses cannot sign up.
4. User cannot sign in with incorrect @ualberta.ca credentials.
5. The integration provides a seamless and secure sign-up/in process using @ualberta.ca accounts.

## US 8.01 - Submit Opportunities
As a user, I want to submit entrepreneurial thinking placements, so that other users can view the opportunities available.

Acceptance Tests

1. Users can access the application portal on the website.
2. Users can browse and view available entrepreneurial thinking placements.
3. Users can submit applications for specific placements.
4. Users can upload relevant documents, such as a CV, during the application process.

## US 8.02 - Manage Opportunities
As an admin, I want to be able to manage the application/job portal placements, so that I can approve which placements are appropriate.

Acceptance Tests

1. Admin can access and review submitted applications in the admin dashboard.
2. Admin can approve or reject applications based on appropriateness.
3. Approved placements are displayed on the application portal for users.

## US 8.03 - Upload CV
As a user, I want to upload a CV document to my profile, so that it can be used when I apply for placements on the application/job portal.

Acceptance Tests

1. Users can access their profile settings on the website.
2. Users can upload a CV document to their profile.
3. The uploaded CV is associated with the user's profile and can be used during placement applications.

## US 8.04 - View Applicants
As a user, I want to review and download the profiles and the CVs of applicants, so that I can select candidates for my placements.

Acceptance Tests

1. Users can access a list of applicants for a specific placement.
2. Users can view the profiles and CVs of applicants.
3. Users can make informed decisions based on applicant profiles and CVs.
4. Users can download applicant CVs for further review.

## US 8.05 - Manage Applications
As a user, I want to view and manage my current applications/placements, so that I can review my applications, withdraw them or delete my placements.

Acceptance Tests

1. Users can access a list of their current applications/placements on the website.
2. Users can view details of their submitted applications.
3. Users can withdraw an application or delete a placement if needed.
4. The application portal accurately reflects the status of user applications and placements.

## US 8.06 - Apply to Opportunities
As a user, I want to apply to internships on the application/job portal, so that my information and resume are sent to the company that is hosting the internship.

Acceptance Tests
1. Users can view and apply to internships on the website.
2. Users can upload files to be sent to the company hosting the internship.
3. Users cannot submit an application with missing required fields.
4. Users will be notified that application was succesful upon valid submission.
