# Random Quote Email App

## Overview
A simple web application that sends inspirational quotes to users via email. Users enter their email address and receive a randomly selected quote delivered to their inbox.

## Frontend Features
- Clean, minimal interface with email input field
- "Send Me a Quote" button to trigger email delivery
- Email format validation before submission
- Success message display after successful email delivery
- Clear error messages for invalid emails or delivery failures

## Backend Features
- Store a curated collection of inspirational quotes (text only)
- Randomly select quotes from the stored collection
- Send selected quotes to user emails using Internet Computer's email capability
- Validate email input format
- Handle email sending errors and provide appropriate responses

## User Flow
1. User visits the application
2. User enters email address in input field
3. User clicks "Send Me a Quote" button
4. Frontend validates email format
5. Backend randomly selects a quote and sends email
6. Frontend displays confirmation or error message

## Data Storage
- Backend stores collection of inspirational quotes as text strings
- No user data persistence required (emails are not stored)

## Core Functionality
- Email format validation
- Random quote selection algorithm
- Email delivery via Internet Computer
- Error handling for failed email delivery
