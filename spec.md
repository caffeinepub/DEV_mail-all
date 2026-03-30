# Mail All - Bulk Email Marketing App

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Subscriber management: add/remove subscribers (name + email)
- Compose & send email: subject, body, send to all subscribers at once
- Campaign history: list of sent campaigns with timestamp, subject, recipient count
- Dashboard overview: subscriber count, emails sent

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Select email-marketing and authorization components
2. Generate Motoko backend with subscriber CRUD and campaign send/history
3. Build React frontend with:
   - Dashboard page (stats overview)
   - Subscribers page (list, add, remove)
   - Compose page (subject, body, send to all)
   - Campaigns history page
