# HackFlow API Reference

**Base paths:** `/api/auth` · `/api/users` · `/api/teams` · `/api/hackathons` · `/admin`

**Legend**
| Symbol | Meaning |
|--------|---------|
| 🔒 | Requires `VerifyJWT` (valid access token) |
| 🔒👑 | Requires `VerifyJWT` + `isAdmin` |

---

## Table of Contents

### Auth — `authRoutes.js`
| Method | Route | Auth | Description |
|--------|-------|------|--------------|
| POST | [`/login`](#post-login) | — | Authenticate and receive session cookies |
| POST | [`/signup`](#post-signup) | — | Register a new account (pending admin approval) |
| GET | [`/getuser`](#get-getuser) | 🔒 | Get the current authenticated user |
| GET | [`/logout`](#get-logout) | 🔒 | Clear session cookies |

### Users — `userRoutes.js`
| Method | Route | Auth | Description |
|--------|-------|------|--------------|
| GET | [`/allusers`](#get-allusers) | 🔒 | List all users |
| PATCH | [`/update/profile`](#patch-updateprofile) | 🔒 | Update own profile |
| GET | [`/user/:userId`](#get-useruserid) | 🔒 | Get a user by ID |
| GET | [`/delete/:userId`](#get-deleteuserid) | 🔒 | Delete a user (self or admin) |

### Teams — `teamRoutes.js`
| Method | Route | Auth | Description |
|--------|-------|------|--------------|
| POST | [`/addteam`](#post-addteam) | 🔒 | Create a team |
| GET | [`/teams/:hackid`](#get-teamshackid) | 🔒 | List teams for a hackathon |
| GET | [`/deleteteam/:id`](#get-deleteteamid) | 🔒 | Delete a team (leader or admin) |
| GET | [`/team/:id`](#get-teamid) | 🔒 | Get a team by ID |
| POST | [`/team/:id/members`](#post-teamidmembers) | 🔒 | Add member(s) to a team |
| DELETE | [`/team/:id/members/:userId`](#delete-teamidmembersuserid) | 🔒 | Remove a member (leader or admin) |

### Hackathons — `hackRoutes.js`
| Method | Route | Auth | Description |
|--------|-------|------|--------------|
| POST | [`/addhackathon`](#post-addhackathon) | 🔒 | Create a hackathon |
| GET | [`/hackathons`](#get-hackathons) | 🔒 | List all hackathons |
| GET | [`/hackathon/:id`](#get-hackathonid) | 🔒 | Get a hackathon by ID |
| POST | [`/hackathon/update/:id`](#post-hackathonupdateid) | 🔒 | Update a hackathon (creator only) |
| GET | [`/hackathon/delete/:id`](#get-hackathondeleteid) | 🔒 | Delete a hackathon (creator or admin) |
| GET | [`/hackathon/pdf/:id`](#get-hackathonpdfid) | 🔒 | Download a single-hackathon PDF report |
| POST | [`/hackathons/pdf/combined`](#post-hackathonspdfcombined) | 🔒 | Download a combined multi-hackathon PDF |
| GET | [`/me/hackathons`](#get-mehackathons) | 🔒 | List hackathons the current user is teamed on |

### Admin — `adminRoutes.js`
| Method | Route | Auth | Description |
|--------|-------|------|--------------|
| GET | [`/users/pending`](#get-userspending) | 🔒👑 | List pending signup requests |
| GET | [`/users`](#get-users) | 🔒👑 | List all approved members |
| PATCH | [`/users/:id/approve`](#patch-usersidapprove) | 🔒👑 | Approve a pending user |
| PATCH | [`/users/:id/reject`](#patch-usersidreject) | 🔒👑 | Reject a pending user |

### [Known Issues](#known-issues)

---

## Auth Routes

### <a id="post-login"></a>`POST /login`

**Request Body**
```json
{ "email": "string", "password": "string" }
```

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | `{ "_id", "name", "email", "role", "status", "profilePicture" }` | Sets `accessToken` & `refreshToken` as httpOnly cookies |
| 401 | `{ "errors": ["Invalid email or password"] }` | |
| 403 | `{ "errors": ["Your account is awaiting admin approval."] }` | account status is `pending` |
| 403 | `{ "errors": ["Your signup request was rejected."] }` | account status is `rejected` |
| 500 | `{ "errors": ["Server error"] }` | |

---

### <a id="post-signup"></a>`POST /signup`

**Request Body**
```json
{ "name": "string", "email": "string", "password": "string", "confirmPassword": "string" }
```
Password must be ≥8 characters with at least one lowercase letter, one uppercase letter, and one special character. `confirmPassword` must match `password`.

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | `{ "_id", "message": "Signup request received..." }` | Account created with `status: "pending"`; login is blocked until an admin approves |
| 401 | `{ "errors": [validation messages] }` | |
| 422 | `{ "errors": "user did not created" }` | |

---

### <a id="get-getuser"></a>`GET /getuser` 🔒

**Request Body:** none

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "user": {...} }` |
| 401 | `{ "errors": "Not authenticated" }` |

---

### <a id="get-logout"></a>`GET /logout` 🔒

**Request Body:** none

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | `{ "message": "Logged out successfully" }` | Clears both auth cookies |

---

## User Routes

### <a id="get-allusers"></a>`GET /allusers` 🔒

**Request Body:** none

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | `{ "users": [...] }` | No filtering by status or role |

---

### <a id="patch-updateprofile"></a>`PATCH /update/profile` 🔒

**Request Body** (all fields optional — updates the authenticated user only)
```json
{ "name": "string", "email": "string", "profilePicture": "string", "linkedin": "string", "github": "string" }
```

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "Profile updated successfully", "user": {...} }` |
| 400 | `{ "message": "Validation failed", "errors": [...] }` |
| 404 | `{ "message": "User not found" }` |
| 409 | `{ "message": "Email already in use" }` |

---

### <a id="get-useruserid"></a>`GET /user/:userId` 🔒

**Request Body:** none

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "user": {...} }` |
| 404 | `{ "message": "User not found" }` |

---

### <a id="get-deleteuserid"></a>`GET /delete/:userId` 🔒

**Request Body:** none
**Authorization:** requester must be the target user or have `role: "admin"`

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "User deleted successfully" }` |
| 401 | `{ "message": "Unauthorized" }` |
| 403 | `{ "message": "Forbidden: cannot delete this user" }` |
| 404 | `{ "message": "User not found" }` |

---

## Team Routes

### <a id="post-addteam"></a>`POST /addteam` 🔒

**Request Body**
```json
{
  "name": "string",
  "hackathonId": "string",
  "maxMembers": "number",
  "createdBy": "string",
  "members": ["userId", "..."]
}
```
The caller (`req.user._id`) is auto-assigned the `"Leader"` role if included in `members`.

**Responses**

| Status | Body |
|--------|------|
| 201 | `{ "message": "Team created successfully", "team": {...} }` |
| 400 | `{ "message": "name, hackathonId and createdBy are required" }` |
| 400 | `{ "message": "Number of members cannot exceed maxMembers" }` |
| 500 | `{ "message": "Failed to create team", "error": "..." }` |

---

### <a id="get-teamshackid"></a>`GET /teams/:hackid` 🔒

**Request Body:** none

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "Teams fetched successfully", "teams": [...] }` |
| 400 | `{ "message": "Provide hackid as param" }` |

---

### <a id="get-deleteteamid"></a>`GET /deleteteam/:id` 🔒

**Request Body:** none
**Authorization:** requester must be the team leader or have `role: "admin"`

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | `{ "message": "Deleted Team" }` | |
| 404 | `{ "message": "Team not found" }` | |
| 404 | `{ "message": "You are not Authorized" }` | ⚠️ should be `403` — see [Known Issues](#known-issues) |

---

### <a id="get-teamid"></a>`GET /team/:id` 🔒

**Request Body:** none

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | `{ "message": "Team fetched successfully", "team": {...} }` | `createdBy` and `members.userId` are populated |
| 400 | `{ "message": "Provide team_id as param" }` / `"Invalid team id"` | |
| 404 | `{ "message": "Team not found" }` | |

---

### <a id="post-teamidmembers"></a>`POST /team/:id/members` 🔒

**Request Body**
```json
{ "name": "string (optional)", "members": ["userId", "..."] }
```
Duplicate IDs and members already on the team are filtered out automatically.

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "Team updated successfully", "team": {...} }` |
| 404 | `{ "message": "Team not found" }` |

---

### <a id="delete-teamidmembersuserid"></a>`DELETE /team/:id/members/:userId` 🔒

**Request Body:** none
**Authorization:** requester must be the team leader or have `role: "admin"`

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "Member removed", "team": {...} }` |
| 403 | `{ "message": "You are not Authorized" }` |
| 404 | `{ "message": "Team not found" }` / `"Member not found"` |
| 400 | `{ "message": "Cannot remove the team leader" }` / `"A team must have at least one member"` |

---

## Hackathon Routes

### <a id="post-addhackathon"></a>`POST /addhackathon` 🔒

**Request Body**
```json
{
  "name": "string",
  "website": "string",
  "registrationDeadline": "date string",
  "startDate": "date string",
  "endDate": "date string",
  "location": "string",
  "description": "string",
  "tracks": [],
  "teamSize": "number",
  "registrationFee": "number"
}
```
`createdBy` is set server-side from `req.user._id`.

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 201 | the created hackathon object | returned directly, not wrapped in a key |
| 400 | `{ "message": "Validation failed", "errors": [...] }` | |
| 402 | `{ "message": "error in creating hackathon" }` | |

---

### <a id="get-hackathons"></a>`GET /hackathons` 🔒

**Request Body:** none

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "hackathons": [...] }` |
| 400 | `{ "message": "Error in geeting Hackathons" }` |

---

### <a id="get-hackathonid"></a>`GET /hackathon/:id` 🔒

**Request Body:** none

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | `{ "message": "Got the hackathon", "hackathon": {...} }` | |
| 400 | `{ "message": "No id send by client" }` | |
| — | throws `"No hackathon found with this id"` | not found, surfaces as `500` |

---

### <a id="post-hackathonupdateid"></a>`POST /hackathon/update/:id` 🔒

**Request Body** (all fields optional — partial update)
```json
{
  "name", "website", "registrationLink", "registrationDeadline",
  "startDate", "endDate", "location", "mode", "description",
  "tracks", "teamSize", "prizePool", "registrationFee", "banner"
}
```
**Authorization:** requester must be `hackathon.createdBy`

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "Hackathon updated successfully", "hackathon": {...} }` |
| 403 | `{ "errors": ["Not authorized to update this hackathon"] }` |
| 404 | `{ "errors": ["Hackathon not found"] }` |
| 400 | `{ "errors": [validation/cast messages] }` |
| 500 | `{ "errors": ["Something went wrong"] }` |

---

### <a id="get-hackathondeleteid"></a>`GET /hackathon/delete/:id` 🔒

**Request Body:** none
**Authorization:** requester must be `hackathon.createdBy` or have `role: "admin"`

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "Hackathon deleted successfully" }` |
| 403 | `{ "errors": ["Not authorized to delete this hackathon"] }` |
| 404 | `{ "errors": ["Hackathon not found"] }` |
| 400 | `{ "errors": ["Invalid hackathon id"] }` |
| 500 | `{ "errors": ["Something went wrong"] }` |

---

### <a id="get-hackathonpdfid"></a>`GET /hackathon/pdf/:id` 🔒

**Request Body:** none

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | binary PDF stream | `Content-Type: application/pdf`, `Content-Disposition: attachment` |
| 4xx/500 | `{ "message": "..." }` | only if generation fails before headers are sent |

---

### <a id="post-hackathonspdfcombined"></a>`POST /hackathons/pdf/combined` 🔒

**Request Body**
```json
{ "hackathonIds": ["id1", "id2", "..."] }
```

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | binary combined PDF stream | `X-Skipped-Hackathons` header lists any IDs that failed to fetch |
| 400 | `{ "message": "hackathonIds must be a non-empty array" }` | |
| 404 | `{ "message": "None of the requested hackathons were found" }` | |
| 500 | `{ "message": "Failed to generate PDF", "error": "..." }` | |

---

### <a id="get-mehackathons"></a>`GET /me/hackathons` 🔒

**Request Body:** none

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "success": true, "data": [ { "hackathon": {...}, "team": { "_id", "name", "role", "memberCount", "maxMembers" } } ] }` |

---

## Admin Routes

All routes below require 🔒👑 (`VerifyJWT` + `isAdmin`).

### <a id="get-userspending"></a>`GET /users/pending`

**Request Body:** none

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "Got pending signup requests", "users": [...] }` |

---

### <a id="get-users"></a>`GET /users`

**Request Body:** none

**Responses**

| Status | Body | Notes |
|--------|------|-------|
| 200 | `{ "message": "Got all members", "users": [...] }` | only `status: "approved"` |

---

### <a id="patch-usersidapprove"></a>`PATCH /users/:id/approve`

**Request Body:** none

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "User approved", "user": {...} }` |
| 404 | `{ "message": "User not found" }` |
| 400 | `{ "message": "User is already <status>" }` |

---

### <a id="patch-usersidreject"></a>`PATCH /users/:id/reject`

**Request Body:** none

**Responses**

| Status | Body |
|--------|------|
| 200 | `{ "message": "User rejected", "user": {...} }` |
| 404 | `{ "message": "User not found" }` |
| 400 | `{ "message": "User is already <status>" }` |

---

## <a id="known-issues"></a>Known Issues

Found while cross-referencing routes against controller implementations:

1. **`GET /deleteteam/:id`** returns `404` for an authorization failure instead of `403` — the `deleteTeam` controller sets `err.status = 404` on the "not authorized" branch.
2. **`deleteTeam` leader lookup bug:** `team.members.find((m) => m.role="Leader")` uses assignment (`=`) instead of comparison (`===`), so it always matches the first member regardless of actual role.
3. **`deleteTeam` authorization check** uses the bitwise `&` operator instead of logical `&&` (`req.user._id != leader & req.user.role != "admin"`) — currently works by coincidence on boolean operands but should be corrected.
4. **Delete-via-`GET`** is used for `/delete/:userId`, `/deleteteam/:id`, and `/hackathon/delete/:id`. Destructive actions should use the `DELETE` HTTP verb to avoid accidental triggering via prefetching or crawlers.
5. **`addTeam`** trusts `createdBy` from the request body instead of deriving it from `req.user._id` (it already derives `leader_id` correctly for role assignment) — a client can spoof team ownership by sending an arbitrary `createdBy`.
6. **`GET /allusers`** has no role restriction, unlike the dedicated `/admin/users` route — any authenticated user can list every user's full record.