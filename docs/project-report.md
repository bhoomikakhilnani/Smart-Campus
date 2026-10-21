# Project report

## Smart Campus

**Student:** Bhoomika Khilnani  
**Project type:** Individual Project-Based Learning  
**Selected modules:** On-demand Cleaning Service; Lost & Found Hub

## Abstract

Smart Campus is a full-stack prototype for two everyday campus workflows. Students can report a room that needs attention, follow requests through completion, post found items, search the community board, and message a finder. The project demonstrates a login interface, form and API validation, state changes, image handling, and persistent records.

## Problem and objectives

Cleaning reports and lost-item notices are often shared informally. This makes the next action and current status difficult to follow. The project aims to provide clear forms and a shared view for each workflow, then prepare requirements, test cases, defect tracking, and a live demonstration in line with the PBL rubric.

## Scope and system design

The implementation contains a demo login, an overview dashboard, the Cleaning Service, and the Lost & Found Hub. Cleaning requests store location, issue, status, and creation time. Found-item posts store title, category, location, optional image, finder, status, and conversation messages. The Express API persists records in a JSON file and holds demo bearer-token sessions in memory.

The React frontend is built with Vite; the Node.js and Express backend provides the API. `frontend/` and `backend/` are separate workspaces. The supplied workbook's two named modules define the implementation scope.

## Implementation summary

- **Cleaning Service:** validated request form, service-desk list, open-request count, completion action, and API-backed persistence.
- **Lost & Found:** item form, optional JPEG/PNG upload with size/type checks, searchable board, claim conversation, and API-backed status update.
- **Login:** sign-in page and prefilled demo account authenticated by the local Express API. Demo credentials and in-memory sessions are not production-grade security.
- **Project management and QA materials:** Jira-ready project plan and backlog, seven source-recorded test cases, additional validation checks, defect register, and final demo checklist.

## Testing and defects

The supplied workbook records TC_SC_001 through TC_SC_007 as PASS. These are retained as source results in `test-cases.md`; they are not presented as fresh test results for this implementation. Fresh browser execution was not completed in the creation environment. No defects are fabricated; the defect register states that fresh execution is still required and provides fields for Jira bug and retest evidence.

## Limitations and next steps

This classroom demo uses a local JSON data file, an in-memory session store, and a fixed demo account. It does not provide production authentication, a relational database, real janitor alerts, or real email/chat delivery. Next steps are to create the live Jira project in the student's account, run the listed cases in a browser, attach evidence, file and retest any defects, and prepare the final presentation.

## Conclusion

The prototype provides working interface flows for the two selected Smart Campus modules and organizes the documentation needed for an individual PBL demonstration. Live Jira setup and fresh browser test evidence remain course-side completion tasks.
