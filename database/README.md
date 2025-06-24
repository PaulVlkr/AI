# Database Schema

MongoDB collections used by the RUNYA backend.

## User
- `email`: String
- `password`: hashed string
- `profile.photo`: URL
- `profile.age`: Number
- `profile.height`: Number
- `profile.weight`: Number
- `profile.goals`: String

## Workout
- `userId`: reference to User
- `type`: String
- `duration`: Number (minutes)
- `calories`: Number
- `timestamp`: Date

## Meal
- `userId`: reference to User
- `name`: String
- `calories`: Number
- `timestamp`: Date
