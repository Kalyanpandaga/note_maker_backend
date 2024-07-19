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
Create Note: POST /notes
Get User Notes: GET /notes
Get Archived Notes: GET /notes/archived
Get Trashed Notes: GET /notes/trashed
Archive Note: PUT /notes/:id/archive
Trash Note: PUT /notes/:id/trash
Unarchive Note: PUT /notes/:id/unarchive
Untrash Note: PUT /notes/:id/untrash
Update Note: PUT /notes/:id
Search Notes: GET /notes/search?query=<query>
```
# Tags
```
Create Tag: POST /tags
```
