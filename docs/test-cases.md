# Test cases and results

The scenarios, test data, expected results, actual results, and original status below are transcribed from the supplied project workbook. **The recorded `PASS` statuses are source-workbook results, not a claim that these cases were freshly run against the included browser demo.** Re-run them in the demo and update the execution fields before presenting the implementation as tested.

| Test case ID | Module | Scenario / technique | Test data | Steps | Expected result | Actual result recorded in source | Source status | Fresh demo run |
|---|---|---|---|---|---|---|---|---|
| TC_SC_001 | Lost & Found | Upload valid photo; equivalence partitioning | JPEG/PNG photo | Sign in; open Lost & Found; choose a JPEG or PNG; upload with a found-item post. | Valid photo is accepted and shown on the post. | Valid JPEG/PNG photo was uploaded successfully. | PASS | Not run |
| TC_SC_002 | Lost & Found | Reject invalid file; negative validation | Corrupted file, script, or text document | Open Lost & Found; select invalid file; upload. | File is rejected with an invalid file-type message. | Invalid file was rejected and the error message was displayed. | PASS | Not run |
| TC_SC_003 | Lost & Found | Create post; functional test | Photo, title, and drop-off location | Open Lost & Found; add photo; enter title and location; submit. | Found-item post appears in the visual feed. | Post was created and displayed in the Lost & Found feed. | PASS | Not run |
| TC_SC_004 | Lost & Found | Claim found item; integration test | Existing found-item post | Open feed; select an item; click claim. | Internal conversation with the finder opens. | Claim action opened the internal email chat with the finder. | PASS | Not run |
| TC_SC_005 | Cleaning Service | Submit request; functional test | Building, floor, room | Open Cleaning Service; select building/floor/room; submit. | Ticket is created and janitor receives an alert. | Ticket was created and the responsible janitor alert was generated. | PASS | Not run |
| TC_SC_006 | Cleaning Service | Complete task; state transition | Existing cleaning ticket | Open cleaning alert; complete cleaning; tap Task Complete. | Cleaning ticket is closed. | Cleaning ticket was marked completed/closed. | PASS | Not run |
| TC_SC_007 | Cleaning Service | Report dirty-room state change; integration test | Dirty classroom/lab report | Submit dirty-room report; observe room status. | Room becomes Requires Attention, icon turns amber, janitor alert is triggered. | Room was marked Requires Attention, amber icon appeared, and alert was triggered. | PASS | Not run |

## Additional implementation checks to execute

| Check | Module | Input / action | Expected result | Run status |
|---|---|---|---|---|
| Boundary validation | Cleaning | Submit with one required field blank; enter issue text at the 100-character limit and beyond. | Blank field blocks submission; values within the limit are accepted and over-limit text cannot be entered. | Not run |
| Boundary validation | Lost & Found | Upload image at 2 MB and over 2 MB. | Image at the limit is accepted; larger image is rejected with a clear message. | Not run |
| Persistence | Both | Create a cleaning request and found-item post, then reload. | Both records remain visible in the same browser. | Not run |
| Search | Lost & Found | Search by title and location, then clear the query. | Matching card remains; unrelated cards are hidden; all cards return when cleared. | Not run |
| Claim/retest | Lost & Found | Claim an available post, send a message, reopen its conversation. | Post becomes Claimed and the saved conversation displays the new message. | Not run |

## Execution record

For each fresh run, fill in: **run date/time**, **browser/version**, **tester**, **actual result**, **status (Pass/Fail)**, **linked Jira issue (if failed)**, and **retest result**. Use `docs/defect-register.md` for any defect found. Apply functional testing, validation testing, equivalence partitioning, and boundary-value checks as appropriate.

