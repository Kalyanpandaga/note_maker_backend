# Note Maker Backend

A backend service for managing notes with features like creating, updating, archiving, trashing, and searching notes. The service uses Node.js with Sequelize and SQLite.

## Features

- **User Authentication**: Secure API access with the access token.
- **Notes Management**: Create, update, archive, trash, and untrash notes.
- **Tag Management**: Create and associate tags with notes.
- **Search Functionality**: Search notes by title, including archived and unarchived notes.
- **Database**: SQLite.

## Prerequisites

- Node.js (v20.15.0 or higher)
- SQLite

## Installation

1. Clone the repository:
   ```bash
   git clone "https://github.com/Kalyanpandaga/note_maker_backend/"
   cd note_maker_backend
   
2. Install dependencies:
   ```bash
   npm install

3. start server:
   ```bash
    npm start


## API Endpoints
# Notes
```
Create Note: POST /note/create
Get User Notes: GET /user/notes
Get Archived Notes: GET /user/archived/notes
Get Trashed Notes: GET /user/trashed/notes
Archive Note: PUT /note/:id/archive
Trash Note: PUT /note/:id/trash
Unarchive Note: PUT /note/:id/unarchive
Untrash Note: PUT /note/:id/untrash
Update Note: PUT /note/:id/update
Search Notes: GET /notes/search?query=<query>
```
# Tags
```
Create Tag: POST /tags
```
