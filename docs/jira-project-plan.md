# Jira project plan

This is a Jira-ready setup and backlog for the individual PBL. It does not create a live Jira project; create the project in the student's Jira account and record its URL and key in the execution record before evaluation.

## Project setup

- **Project name:** Smart Campus
- **Suggested project key:** SCAMPUS
- **Project type:** Scrum / team-managed (or the closest available individual Scrum project template)
- **Description:** Individual PBL implementation of On-demand Cleaning Service and Lost & Found Hub, with test execution and defect tracking.
- **Project owner / assignee:** Bhoomika Khilnani
- **Components:** Cleaning Service; Lost & Found
- **Labels:** `pbl`, `smart-campus`, `module-cleaning`, `module-lost-found`, `testing`
- **Suggested workflow:** To Do → In Progress → In Review → Done; bugs additionally use Reopened and Resolved where available.

## Epics and user stories

### Epic SCAMPUS-EP1 — Cleaning Service

- **SCAMPUS-1 — Submit a cleaning request** (Story, P1): As a student, I want to identify a room and cleaning issue so that the campus team can respond. Acceptance: required fields validate; a new timestamped Open request appears first in the desk; a confirmation is shown.
- **SCAMPUS-2 — Track and complete requests** (Story, P1): As a campus care team member, I want to see open requests and close completed work so that request status stays current. Acceptance: requests display location and status; completing a request changes it to Completed and updates the open count.

### Epic SCAMPUS-EP2 — Lost & Found Hub

- **SCAMPUS-3 — Publish a found item** (Story, P1): As a finder, I want to post an item's details and optional photo so that its owner can recognize it. Acceptance: title and location are required; JPEG/PNG up to 2 MB is accepted; invalid type or size is rejected; post appears at the top of the board.
- **SCAMPUS-4 — Find and claim an item** (Story, P1): As an owner, I want to search posts and contact the finder so that I can recover my item. Acceptance: search matches item details and locations; claiming opens a conversation; a sent message persists and post status changes to Claimed.

### Epic SCAMPUS-EP3 — Testing and PBL Evidence

- **SCAMPUS-5 — Execute module test cases** (Task, P1): Run TC_SC_001–TC_SC_007 plus boundary, persistence, and search checks; record actual results and evidence.
- **SCAMPUS-6 — Track and retest defects** (Task, P1): Create a Jira bug for every failed case, record reproduction steps/severity/status/resolution, fix it, and link the retest.
- **SCAMPUS-7 — Prepare demonstration** (Task, P2): Demonstrate requirements, backlog, sprint, both modules, source, test results, defect fixes, and final working app.

## Suggested tasks and subtasks

Under **SCAMPUS-1**: build request form; validate required location and issue; persist ticket; render service desk and confirmation.

Under **SCAMPUS-2**: add completion action; update status and dashboard counts; verify completed-state display.

Under **SCAMPUS-3**: build post form and image picker; validate required details and image constraints; persist post; render board card.

Under **SCAMPUS-4**: add search; implement claim conversation; persist messages; verify claimed state and reopening.

Under **SCAMPUS-5 / SCAMPUS-6**: execute test cases; attach screenshots or screen recording; file and link bugs; fix and retest each defect.

## Suggested sprint

Create one individual **Smart Campus PBL Sprint** with a duration selected to match the course schedule (for example, one week). Add SCAMPUS-1 through SCAMPUS-7 to the sprint; order implementation stories before test execution and demonstration. Assign all issues to Bhoomika Khilnani. Move each card as work progresses, add a short sprint goal (“Deliver and validate two Smart Campus modules”), and capture the sprint board and completion report for the demonstration. Do not enter dates until the actual class schedule is known.

## Jira execution record

| Field | Complete during Jira setup |
|---|---|
| Jira project URL | ______________________________ |
| Created project key | ______________________________ |
| Sprint name and dates | ______________________________ |
| Issue IDs after creation | ______________________________ |
| Screenshots / evidence location | ______________________________ |
