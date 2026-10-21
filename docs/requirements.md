# Project requirements

## Project

- **Title:** Smart Campus
- **Problem statement:** Campus members need a simple way to report cleaning needs in shared rooms and help return found items to their owners. These workflows are often split across informal channels, making requests and hand-offs hard to follow.
- **Objective:** Implement and demonstrate two functional modules with interface, server-side validation, persistent data, test cases, and defect-tracking preparation.
- **Selected modules:** On-demand Cleaning Service and Lost & Found Hub.
- **Intended users:** Students who submit reports or found-item posts; campus care staff represented by the request-completion action.

## Module 1 — On-demand Cleaning Service

**Description:** Students send a cleaning request for a named campus building, floor, and room or area. The service desk lists requests and allows a request to be marked complete.

**Functional requirements**

1. Require an issue description, building, floor, and room/area.
2. Reject blank required fields and enforce field-length limits in both the interface and API.
3. Create a unique request with a timestamp and `Open` status.
4. Display the new request first in the service desk and update the open-request count.
5. Allow a request to be marked `Completed`; update its status and the dashboard count.
6. Show confirmation when the API accepts a new request.

**Validation:** 100-character issue, 60-character room/area, and 240-character detail limits; required fields validated in the API.

## Module 2 — Lost & Found Hub

**Description:** Campus members post a found item to a visual board, search posts, and open an in-app demo conversation to claim an item.

**Functional requirements**

1. Require an item title and found location; select a category.
2. Optionally attach JPEG or PNG image up to 2 MB.
3. Add the post to the top of the board with finder, date, category, and `Available` status.
4. Search board entries by title, category, finder, or location.
5. Open an in-app conversation when a member claims an available item; store messages in the API data file and change the post to `Claimed`.
6. Display a clear post status and allow the conversation to be reopened.

**Validation:** 70-character title, 90-character location, and 240-character message limits; image type/size checked in the interface and image data checked by the API.

## Quality attributes and scope

- Responsive dark-blue interface for desktop and mobile, keyboard focus visibility, labeled controls, and status announcements.
- Frontend and backend are separate projects in `frontend/` and `backend/`; the Vite development server proxies API calls to Express.
- The Express API uses bearer-token demo sessions held in memory and persists demo tickets and posts in `backend/data/db.json`.
- No production authentication, password hashing, multi-user database, real janitor alerts, or real email/chat delivery is included.
- The supplied workbook contains seven test scenarios with recorded `PASS` results. The project test log identifies them as source-recorded; they still need to be executed against this implementation for fresh evidence.
